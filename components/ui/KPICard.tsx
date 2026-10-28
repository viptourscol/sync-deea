import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'red' | 'amber' | 'green' | 'blue' | 'purple' | 'indigo' | 'cyan';
}

export default function KPICard({ title, value, subtitle, icon, trend, color = 'blue' }: KPICardProps) {
  const colors = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  };

  const c = colors[color];

  return (
    <div className={`${c.bg} border-2 ${c.border} rounded-lg p-6 transition hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-4xl font-bold ${c.text} mt-2`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
          {trend && (
            <div className={`text-xs font-semibold mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {icon && <div className={`${c.text} p-3 bg-white rounded-lg`}>{icon}</div>}
      </div>
    </div>
  );
}
