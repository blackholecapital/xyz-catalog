// modules/trust/webhook-verification/verifyWebhook.ts
// Owns: Inbound webhook signature verification
// First slice: stub — no inbound webhooks yet

export type WebhookVerificationResult = {
  valid: boolean;
  reason?: string;
};

export function verifyWebhookSignature(
  _payload: string,
  _signature: string,
  _secret: string,
): WebhookVerificationResult {
  // First slice stub — will be wired to production/adapters/payments
  return { valid: false, reason: 'Webhook verification not yet implemented' };
}
