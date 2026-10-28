'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Input, Select, Card, Badge } from '@/components/ui';
import { Plus, Mail } from 'lucide-react';

export default function CorrespondenciaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');

  const correspondencia = [
    { id: 'E-2026-0001', asunto: 'Oficio Procuraduría', tipo: 'Entrada', fecha: '2026-01-15', estado: 'Procesado' },
    { id: 'S-2026-0001', asunto: 'Respuesta petición E-2026-0001', tipo: 'Salida', fecha: '2026-01-17', estado: 'Enviado' },
    { id: 'E-2026-0002', asunto: 'Circular DIAN', tipo: 'Entrada', fecha: '2026-01-18', estado: 'Por procesar' },
  ];

  const getTipoBadge = (tipo: string) => {
    return tipo === 'Entrada' ? 'info' : 'success';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="admin@montelibano.gov.co" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Correspondencia"
          subtitle="Control de oficios, circulares y memorandos"
          icon={<Mail size={32} />}
          action={
            <Button size="md">
              <Plus size={20} />
              Registrar Correspondencia
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por número, asunto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  options={[
                    { value: 'todos', label: 'Todas' },
                    { value: 'entrada', label: 'Entrada' },
                    { value: 'salida', label: 'Salida' },
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
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Asunto</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {correspondencia.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">{doc.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.asunto}</td>
                        <td className="px-6 py-4">
                          <Badge variant={getTipoBadge(doc.tipo)}>
                            {doc.tipo}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.fecha}</td>
                        <td className="px-6 py-4">
                          <Badge variant={doc.estado === 'Enviado' ? 'success' : 'default'}>
                            {doc.estado}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button variant="ghost" size="sm">
                            Ver
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
