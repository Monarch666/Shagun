import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-amber-200/70 shadow-sm shadow-amber-900/5 overflow-hidden transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-md hover:shadow-maroon-900/10 hover:border-amber-400 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

