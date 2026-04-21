// modules/operations/admin/AdminSurface.tsx
// Owns: PayMe admin/settings surface mounted at /admin.
// Ported from payme_checkout_transplant_bundle/payme-checkout-engine/admin/settings.tsx.

import { useState } from 'react';
import { DEFAULT_USDC_WALLET } from '../../conversion/checkout/usdcWallet';

// Test-system gate — basic username/password prompt in front of the admin
// surface. Credentials are intentionally NOT surfaced anywhere in the UI;
// the tile and form labels stay generic. Session-scoped so the operator
// isn't prompted on every in-session route change.
const ADMIN_USER = '55555';
const ADMIN_PASS = '55555';
const AUTH_SESSION_KEY = 'showroom.admin.authed.v1';

type AdminSettings = {
  stripeEnabled: boolean;
  usdcEnabled: boolean;
  applePayEnabled: boolean;
  googlePayEnabled: boolean;
  stripeSetupPriceId: string;
  stripeRecurringPriceId: string;
  stripeMode: 'payment' | 'subscription';
  setupAmountUsd: number;
  monthlyAmountUsd: number;
  usdcWallet: string;
};

// v2 schema — dropped paypal/venmo and split stripe price ids into
// setup + recurring; bumped storage key so stale v1 blobs don't hydrate
// into missing fields.
const STORAGE_KEY = 'showroom.payme.admin.v2';

const defaultSettings: AdminSettings = {
  stripeEnabled: true,
  usdcEnabled: false,
  applePayEnabled: true,
  googlePayEnabled: true,
  stripeSetupPriceId: '',
  stripeRecurringPriceId: '',
  stripeMode: 'subscription',
  setupAmountUsd: 0,
  monthlyAmountUsd: 0,
  usdcWallet: DEFAULT_USDC_WALLET,
};

function loadSettings(): AdminSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AdminSettings>) };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: AdminSettings) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable — non-fatal
  }
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  padding: 24,
  boxShadow:
    '0 4px 24px rgba(47,125,246,.10), 0 16px 40px rgba(10,37,64,.06)',
  maxWidth: 720,
  margin: '24px auto',
};

const sectionLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#5f6c7b',
  marginBottom: 8,
  marginTop: 24,
  textTransform: 'uppercase',
  letterSpacing: '.04em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #d5dce5',
  borderRadius: 12,
  fontSize: 14,
  boxSizing: 'border-box',
};

const labelWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  color: '#111827',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
};

const toggleRow: React.CSSProperties = {
  display: 'flex',
  gap: 24,
  flexWrap: 'wrap',
  marginBottom: 12,
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? '#2f7df6' : '#d5dce5',
          transition: 'background 120ms ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 120ms ease',
            boxShadow: '0 1px 2px rgba(0,0,0,.2)',
          }}
        />
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <span>{label}</span>
    </label>
  );
}

