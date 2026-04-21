import { NavLink, useLocation } from 'react-router-dom';
import { routePaths } from '@/routes/paths';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';

const actions = [
  {
    to: routePaths.browse,
    label: 'Browse',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    to: routePaths.estimate,
    label: 'Build',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    to: routePaths.checkout,
    label: 'Buy',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const location = useLocation();
  const { items } = useEstimate();
  const buildCount = items.length;

  // Build tab is visually highlighted on browse pages to guide "this is where you go next"
  const isBrowseArea = location.pathname === routePaths.browse || location.pathname.startsWith(routePaths.browse + '/');
  const isEstimatePage = location.pathname === routePaths.estimate;

  return (
    <nav className="shrink-0 px-2 pb-1 pt-1">
      {/* My Build — directive progress anchor (hidden on estimate page) */}
      {!isEstimatePage && <NavLink
        to={routePaths.estimate}
        className="mx-1 mb-1.5 flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 px-4 py-2 shadow-[0_2px_12px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] hover:scale-[1.01] active:scale-[0.98]"
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
          <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
          {buildCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
          )}
        </span>
        <div className="flex-1">
          <p className="text-[13px] font-bold leading-tight text-white">My Build</p>
          <p className="text-[10px] font-medium leading-tight text-white/80">
            {buildCount > 0 ? `${buildCount} product${buildCount !== 1 ? 's' : ''} saved` : 'Start building \u2192'}
          </p>
        </div>
        {buildCount > 0 ? (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/30 px-1.5 text-[11px] font-extrabold text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
            {buildCount}
          </span>
        ) : (
          <svg className="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        )}
      </NavLink>}

      {/* Nav tabs — Build is highlighted when on browse to guide flow */}
      <div className="grid grid-cols-3">
        {actions.map((action) => {
          const isPathActive = location.pathname === action.to || location.pathname.startsWith(action.to + '/');
          const isBuildTab = action.label === 'Build';
          const isHighlighted = isPathActive || (isBuildTab && isBrowseArea && buildCount > 0);
          return (
            <NavLink
              key={action.to}
              to={action.to}
              className={`flex min-h-9 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold transition-all hover:scale-[1.03] active:scale-[0.95] ${
                isHighlighted
                  ? 'font-bold text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {action.icon}
              <span>{action.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
