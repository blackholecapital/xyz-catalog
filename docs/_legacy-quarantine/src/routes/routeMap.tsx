import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DiscoveryPage } from '@/pages/discovery/DiscoveryPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { routePaths } from '@/routes/paths';
import { EstimateSavePath } from '@/estimate-save-path/EstimateSavePath';
import { PayMeBoundary } from '@/checkout-path/PayMeBoundary';

export const appRoutes: RouteObject[] = [
  {
    path: routePaths.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={routePaths.browse} replace /> },
      { path: routePaths.browse.slice(1), element: <DiscoveryPage /> },
      { path: `${routePaths.product.slice(1)}/:id?`, element: <ProfilePage /> },
      { path: routePaths.estimate.slice(1), element: <EstimateSavePath /> },
      { path: `${routePaths.checkout.slice(1)}/:productId?`, element: <div className="px-4 pt-5"><PayMeBoundary /></div> },
      { path: '*', element: <Navigate to={routePaths.browse} replace /> }
    ]
  },
  { path: '*', element: <Navigate to={routePaths.browse} replace /> }
];
