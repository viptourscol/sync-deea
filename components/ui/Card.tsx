import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function Card({ children, className, noPadding }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${!noPadding && 'p-6'} ${className}`}>
      {children}
    </div>
  );
}
