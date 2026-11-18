import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'maroon' | 'marigold' | 'gold' | 'green' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'maroon',
  size = 'md',
}) => {
  const variantStyles = {
    maroon: 'bg-maroon-100 text-maroon-900 border-maroon-200',
    marigold: 'bg-amber-100 text-amber-900 border-amber-300',
    gold: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs sm:text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyles[size]} ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
};

