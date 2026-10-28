'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  Menu,
  LogOut,
  Home,
  FileText,
  Mail,
  Briefcase,
  CheckCircle,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', color: 'text-blue-600' },
    { icon: FileText, label: 'Peticiones', href: '/dashboard/peticiones', color: 'text-purple-600' },
    { icon: Mail, label: 'Correspondencia', href: '/dashboard/correspondencia', color: 'text-green-600' },
    { icon: Briefcase, label: 'Contratos', href: '/dashboard/contratos', color: 'text-orange-600' },
    { icon: CheckCircle, label: 'Pendientes', href: '/dashboard/pendientes', color: 'text-red-600' },
    { icon: Calendar, label: 'Agenda', href: '/dashboard/agenda', color: 'text-indigo-600' },
    { icon: BarChart3, label: 'Reportes', href: '/dashboard/reportes', color: 'text-cyan-600' },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${open ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {open && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">SYNC DEEA</h1>
              <p className="text-xs text-gray-500">Control de Despacho</p>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title={open ? 'Contraer' : 'Expandir'}
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition group"
                title={!open ? item.label : undefined}
              >
                <Icon size={20} className={`flex-shrink-0 ${item.color}`} />
                {open && <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          {open && (
            <div className="px-4 py-2 rounded bg-gray-50">
              <p className="text-xs font-semibold text-gray-600">Usuario</p>
              <p className="text-xs text-gray-600 truncate mt-1">{userEmail}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
            title={!open ? 'Cerrar sesión' : undefined}
          >
            <LogOut size={18} />
            {open && 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
