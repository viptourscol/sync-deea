'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Plus, Search, Filter, FileText } from 'lucide-react';

export default function PeticionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const peticiones = [
    { id: 'E-2026-0001', solicitante: 'Juan Pérez', tipo: 'Petición general', estado: 'En trámite', dias: 8 },
    { id: 'E-2026-0002', solicitante: 'María García', tipo: 'Documentos e información', estado: 'Respondido', dias: 0 },
    { id: 'E-2026-0003', solicitante: 'Carlos López', tipo: 'Petición general', estado: 'Recibido', dias: 3 },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Respondido':
        return 'bg-green-100 text-green-800';
      case 'En trámite':
        return 'bg-blue-100 text-blue-800';
      case 'Recibido':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="admin@montelibano.gov.co" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText size={32} className="text-purple-600" />
                Derechos de Petición
              </h1>
              <p className="text-gray-600 text-sm mt-1">Gestión de PQRSD y peticiones ciudadanas</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
              <Plus size={20} />
              Nueva Petición
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por número, solicitante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center gap-2"
                >
                  <option>Todos</option>
                  <option>Recibido</option>
                  <option>En trámite</option>
                  <option>Respondido</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Filter size={18} />
                  Más filtros
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Número</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Solicitante</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Días Restantes</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {peticiones.map((pet) => (
                    <tr key={pet.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{pet.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{pet.solicitante}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{pet.tipo}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(pet.estado)}`}>
                          {pet.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pet.dias > 0 ? (
                          <span className="text-blue-600 font-medium">{pet.dias} días</span>
                        ) : (
                          <span className="text-green-600 font-medium">Completada</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Ver detalles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {peticiones.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No hay peticiones para mostrar</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
