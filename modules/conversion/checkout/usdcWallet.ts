// modules/conversion/checkout/usdcWallet.ts
// EIP-1193 USDC-on-Base helpers: connect, enforce Base network, transfer.
// Kept dep-free — talks directly to window.ethereum with raw JSON-RPC so
// the bundle doesn't pull wagmi/viem/ethers into the checkout card.

export const BASE_CHAIN_ID = 8453;
export const BASE_CHAIN_ID_HEX = '0x2105';
export const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const USDC_DECIMALS = 6;

// localStorage key + field match AdminSurface.tsx. Checkout reads the
// admin-configured receive wallet out of the same blob so settings flow
// through without a second source of truth.
const ADMIN_STORAGE_KEY = 'showroom.payme.admin.v2';
const ADMIN_USDC_WALLET_FIELD = 'usdcWallet';

// Default receive address — used when admin has not configured a custom wallet.
// Must be exactly 40 hex chars after `0x` or `isAddress` rejects it and the
// transfer throws before the wallet is prompted.
export const DEFAULT_USDC_WALLET = '0x03a71f0695DACde00CcECc622556F711E2bD50A0';

type EthRequest = (args: { method: string; params?: unknown[] }) => Promise<unknown>;
type EthListener = (...args: unknown[]) => void;

type InjectedProvider = {
  request: EthRequest;
  on?: (event: string, handler: EthListener) => void;
  removeListener?: (event: string, handler: EthListener) => void;
};

declare global {
  interface Window {
    ethereum?: InjectedProvider;
  }
}

export function getProvider(): InjectedProvider | null {
  if (typeof window === 'undefined') return null;
  return window.ethereum ?? null;
}

export function readAdminUsdcWallet(): string {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const addr = parsed[ADMIN_USDC_WALLET_FIELD];
        if (typeof addr === 'string' && isAddress(addr)) return addr;
      }
    } catch {
      // fall through to default
    }
  }
  return DEFAULT_USDC_WALLET;
}

export function isAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function isBaseChain(chainIdHex: string | null): boolean {
  if (!chainIdHex) return false;
  return chainIdHex.toLowerCase() === BASE_CHAIN_ID_HEX;
}

export async function requestAccounts(): Promise<string[]> {
  const provider = getProvider();
  if (!provider) throw new Error('No web3 wallet detected. Open this page inside your wallet browser.');
  const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
  return accounts ?? [];
}

export async function getCurrentChainIdHex(): Promise<string | null> {
  const provider = getProvider();
  if (!provider) return null;
  try {
    return (await provider.request({ method: 'eth_chainId' })) as string;
  } catch {
    return null;
  }
}

export async function switchToBase(): Promise<void> {
  const provider = getProvider();
  if (!provider) throw new Error('No web3 wallet detected.');
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID_HEX }],
    });
  } catch (err: unknown) {
    // 4902 = chain not yet added to wallet — try to add it, then the user
    // can flip over manually from the wallet's network picker.
    const code = (err as { code?: number })?.code;
    if (code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: BASE_CHAIN_ID_HEX,
            chainName: 'Base',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export function toUsdcBaseUnits(usdAmount: number): bigint {
  // USDC has 6 decimals. Round to nearest 1e-6 USDC unit to avoid binary
  // float drift bleeding into the integer amount.
  const scaled = Math.round(usdAmount * 10 ** USDC_DECIMALS);
  return BigInt(scaled);
}

// ERC-20 `transfer(address,uint256)` — selector 0xa9059cbb.
export function encodeErc20Transfer(to: string, amount: bigint): string {
  const selector = 'a9059cbb';
  const toPadded = to.toLowerCase().replace(/^0x/, '').padStart(64, '0');
  const amountPadded = amount.toString(16).padStart(64, '0');
  return '0x' + selector + toPadded + amountPadded;
}

export async function sendUsdcTransfer(args: {
  from: string;
  to: string;
  amountUsd: number;
}): Promise<string> {
  const provider = getProvider();
  if (!provider) throw new Error('No web3 wallet detected.');
  if (!isAddress(args.to)) throw new Error('Admin USDC wallet is not configured.');
  if (!isAddress(args.from)) throw new Error('Wallet is not connected.');
  if (!(args.amountUsd > 0)) throw new Error('Payment amount must be greater than zero.');

  const baseUnits = toUsdcBaseUnits(args.amountUsd);
  const data = encodeErc20Transfer(args.to, baseUnits);

  const txHash = (await provider.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: args.from,
        to: USDC_BASE_ADDRESS,
        data,
        value: '0x0',
      },
    ],
  })) as string;

  return txHash;
}
