'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SYNC DEEA - Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Bienvenido al Sistema SYNC DEEA
          </h2>
          <p className="text-gray-600 mb-6">
            Secretaría de Desarrollo Económico, Empresarial y Agrícola
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Peticiones</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-blue-700 mt-2">Derechos de petición</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Contratos</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-green-700 mt-2">Procesos contractuales</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Pendientes</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-purple-700 mt-2">Tareas activas</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-900 font-semibold mb-2">📋 Próximas Funcionalidades:</p>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Módulo de Derechos de Petición y PQRSD</li>
              <li>Control de Correspondencia</li>
              <li>Gestión de Contratos</li>
              <li>Planeación de Proyectos</li>
              <li>Agenda Integrada</li>
              <li>Reportes y Análisis</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
