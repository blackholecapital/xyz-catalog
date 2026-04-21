// production/main.tsx
// App entry point — wires providers and shell router

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { shellRouter } from '../product-shell/ShellRouter';
import { CartProvider } from '../modules/conversion/cart/CartProvider';
import { PaymentTruthProvider } from '../modules/trust/payment-truth/PaymentTruthProvider';
import { NotificationProvider } from '../modules/operations/notifications/NotificationProvider';
import { AuthBoundary } from '../modules/trust/auth-boundary/AuthBoundary';
import { ResolverProvider } from '../resolver-boundary/ResolverProvider';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthBoundary>
      <NotificationProvider>
        <CartProvider>
          <PaymentTruthProvider>
            <ResolverProvider>
              <RouterProvider router={shellRouter} />
            </ResolverProvider>
          </PaymentTruthProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthBoundary>
  </React.StrictMode>,
);
