'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Input, Card, Badge } from '@/components/ui';
import { Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PendientesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const pendientes = [
    { id: 1, titulo: 'Informe a Procuraduría sobre PQRSD', prioridad: 'Alta', asignado: 'María García', vencimiento: '2026-01-25', estado: 'En progreso' },
    { id: 2, titulo: 'Validar estudios previos contrato CT-2026-001', prioridad: 'Alta', asignado: 'Carlos López', vencimiento: '2026-01-22', estado: 'Pendiente' },
    { id: 3, titulo: 'Preparar acta de inicio CMDR', prioridad: 'Media', asignado: 'Juan Pérez', vencimiento: '2026-01-28', estado: 'Pendiente' },
    { id: 4, titulo: 'Recopilar evidencias proyecto agrícola', prioridad: 'Media', asignado: 'María García', vencimiento: '2026-02-05', estado: 'En progreso' },
  ];

  const getPrioridadBadge = (prioridad: string) => {
    if (prioridad === 'Alta') return 'error';
    if (prioridad === 'Media') return 'warning';
    return 'default';
  };

  const getEstadoColor = (estado: string) => {
    return estado === 'Completado' ? 'success' : 'info';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="admin@montelibano.gov.co" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Pendientes y Tareas"
          subtitle="Seguimiento de actividades del equipo"
          icon={<AlertCircle size={32} />}
          action={
            <Button size="md">
              <Plus size={20} />
              Nueva Tarea
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-6">
              <Input
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Card>

            <div className="space-y-4">
              {pendientes.map((tarea) => (
                <Card key={tarea.id} className="flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4 flex-1">
                    <CheckCircle2 size={24} className="text-gray-400" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{tarea.titulo}</h3>
                      <div className="flex gap-3 mt-2 text-sm text-gray-600">
                        <span>Asignado: <strong>{tarea.asignado}</strong></span>
                        <span>Vencimiento: <strong>{tarea.vencimiento}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getPrioridadBadge(tarea.prioridad)}>
                      {tarea.prioridad}
                    </Badge>
                    <Badge variant={getEstadoColor(tarea.estado)}>
                      {tarea.estado}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
