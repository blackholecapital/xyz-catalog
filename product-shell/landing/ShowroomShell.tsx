// product-shell/landing/ShowroomShell.tsx
// The single shell — owns header, main slot, bottom nav, and modal slot

import React, { type PropsWithChildren, useState } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useResolvers } from '../../resolver-boundary/ResolverProvider';

type AuthTab = 'login' | 'signup';

export function ShowroomShell({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const { products, cart } = useResolvers();
  const cartState = cart.getState();
  const [modalContent] = useState<React.ReactNode>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');

  const openAuth = () => {
    setAuthTab('login');
    setAuthOpen(true);
  };
  const closeAuth = () => setAuthOpen(false);

  const handleAddActiveProduct = () => {
    const activeId = cartState.activeProductId;
    if (!activeId) return;
    const activeProduct = products.getById(activeId);
    if (!activeProduct) return;
    cart.addItem(activeProduct.name, activeId);
  };

  const activeInBuild = cartState.activeProductId != null
    && cartState.items.some((item) => item.productId === cartState.activeProductId);

  const isActive = (path: string) => location.pathname === path;
  const isShowroom = location.pathname === '/';
  const isProfile = location.pathname.startsWith('/profile/');
  const isGallery = location.pathname === '/gallery';
  const isCart = location.pathname === '/cart';
  const profileProduct = isProfile && params.id ? products.getById(params.id) : undefined;

  const headerTitle = profileProduct
    ? profileProduct.name
    : isGallery
      ? 'Build'
      : isCart
        ? 'PayMe Checkout'
        : 'Payments';

  const headerSubtitle = profileProduct
    ? profileProduct.oneLinePromise
    : isGallery
      ? 'custom software powered by xyz-Labs'
      : null;

  return (
    <div className="flex justify-center sm:items-center h-[100dvh] overflow-hidden bg-[hsl(var(--color-app-bg))] sm:bg-neutral-950 sm:p-4">
      <div
        className={`relative w-full max-w-full h-[100dvh] shadow-xl flex flex-col overflow-hidden sm:w-[410px] sm:h-[864px] sm:max-h-[calc(100dvh-2rem)] sm:rounded-[3rem] sm:border-[10px] sm:border-neutral-900 sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ${isShowroom ? 'bg-transparent' : 'bg-[hsl(var(--color-surface))]'}`}
        style={{ transform: 'translateZ(0)' }}
      >
        {/* shell.header — hidden on showroom landing (M avatar is overlaid
            separately below so it stays global on every surface) */}
        {!isShowroom && (
          <header className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
            <div className="flex items-baseline gap-2 min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-[hsl(var(--color-primary))] flex-shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                {headerTitle}
              </h1>
              {headerSubtitle && (
                <p className="text-xs text-[hsl(var(--color-muted-foreground))] truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                  {headerSubtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={openAuth}
              aria-label="Sign up or log in"
              className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-sm"
            >
              <img src="/favicon.png" alt="" className="w-full h-full object-cover" />
            </button>
          </header>
        )}

        {/* Global avatar — floats top-right on the showroom landing so
            the sign-up / log-in entry point is reachable on every page.
            The avatar now renders favicon.png; two device-mode chips
            (PC / mobile) stack beneath it as a visual hint. */}
        {isShowroom && (
          <div className="absolute top-3 right-4 z-20 flex flex-col items-center gap-[5px]">
            <button
              type="button"
              onClick={openAuth}
              aria-label="Sign up or log in"
              className="w-8 h-8 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
            >
              <img src="/favicon.png" alt="" className="w-full h-full object-cover" />
            </button>
            {/* TV / monitor icon — greyed PC-mode hint */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-[17px] h-[17px] text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            {/* Phone icon — blue mobile-mode hint */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-[17px] h-[17px] text-[hsl(var(--color-primary))]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@xyz-Labs-xyz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z" />
              </svg>
            </a>
            {/* Discord */}
            <a
              href="https://discord.com/invite/NyYT6YNWZJ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="currentColor">
                <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3c-.2.4-.5.9-.7 1.3a18.3 18.3 0 0 0-5.4 0A13.5 13.5 0 0 0 8.6 3a19.7 19.7 0 0 0-4.9 1.4C.5 9.2-.3 13.9.1 18.5a19.9 19.9 0 0 0 6 3 14.7 14.7 0 0 0 1.3-2.1 13 13 0 0 1-2-.9l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4a13 13 0 0 1-2 1 14.7 14.7 0 0 0 1.3 2c2.1-.6 4.2-1.6 6-3 .5-5.2-.8-9.8-3.6-13.9zM8 15.5c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4zm8 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4z" />
              </svg>
            </a>
            {/* X (Twitter) */}
            <a
              href="https://x.com/Mktmakerxyz?s=21"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="currentColor">
                <path d="M18.9 1.2h3.4l-7.4 8.5L23.6 22.8h-6.8l-5.3-7-6.1 7H2l7.9-9L1 1.2h7l4.8 6.4 5.1-6.4zm-1.2 19.4h1.9L6.5 3.1H4.4L17.7 20.6z" />
              </svg>
            </a>
          </div>
        )}

        {/* shell.main */}
        <main className={`flex-1 ${isShowroom ? 'overflow-hidden flex flex-col relative' : 'overflow-y-auto'}`}>
          <Outlet />
          {children}
        </main>

        {/* shell.bottom-nav: Browse / Add / Build(N) / Basket — consistent across every surface */}
        <nav className="relative z-10 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))]">
          <div className="grid grid-cols-4 pt-2">
            {/* Browse */}
            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center gap-0.5 text-xs py-1 ${isActive('/') ? 'text-[hsl(var(--color-primary))] font-semibold' : 'text-[hsl(var(--color-muted-foreground))]'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Browse
            </button>
            {/* Add — adds the currently focused product to the build */}
            <button
              onClick={handleAddActiveProduct}
              disabled={!cartState.activeProductId || activeInBuild}
              className="flex flex-col items-center gap-0.5 text-xs py-1 text-[hsl(var(--color-muted-foreground))] disabled:opacity-40"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Add
            </button>
            {/* Build(N) — construction hard hat routes to the build page */}
            <button
              onClick={() => navigate('/gallery')}
              className={`flex flex-col items-center gap-0.5 text-xs py-1 ${isActive('/gallery') ? 'text-[hsl(var(--color-primary))] font-semibold' : 'text-[hsl(var(--color-muted-foreground))]'}`}
            >
              {/* Construction hard hat */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-1a2 2 0 012-2h14a2 2 0 012 2v1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 15v-2a6 6 0 0112 0v2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9V6h4v3" />
              </svg>
              Build ({cartState.items.length})
            </button>
            {/* Basket — cart icon routes to the basket placeholder */}
            <button
              onClick={() => navigate('/cart')}
              className={`flex flex-col items-center gap-0.5 text-xs py-1 ${isActive('/cart') ? 'text-[hsl(var(--color-primary))] font-semibold' : 'text-[hsl(var(--color-muted-foreground))]'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              Basket
            </button>
          </div>
        </nav>

        {/* shell.modal */}
        {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {modalContent}
          </div>
        )}

        {/* Auth modal — globally triggered by the M avatar on any surface.
            Renders inside the phone frame via the shell container so it's
            visually scoped to the shell and not the desktop bg. */}
        {authOpen && (
          <div
            className="absolute inset-0 z-40 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
            onClick={closeAuth}
          >
            <div
              className="w-full max-w-[320px] rounded-2xl bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 pt-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                  M
                </div>
                <button
                  type="button"
                  onClick={closeAuth}
                  aria-label="Close"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-5 pt-2 pb-5 space-y-3">
                <h2 className="text-lg font-bold text-slate-900">
                  {authTab === 'login' ? 'Log in' : 'Sign up'}
                </h2>
                <p className="text-xs text-slate-500 -mt-2">
                  {authTab === 'login'
                    ? 'Welcome back — pick up where you left off.'
                    : 'Create an account to save your build.'}
                </p>

                {/* Tab toggle */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setAuthTab('login')}
                    className={`py-2 rounded-lg transition-colors ${
                      authTab === 'login'
                        ? 'bg-white shadow text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('signup')}
                    className={`py-2 rounded-lg transition-colors ${
                      authTab === 'signup'
                        ? 'bg-white shadow text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                <div className="space-y-2">
                  {authTab === 'signup' && (
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={closeAuth}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 text-white font-semibold text-sm shadow"
                >
                  {authTab === 'login' ? 'Log in' : 'Create account'}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  {authTab === 'login' ? (
                    <>
                      New here?{' '}
                      <button
                        type="button"
                        className="text-[hsl(var(--color-primary))] font-semibold"
                        onClick={() => setAuthTab('signup')}
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Have an account?{' '}
                      <button
                        type="button"
                        className="text-[hsl(var(--color-primary))] font-semibold"
                        onClick={() => setAuthTab('login')}
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
