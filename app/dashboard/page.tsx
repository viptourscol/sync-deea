'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import { Header, KPICard, Card } from '@/components/ui';
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail={user?.email} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard Ejecutivo"
          subtitle="Secretaría de Desarrollo Económico, Empresarial y Agrícola"
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Peticiones Vencidas"
                value="3"
                icon={<AlertCircle size={24} />}
                color="red"
                subtitle="Requieren atención"
                trend={{ value: 12, isPositive: false }}
              />
              <KPICard
                title="En Trámite"
                value="12"
                icon={<Clock size={24} />}
                color="amber"
                subtitle="Dentro de plazo"
                trend={{ value: 8, isPositive: true }}
              />
              <KPICard
                title="Completadas Hoy"
                value="5"
                icon={<CheckCheck size={24} />}
                color="green"
                subtitle="Procesadas"
                trend={{ value: 15, isPositive: true }}
              />
              <KPICard
                title="Contratos Activos"
                value="24"
                icon={<TrendingUp size={24} />}
                color="blue"
                subtitle="En ejecución"
                trend={{ value: 5, isPositive: true }}
              />
            </div>

            {/* Activity & Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividades Recientes</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Petición {1000 + i} registrada</p>
                        <p className="text-xs text-gray-500 mt-1">Hace 2 horas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximos Vencimientos</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Petición #1025', date: '2 días', bg: 'bg-red-100', text: 'text-red-700' },
                    { label: 'Contrato #089', date: '5 días', bg: 'bg-amber-100', text: 'text-amber-700' },
                    { label: 'Informe DEEA', date: '7 días', bg: 'bg-green-100', text: 'text-green-700' },
                  ].map((item, i) => (
                    <div key={i} className={`px-3 py-2 rounded ${item.bg} ${item.text} text-sm font-medium`}>
                      <p>{item.label}</p>
                      <p className="text-xs opacity-75 mt-1">{item.date}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
