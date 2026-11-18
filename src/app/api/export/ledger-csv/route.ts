import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const weddingId = searchParams.get('weddingId') || 'wed-001';

  let entries = [];

  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from('ledger_entries')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('received_date', { ascending: false });
    if (data) entries = data;
  } else {
    entries = mockStore.getLedger(weddingId);
  }

  // Construct CSV
  const headers = ['Date', 'Guest Name', 'Amount (INR)', 'Gift Type', 'Milestone Fund', 'Blessing / Notes', 'Thank You Sent'];
  const rows = entries.map((e) => [
    `"${e.received_date}"`,
    `"${(e.guest_name || '').replace(/"/g, '""')}"`,
    e.amount,
    `"${e.gift_type}"`,
    `"${(e.fund_title || '').replace(/"/g, '""')}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
    e.thank_you_sent ? 'Yes' : 'No',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="shagun-ledger-${weddingId}-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

