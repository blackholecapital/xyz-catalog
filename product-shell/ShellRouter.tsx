// product-shell/ShellRouter.tsx
// Wires the single shell to first-slice routes via React Router

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ShowroomShell } from './landing/ShowroomShell';

// Module surface imports — each module owns its surface
import { ShowroomLanding } from '../modules/engagement/showroom/ShowroomLanding';
import { GallerySurface } from '../modules/engagement/gallery/GallerySurface';
import { ProfileExpanded } from '../modules/engagement/profile/ProfileExpanded';
import { CartSurface } from '../modules/conversion/cart/CartSurface';
import { CheckoutFlow } from '../modules/conversion/checkout/CheckoutFlow';
import { PaymentConfirmation } from '../modules/conversion/checkout/PaymentConfirmation';
import { AdminSurface } from '../modules/operations/admin/AdminSurface';

export const shellRouter = createBrowserRouter([
  {
    element: <ShowroomShell />,
    children: [
      { path: '/', element: <ShowroomLanding /> },
      { path: '/gallery', element: <GallerySurface /> },
      { path: '/profile/:id', element: <ProfileExpanded /> },
      { path: '/cart', element: <CartSurface /> },
      { path: '/checkout', element: <CheckoutFlow /> },
      { path: '/checkout/confirm', element: <PaymentConfirmation /> },
      { path: '/admin', element: <AdminSurface /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
