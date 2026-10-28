'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Input, Select, Card, Badge } from '@/components/ui';
import { Plus, FileText } from 'lucide-react';

export default function ContratosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');

  const contratos = [
    { id: 'CT-2026-001', contratista: 'Empresa Servicios XYZ', objeto: 'Consultoría en planeación', valor: '$15,000,000', estado: 'En ejecución', progreso: 65 },
    { id: 'CT-2026-002', contratista: 'Soluciones Agrarias', objeto: 'Asistencia técnica rural', valor: '$8,500,000', estado: 'En ejecución', progreso: 45 },
    { id: 'CT-2025-045', contratista: 'Constructora del Norte', objeto: 'Mantenimiento infraestructura', valor: '$20,000,000', estado: 'Terminado', progreso: 100 },
  ];

  const getEstadoColor = (estado: string) => {
    if (estado === 'En ejecución') return 'info';
    if (estado === 'Terminado') return 'success';
    return 'warning';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="admin@montelibano.gov.co" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Contratación Pública"
          subtitle="Supervisión de procesos contractuales"
          icon={<FileText size={32} />}
          action={
            <Button size="md">
              <Plus size={20} />
              Nuevo Contrato
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por número, contratista..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  options={[
                    { value: 'todos', label: 'Todos' },
                    { value: 'ejecucion', label: 'En ejecución' },
                    { value: 'terminado', label: 'Terminado' },
                  ]}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-48"
                />
              </div>
            </Card>

            <Card noPadding>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Número</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contratista</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Objeto</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valor</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Progreso</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contratos.map((contrato) => (
                      <tr key={contrato.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">{contrato.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contrato.contratista}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contrato.objeto}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{contrato.valor}</td>
                        <td className="px-6 py-4">
                          <Badge variant={getEstadoColor(contrato.estado)}>
                            {contrato.estado}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${contrato.progreso}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 ml-2">{contrato.progreso}%</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button variant="ghost" size="sm">
                            Ver ficha
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
