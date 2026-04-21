// modules/conversion/checkout/PaymentConfirmation.tsx
// Owns: Payment confirmation surface — return to showroom

import { useNavigate } from 'react-router-dom';

export function PaymentConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Success Icon */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-card-enter">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-[hsl(var(--color-foreground))] mb-2">Payment Confirmed</h2>
      <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-8 max-w-[280px]">
        Your order has been placed successfully. You'll receive a confirmation shortly.
      </p>

      <button
        onClick={() => navigate('/')}
        className="w-full max-w-[280px] py-3 rounded-[1.5rem] bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 text-white font-semibold text-sm shadow-md add-ripple-effect"
      >
        Return to Showroom
      </button>
    </div>
  );
}
