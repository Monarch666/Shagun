import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-5 py-2.5 text-base min-h-[48px]', // Meets 48px touch target rule
    lg: 'px-7 py-3.5 text-lg min-h-[56px]',
  };

  const variantStyles = {
    primary: 'bg-maroon-900 text-amber-50 hover:bg-maroon-800 focus:ring-maroon-700 shadow-md shadow-maroon-950/20',
    secondary: 'bg-marigold-600 text-white hover:bg-marigold-700 focus:ring-marigold-500 shadow-md shadow-marigold-600/20',
    outline: 'border-2 border-maroon-900 text-maroon-900 bg-transparent hover:bg-maroon-50 focus:ring-maroon-900',
    gold: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-maroon-950 font-semibold hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500 shadow-lg shadow-amber-500/25',
    ghost: 'text-maroon-900 bg-transparent hover:bg-maroon-100/50 focus:ring-maroon-700',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-600',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

