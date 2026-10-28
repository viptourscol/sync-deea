'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Input, Select, Card, Badge } from '@/components/ui';
import { Plus, Search, Filter, FileText } from 'lucide-react';

export default function PeticionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const peticiones = [
    { id: 'E-2026-0001', solicitante: 'Juan Pérez', tipo: 'Petición general', estado: 'En trámite', dias: 8 },
    { id: 'E-2026-0002', solicitante: 'María García', tipo: 'Documentos e información', estado: 'Respondido', dias: 0 },
    { id: 'E-2026-0003', solicitante: 'Carlos López', tipo: 'Petición general', estado: 'Recibido', dias: 3 },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, any> = {
      'Respondido': 'success',
      'En trámite': 'info',
      'Recibido': 'warning',
    };
    return variants[estado] || 'default';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="admin@montelibano.gov.co" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Derechos de Petición"
          subtitle="Gestión de PQRSD y peticiones ciudadanas"
          icon={<FileText size={32} />}
          action={
            <Button size="md">
              <Plus size={20} />
              Nueva Petición
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <Card className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por número, solicitante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  options={[
                    { value: 'todos', label: 'Todos' },
                    { value: 'recibido', label: 'Recibido' },
                    { value: 'tramite', label: 'En trámite' },
                    { value: 'respondido', label: 'Respondido' },
                  ]}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-48"
                />
                <Button variant="secondary" size="md">
                  <Filter size={18} />
                  Filtros
                </Button>
              </div>
            </Card>

            {/* Table */}
            <Card noPadding>
              <div className="overflow-x-auto">
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
                          <Badge variant={getEstadoBadge(pet.estado)}>
                            {pet.estado}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {pet.dias > 0 ? (
                            <span className="text-blue-600 font-medium">{pet.dias} días</span>
                          ) : (
                            <span className="text-green-600 font-medium">Completada</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button variant="ghost" size="sm">
                            Ver detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
