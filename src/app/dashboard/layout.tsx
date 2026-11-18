'use client';

import React, { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/couple/DashboardNav';
import { mockStore } from '@/lib/supabase/mock-store';
import { Wedding } from '@/lib/supabase/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wedding, setWedding] = useState<Wedding | null>(null);

  useEffect(() => {
    // In mock/local mode, grab the default or saved wedding
    const w = mockStore.getWeddingById('wed-001') || mockStore.getWeddingBySlug('aadarsh-and-shivani');
    if (w) setWedding(w);
  }, []);

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col">
      <DashboardNav
        slug={wedding?.slug || 'aadarsh-and-shivani'}
        coupleNames={wedding ? `${wedding.partner_1_name} & ${wedding.partner_2_name}` : 'Aadarsh & Shivani'}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

