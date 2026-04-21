// modules/conversion/checkout/useWalletConnection.ts
// Tracks injected-wallet connection state (address + chainId) and reacts
// to account/chain changes fired by the provider. Lightweight — no
// auto-connect on mount so the user stays in control of the prompt.

import { useCallback, useEffect, useState } from 'react';
import {
  getProvider,
  getCurrentChainIdHex,
  requestAccounts,
  switchToBase,
} from './usdcWallet';

export type WalletState = {
  address: string | null;
  chainIdHex: string | null;
  connecting: boolean;
  error: string | null;
};

const emptyState: WalletState = {
  address: null,
  chainIdHex: null,
  connecting: false,
  error: null,
};

export function useWalletConnection() {
  const [state, setState] = useState<WalletState>(emptyState);

  // Silently detect an already-approved wallet on mount using eth_accounts
  // (no popup). If found, skip the manual "Connect Wallet" click so the first
  // user action goes straight to the payment signing prompt.
  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;
    provider
      .request({ method: 'eth_accounts' })
      .then(async (result) => {
        const accounts = result as string[];
        if (accounts.length === 0) return;
        const chainIdHex = await getCurrentChainIdHex();
        setState({ address: accounts[0] ?? null, chainIdHex, connecting: false, error: null });
      })
      .catch(() => {});
  }, []);

  // Resync chain + address whenever the provider fires an event, so the
  // UI can flip between "Switch to Base" and "Pay …" without a reload.
  useEffect(() => {
    const provider = getProvider();
    if (!provider || !provider.on || !provider.removeListener) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = (args[0] as string[]) ?? [];
      setState((prev) => ({
        ...prev,
        address: accounts[0] ?? null,
      }));
    };
    const handleChainChanged = (...args: unknown[]) => {
      const chainId = args[0] as string;
      setState((prev) => ({ ...prev, chainIdHex: chainId }));
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, connecting: true, error: null }));
    try {
      const accounts = await requestAccounts();
      const chainIdHex = await getCurrentChainIdHex();
      setState({
        address: accounts[0] ?? null,
        chainIdHex,
        connecting: false,
        error: accounts[0] ? null : 'Wallet did not return an account.',
      });
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ?? 'Failed to connect wallet.';
      setState((prev) => ({ ...prev, connecting: false, error: message }));
    }
  }, []);

  const switchNetwork = useCallback(async () => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      await switchToBase();
      const chainIdHex = await getCurrentChainIdHex();
      setState((prev) => ({ ...prev, chainIdHex }));
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ?? 'Failed to switch network.';
      setState((prev) => ({ ...prev, error: message }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return { ...state, connect, switchNetwork, clearError };
}