export function AdminSurface() {
  const [form, setForm] = useState<AdminSettings>(loadSettings);
  const [saved, setSaved] = useState('');

  // Gate state — all hooks declared unconditionally so the early return
  // below doesn't trip React's rules-of-hooks.
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const update = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    saveSettings(form);
    setSaved('Saved');
    setTimeout(() => setSaved(''), 2000);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
      setIsAuthed(true);
      setLoginError('');
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, '1');
      } catch {
        // sessionStorage unavailable — gate just won't persist
      }
    } else {
      setLoginError('Invalid credentials');
    }
  };

  // Auth gate — runs before the main admin surface. Credentials are NOT
  // displayed anywhere in this form; operators are expected to know them
  // out-of-band.
  if (!isAuthed) {
    return (
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          color: '#111827',
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: '100%',
            maxWidth: 300,
            background: '#fff',
            borderRadius: 16,
            padding: 20,
            boxShadow:
              '0 4px 24px rgba(47,125,246,.10), 0 16px 40px rgba(10,37,64,.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <h2 style={{ margin: 0, color: '#2f7df6', fontSize: 20 }}>
            Admin Sign-In
          </h2>
          <p style={{ margin: 0, color: '#5f6c7b', fontSize: 12 }}>
            Authorized access only.
          </p>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#5f6c7b' }}>
              Username
            </span>
            <input
              type="text"
              autoComplete="username"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              style={{
                padding: '9px 10px',
                border: '1px solid #d5dce5',
                borderRadius: 10,
                fontSize: 13,
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#5f6c7b' }}>
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              style={{
                padding: '9px 10px',
                border: '1px solid #d5dce5',
                borderRadius: 10,
                fontSize: 13,
              }}
            />
          </label>

          {loginError && (
            <div style={{ color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
              {loginError}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: 10,
              borderRadius: 10,
              border: 0,
              background: '#2f7df6',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 12px 48px', color: '#111827' }}>
      <div style={cardStyle}>
        <h2 style={{ color: '#2f7df6', marginTop: 0, marginBottom: 4, fontSize: 28 }}>
          PayMe Settings
        </h2>
        <p style={{ color: '#5f6c7b', marginTop: 0 }}>
          Configure payment methods and merchant credentials.
        </p>

        <div style={sectionLabel}>Payment methods</div>
        <div style={toggleRow}>
          <Toggle
            checked={form.stripeEnabled}
            onChange={(on) =>
              setForm((prev) => ({
                ...prev,
                stripeEnabled: on,
                applePayEnabled: on ? prev.applePayEnabled : false,
                googlePayEnabled: on ? prev.googlePayEnabled : false,
              }))
            }
            label="Stripe"
          />
          <Toggle
            checked={form.usdcEnabled}
            onChange={(v) => update('usdcEnabled', v)}
            label="USDC"
          />
        </div>
        <div style={toggleRow}>
          <Toggle
            checked={form.applePayEnabled}
            onChange={(v) => update('applePayEnabled', form.stripeEnabled ? v : false)}
            label="Apple Pay"
          />
          <Toggle
            checked={form.googlePayEnabled}
            onChange={(v) => update('googlePayEnabled', form.stripeEnabled ? v : false)}
            label="Google Pay"
          />
        </div>

        <div style={sectionLabel}>Stripe</div>
        <div style={gridStyle}>
          <label style={labelWrap}>
            <span>Stripe setup price id</span>
            <input
              value={form.stripeSetupPriceId}
              onChange={(e) => update('stripeSetupPriceId', e.target.value)}
              placeholder="price_setup_xxx"
              style={inputStyle}
            />
          </label>
          <label style={labelWrap}>
            <span>Stripe recurring price id</span>
            <input
              value={form.stripeRecurringPriceId}
              onChange={(e) => update('stripeRecurringPriceId', e.target.value)}
              placeholder="price_monthly_xxx"
              style={inputStyle}
            />
          </label>
          <label style={labelWrap}>
            <span>Stripe mode</span>
            <select
              value={form.stripeMode}
              onChange={(e) =>
                update('stripeMode', e.target.value as AdminSettings['stripeMode'])
              }
              style={inputStyle}
            >
              <option value="payment">One-time payment</option>
              <option value="subscription">Subscription</option>
            </select>
          </label>
          <label style={labelWrap}>
            <span>Setup amount USD</span>
            <input
              type="number"
              min={0}
              step="1"
              value={Number.isFinite(form.setupAmountUsd) ? form.setupAmountUsd : 0}
              onChange={(e) =>
                update('setupAmountUsd', Number(e.target.value) || 0)
              }
              placeholder="199"
              style={inputStyle}
            />
          </label>
          <label style={labelWrap}>
            <span>Monthly amount USD</span>
            <input
              type="number"
              min={0}
              step="1"
              value={Number.isFinite(form.monthlyAmountUsd) ? form.monthlyAmountUsd : 0}
              onChange={(e) =>
                update('monthlyAmountUsd', Number(e.target.value) || 0)
              }
              placeholder="20"
              style={inputStyle}
            />
          </label>
        </div>

        <div style={sectionLabel}>USDC</div>
        <div style={gridStyle}>
          <label style={labelWrap}>
            <span>USDC wallet (Base)</span>
            <input
              value={form.usdcWallet}
              onChange={(e) => update('usdcWallet', e.target.value)}
              placeholder="0x..."
              style={inputStyle}
            />
            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 400 }}>
              1% transaction fee applies
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 28 }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              background: '#2f7df6',
              color: '#fff',
              border: 0,
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Save settings
          </button>
          {saved && (
            <span style={{ marginLeft: 12, color: '#166534', fontWeight: 600 }}>{saved}</span>
          )}
        </div>
      </div>
    </div>
  );
}
