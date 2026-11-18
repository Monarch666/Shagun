import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Celebration | Shagun',
  description: 'Join in our wedding celebrations, send your heartfelt blessings, and capture moments with our venue disposable camera.',
};

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col">
      {children}
    </div>
  );
}

