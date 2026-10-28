import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function SkeletonLine({ className = 'w-full h-4 rounded' }: SkeletonProps) {
  return <div className={`${className} bg-gray-200 animate-pulse`}></div>;
}

export function SkeletonCard({ className = 'p-6' }: SkeletonProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <SkeletonLine className="h-6 w-1/2 mb-4" />
      <div className="space-y-3">
        <SkeletonLine className="h-4" />
        <SkeletonLine className="h-4 w-5/6" />
        <SkeletonLine className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonLine key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function Skeleton({ className = 'w-full h-12 rounded' }: SkeletonProps) {
  return <div className={`${className} bg-gray-200 animate-pulse`}></div>;
}
