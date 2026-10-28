import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
