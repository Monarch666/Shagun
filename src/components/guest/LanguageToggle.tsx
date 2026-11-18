'use client';

import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export type LocaleCode = 'en' | 'hi' | 'mr';

interface LanguageToggleProps {
  onLanguageChange?: (locale: LocaleCode) => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  onLanguageChange,
  className = '',
}) => {
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = (localStorage.getItem('shagun_guest_locale') as LocaleCode) || 'en';
      setCurrentLocale(saved);
    }
  }, []);

  const handleSelect = (locale: LocaleCode) => {
    setCurrentLocale(locale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shagun_guest_locale', locale);
    }
    if (onLanguageChange) {
      onLanguageChange(locale);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1 bg-maroon-900/90 text-amber-100 p-1 rounded-full border border-amber-400/50 shadow-md text-xs font-medium ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-amber-300 ml-1.5 mr-0.5" />
      <button
        onClick={() => handleSelect('en')}
        className={`px-2.5 py-1 rounded-full transition-all ${
          currentLocale === 'en'
            ? 'bg-amber-400 text-maroon-950 font-bold shadow-xs'
            : 'text-amber-200 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleSelect('hi')}
        className={`px-2.5 py-1 rounded-full transition-all ${
          currentLocale === 'hi'
            ? 'bg-amber-400 text-maroon-950 font-bold shadow-xs'
            : 'text-amber-200 hover:text-white'
        }`}
      >
        हिंदी
      </button>
      <button
        onClick={() => handleSelect('mr')}
        className={`px-2.5 py-1 rounded-full transition-all ${
          currentLocale === 'mr'
            ? 'bg-amber-400 text-maroon-950 font-bold shadow-xs'
            : 'text-amber-200 hover:text-white'
        }`}
      >
        मराठी
      </button>
    </div>
  );
};

