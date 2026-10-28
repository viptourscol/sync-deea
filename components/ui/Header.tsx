import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, icon, action }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          {icon && <div className="text-blue-600 flex-shrink-0">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
