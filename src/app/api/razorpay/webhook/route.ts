import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay/razorpay-client';
import { mockStore } from '@/lib/supabase/mock-store';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_webhook_secret_key';

    // Verify webhook signature (unless mock test mode without live secret)
    const isMock = !process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET === 'mock_webhook_secret_key';

    if (!isMock) {
      if (!signature || !verifyRazorpayWebhookSignature(rawBody, signature, secret)) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // We process payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const amount = paymentEntity?.amount ? Math.round(paymentEntity.amount / 100) : 0;
      const notes = paymentEntity?.notes || {};
      const weddingId = notes.weddingId || 'wed-001';
      const fundId = notes.fundId || null;
      const guestName = notes.guestName || paymentEntity?.email || 'Wedding Guest';
      const blessingMessage = notes.blessingMessage || '';

      const supabase = createServerSupabaseClient();
      if (supabase) {
        // Idempotency check: see if paymentId was already captured
        const { data: existing } = await supabase
          .from('contributions')
          .select('id, status')
          .eq('razorpay_payment_id', paymentId)
          .single();

        if (existing && existing.status === 'captured') {
          return NextResponse.json({ received: true, message: 'Already processed' }, { status: 200 });
        }

        // Update contribution to captured
        await supabase
          .from('contributions')
          .update({
            status: 'captured',
            razorpay_payment_id: paymentId,
            captured_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', orderId);
      } else {
        // Mock store update
        mockStore.recordCapturedContribution({
          wedding_id: weddingId,
          fund_id: fundId,
          guest_name: guestName,
          amount: amount,
          blessing_message: blessingMessage,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('Error handling Razorpay webhook:', err);
    return NextResponse.json({ error: err?.message || 'Webhook processing failed' }, { status: 500 });
  }
}

