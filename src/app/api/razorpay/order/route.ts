import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay/razorpay-client';
import { mockStore } from '@/lib/supabase/mock-store';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      weddingId,
      fundId,
      amount,
      guestName,
      blessingMessage,
      isAmountHidden,
    } = body;

    // Validation
    if (!weddingId || !amount || amount <= 0 || !guestName) {
      return NextResponse.json(
        { error: 'Missing required contribution fields' },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_12345';
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMock = !keySecret || keySecret === 'mock_razorpay_secret_key';

    let orderId = '';

    if (!isMock) {
      const razorpay = getRazorpayClient();
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // amount in paise
        currency: 'INR',
        receipt: `shagun_${Date.now()}`,
        notes: {
          weddingId,
          fundId: fundId || '',
          guestName,
        },
      });
      orderId = order.id;
    } else {
      // Mock Razorpay Order for test/dev mode
      orderId = `order_mock_${Date.now()}`;
    }

    // Record pending contribution in DB
    const supabase = createServerSupabaseClient();
    if (supabase) {
      await supabase.from('contributions').insert({
        wedding_id: weddingId,
        fund_id: fundId || null,
        guest_name: guestName,
        amount: amount,
        blessing_message: blessingMessage || null,
        is_amount_hidden: !!isAmountHidden,
        razorpay_order_id: orderId,
        status: 'pending',
      });
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: amount * 100, // in paise for Razorpay checkout
      currency: 'INR',
      keyId,
      isMock,
    });
  } catch (err: any) {
    console.error('Error creating Razorpay order:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

