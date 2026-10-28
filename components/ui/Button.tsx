import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center gap-2';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-gray-400',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400 disabled:bg-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-gray-400',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>}
      {icon && !loading && icon}
      {children}
    </button>
  );
}
