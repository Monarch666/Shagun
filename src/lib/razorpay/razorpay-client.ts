import crypto from 'crypto';
import Razorpay from 'razorpay';

export function getRazorpayClient() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_12345';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mock_razorpay_secret_key';

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Verifies Razorpay Webhook Signature
 * signature = crypto.HmacSHA256(rawBody, secret).toString(crypto.enc.Hex)
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!rawBody || !signature || !secret) {
    return false;
  }
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch (err) {
    console.error('Error verifying Razorpay webhook signature:', err);
    return false;
  }
}

