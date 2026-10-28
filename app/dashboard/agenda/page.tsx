'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Card, Badge, Modal } from '@/components/ui';
import CalendarPro from '@/components/ui/CalendarPro';
import { Plus, Calendar } from 'lucide-react';

interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  tipo?: 'reunion' | 'vencimiento' | 'hito';
  participantes?: number;
  descripcion?: string;
}

export default function AgendaPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Eventos de ejemplo
  const eventos: CalendarEvent[] = [
    {
      id: '1',
      title: 'Consejo de Gobierno',
      start: new Date(2026, 0, 20, 9, 0),
      end: new Date(2026, 0, 20, 11, 0),
      tipo: 'reunion',
      participantes: 8,
      descripcion: 'Reunión ordinaria del consejo de gobierno municipal',
    },
    {
      id: '2',
      title: 'CMDR - Reunión ordinaria',
      start: new Date(2026, 0, 22, 14, 0),
      end: new Date(2026, 0, 22, 16, 0),
      tipo: 'reunion',
      participantes: 15,
      descripcion: 'Consejo Municipal de Desarrollo Rural',
    },
    {
      id: '3',
      title: 'Vencimiento Petición E-2026-0001',
      start: new Date(2026, 0, 25),
      end: new Date(2026, 0, 25),
      tipo: 'vencimiento',
      descripcion: 'Petición general vence en esta fecha',
    },
    {
      id: '4',
      title: 'Entrega acta inicio contrato CT-2026-002',
      start: new Date(2026, 0, 28, 10, 0),
      end: new Date(2026, 0, 28, 11, 0),
      tipo: 'hito',
      participantes: 5,
      descripcion: 'Hito importante: Acta de inicio',
    },
    {
      id: '5',
      title: 'Mesa técnica - Agronegocios',
      start: new Date(2026, 1, 3, 15, 0),
      end: new Date(2026, 1, 3, 17, 0),
      tipo: 'reunion',
      participantes: 12,
      descripcion: 'Discusión estratégica sobre agronegocios',
    },
    {
      id: '6',
      title: 'Vencimiento Informe ADR',
      start: new Date(2026, 1, 10),
      end: new Date(2026, 1, 10),
      tipo: 'vencimiento',
      descripcion: 'Informe de resolución de conflictos vence',
    },
  ];

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const getTipoColor = (tipo?: string) => {
    if (tipo === 'reunion') return 'info';
    if (tipo === 'vencimiento') return 'error';
    return 'success';
  };

  const getTipoLabel = (tipo?: string) => {
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
            {/* Calendario Profesional */}
            <Card noPadding className="mb-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Calendario Institucional</h2>
                <CalendarPro
                  events={eventos}
                  onSelectEvent={handleSelectEvent}
                />
              </div>
            </Card>

            {/* Leyenda */}
            <Card className="mb-8">
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="text-sm text-gray-600">Reunión</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                  <span className="text-sm text-gray-600">Vencimiento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
                  <span className="text-sm text-gray-600">Hito</span>
                </div>
              </div>
            </Card>

            {/* Próximos Eventos */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximos Eventos (7 días)</h2>
              <div className="space-y-3">
                {eventos
                  .filter((e) => {
                    const hoy = new Date();
                    const en7dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return e.start >= hoy && e.start <= en7dias;
                  })
                  .sort((a, b) => a.start.getTime() - b.start.getTime())
                  .map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => handleSelectEvent(evento)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {evento.start.getDate()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {evento.start.toLocaleString('es-CO', { month: 'short' })}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{evento.title}</h3>
                          {evento.participantes && (
                            <p className="text-sm text-gray-600">{evento.participantes} participantes</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">{evento.descripcion}</p>
                        </div>
                      </div>
                      <Badge variant={getTipoColor(evento.tipo)}>
                        {getTipoLabel(evento.tipo)}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal de Detalles */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles del Evento"
        size="lg"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
            <Button>Editar Evento</Button>
          </div>
        }
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600">Título</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedEvent.title}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Tipo</label>
                <div className="mt-1">
                  <Badge variant={getTipoColor(selectedEvent.tipo)}>
                    {getTipoLabel(selectedEvent.tipo)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Fecha Inicio</label>
                <p className="text-lg text-gray-900 mt-1">
                  {selectedEvent.start.toLocaleString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Fecha Fin</label>
                <p className="text-lg text-gray-900 mt-1">
                  {selectedEvent.end.toLocaleString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {selectedEvent.participantes && (
              <div>
                <label className="text-sm font-semibold text-gray-600">Participantes</label>
                <p className="text-lg text-gray-900 mt-1">{selectedEvent.participantes} personas</p>
              </div>
            )}

            {selectedEvent.descripcion && (
              <div>
                <label className="text-sm font-semibold text-gray-600">Descripción</label>
                <p className="text-gray-700 mt-2">{selectedEvent.descripcion}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Vista de calendario integrada con react-big-calendar. Soporte para múltiples vistas (Mes, Semana, Día, Agenda).
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
