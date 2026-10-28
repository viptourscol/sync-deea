'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Card, Badge } from '@/components/ui';
import { Plus, Calendar } from 'lucide-react';

export default function AgendaPage() {
  const [currentMonth] = useState(new Date(2026, 0));

  const eventos = [
    { fecha: '2026-01-20', titulo: 'Consejo de Gobierno', tipo: 'reunion', participantes: 8 },
    { fecha: '2026-01-22', titulo: 'CMDR - Reunión ordinaria', tipo: 'reunion', participantes: 15 },
    { fecha: '2026-01-25', titulo: 'Vencimiento Petición E-2026-0001', tipo: 'vencimiento', participantes: 0 },
    { fecha: '2026-01-28', titulo: 'Entrega acta inicio contrato CT-2026-002', tipo: 'hito', participantes: 5 },
  ];

  const getTipoColor = (tipo: string) => {
    if (tipo === 'reunion') return 'info';
    if (tipo === 'vencimiento') return 'error';
    return 'success';
  };

  const getTipoLabel = (tipo: string) => {
    if (tipo === 'reunion') return 'Reunión';
    if (tipo === 'vencimiento') return 'Vencimiento';
    return 'Hito';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="admin@montelibano.gov.co" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Agenda y Calendario"
          subtitle="Reuniones, vencimientos y eventos importantes"
          icon={<Calendar size={32} />}
          action={
            <Button size="md">
              <Plus size={20} />
              Nuevo Evento
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Calendar Header */}
            <Card className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentMonth.toLocaleString('es-CO', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Anterior</Button>
                  <Button variant="secondary" size="sm">Siguiente</Button>
                </div>
              </div>
            </Card>

            {/* Events List */}
            <div className="space-y-4">
              {eventos.map((evento, idx) => (
                <Card key={idx} className="flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center w-20">
                      <div className="text-2xl font-bold text-blue-600">
                        {new Date(evento.fecha).getDate()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(evento.fecha).toLocaleString('es-CO', { month: 'short' })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{evento.titulo}</h3>
                      {evento.participantes > 0 && (
                        <p className="text-sm text-gray-600">{evento.participantes} participantes</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getTipoColor(evento.tipo)}>
                      {getTipoLabel(evento.tipo)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Ver detalles
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
