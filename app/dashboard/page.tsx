'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import { TrendingUp, AlertCircle, Clock, CheckCheck } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Peticiones Vencidas',
      value: '3',
      icon: AlertCircle,
      color: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      subtitle: 'Requieren atención',
    },
    {
      title: 'En Trámite',
      value: '12',
      icon: Clock,
      color: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-600',
      subtitle: 'Dentro de plazo',
    },
    {
      title: 'Completadas Hoy',
      value: '5',
      icon: CheckCheck,
      color: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      subtitle: 'Procesadas',
    },
    {
      title: 'Contratos Activos',
      value: '24',
      icon: TrendingUp,
      color: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      subtitle: 'En ejecución',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail={user?.email} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                Secretaría de Desarrollo Económico, Empresarial y Agrícola
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpis.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={index}
                    className={`${kpi.color} border-2 ${kpi.borderColor} rounded-lg p-6 transition hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                        <p className={`text-4xl font-bold ${kpi.textColor} mt-2`}>{kpi.value}</p>
                        <p className="text-xs text-gray-500 mt-2">{kpi.subtitle}</p>
                      </div>
                      <div className={`${kpi.textColor} p-3 bg-white rounded-lg`}>
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actividades Recientes */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividades Recientes</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Petición {1000 + i} registrada
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Hace 2 horas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Próximos Vencimientos */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximos Vencimientos</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Petición #1025', date: '2 días', color: 'bg-red-100 text-red-700' },
                    { label: 'Contrato #089', date: '5 días', color: 'bg-amber-100 text-amber-700' },
                    { label: 'Informe DEEA', date: '7 días', color: 'bg-green-100 text-green-700' },
                  ].map((item, i) => (
                    <div key={i} className={`px-3 py-2 rounded ${item.color} text-sm font-medium`}>
                      <p>{item.label}</p>
                      <p className="text-xs opacity-75 mt-1">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
