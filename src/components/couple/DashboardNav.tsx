'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Heart,
  LayoutDashboard,
  Calendar,
  Gift,
  BookOpenCheck,
  Camera,
  QrCode,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';

interface DashboardNavProps {
  slug?: string;
  coupleNames?: string;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  slug = 'aadarsh-and-shivani',
  coupleNames = 'Aadarsh & Shivani',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Wedding & Events', href: '/dashboard/wedding', icon: Calendar },
    { name: 'Gift Funds', href: '/dashboard/funds', icon: Gift },
    { name: 'Shagun Ledger', href: '/dashboard/ledger', icon: BookOpenCheck },
    { name: 'Disposable Camera', href: '/dashboard/camera', icon: Camera },
    { name: 'Printable Poster', href: '/dashboard/poster', icon: QrCode },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shagun_user_session');
    }
    router.push('/auth/login');
  };

  return (
    <header className="bg-white border-b border-amber-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Couple Badge */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-maroon-900 flex items-center justify-center text-amber-300 shadow-xs">
                <Heart className="w-5 h-5 fill-amber-300" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-maroon-950">Shagun</span>
            </Link>
            <div className="hidden md:flex items-center text-xs bg-amber-100/70 border border-amber-300/80 px-2.5 py-1 rounded-full text-maroon-900 font-medium">
              <span>{coupleNames}</span>
            </div>
          </div>

          {/* Quick link to live guest page */}
          <div className="flex items-center gap-3">
            <Link
              href={`/w/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-maroon-900 bg-amber-100 hover:bg-amber-200 transition-colors"
            >
              <span>View Guest Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-maroon-900 rounded-lg hover:bg-gray-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none border-t border-amber-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-maroon-900 text-amber-100 shadow-xs'
                    : 'text-gray-600 hover:text-maroon-900 hover:bg-amber-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

