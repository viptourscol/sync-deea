'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Input, Select, Card, Badge, Table, Modal, Alert } from '@/components/ui';
import { Plus, Search, Filter, FileText, Download } from 'lucide-react';

interface Peticion {
  id: string;
  solicitante: string;
  tipo: string;
  estado: string;
  diasRestantes: number;
  fecha: string;
  descripcion: string;
}

export default function PeticionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedPeticion, setSelectedPeticion] = useState<Peticion | null>(null);
  const [showModal, setShowModal] = useState(false);

  const peticiones: Peticion[] = [
    {
      id: 'E-2026-0001',
      solicitante: 'Juan Pérez',
      tipo: 'Petición general',
      estado: 'En trámite',
      diasRestantes: 8,
      fecha: '2026-01-10',
      descripcion: 'Solicitud de información sobre programas de desarrollo empresarial',
    },
    {
      id: 'E-2026-0002',
      solicitante: 'María García',
      tipo: 'Documentos e información',
      estado: 'Respondido',
      diasRestantes: 0,
      fecha: '2026-01-08',
      descripcion: 'Solicitud de copias de contratos vigentes',
    },
    {
      id: 'E-2026-0003',
      solicitante: 'Carlos López',
      tipo: 'Petición general',
      estado: 'Recibido',
      diasRestantes: 3,
      fecha: '2026-01-18',
      descripcion: 'Información sobre asistencia técnica rural',
    },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, any> = {
      'Respondido': 'success',
      'En trámite': 'info',
      'Recibido': 'warning',
    };
    return variants[estado] || 'default';
  };

  const getDiasColor = (dias: number) => {
    if (dias === 0) return 'text-green-600';
    if (dias <= 2) return 'text-red-600';
    if (dias <= 5) return 'text-amber-600';
    return 'text-blue-600';
  };

  const columns = [
    {
      key: 'id' as const,
      label: 'Número',
      sortable: true,
      render: (value: string) => <span className="font-mono font-medium">{value}</span>,
    },
    {
      key: 'solicitante' as const,
      label: 'Solicitante',
      sortable: true,
    },
    {
      key: 'tipo' as const,
      label: 'Tipo',
      sortable: true,
    },
    {
      key: 'estado' as const,
      label: 'Estado',
      render: (value: string) => <Badge variant={getEstadoBadge(value)}>{value}</Badge>,
    },
    {
      key: 'diasRestantes' as const,
      label: 'Días Restantes',
      render: (value: number) => (
        <span className={`font-medium ${getDiasColor(value)}`}>
          {value > 0 ? `${value} días` : 'Completada'}
        </span>
      ),
    },
  ];

  const handleViewDetails = (peticion: Peticion) => {
    setSelectedPeticion(peticion);
    setShowModal(true);
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
            <Button size="md" onClick={() => window.location.href = '/dashboard/peticiones/nueva'}>
              <Plus size={20} />
              Nueva Petición
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Alert */}
            <Alert
              type="warning"
              title="Atención"
              message="3 peticiones requieren atención inmediata (vencimiento ≤ 5 días)"
              className="mb-6"
            />

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
                <Button variant="secondary" size="md">
                  <Download size={18} />
                  Exportar
                </Button>
              </div>
            </Card>

            {/* Table */}
            <Card noPadding>
              <Table
                columns={columns}
                data={peticiones}
                rowKey="id"
                onRowClick={handleViewDetails}
              />
            </Card>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles de Petición"
        size="lg"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary">Cerrar</Button>
            <Button>Editar</Button>
          </div>
        }
      >
        {selectedPeticion && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600">Número de Petición</label>
                <p className="text-lg font-mono font-bold text-gray-900 mt-1">{selectedPeticion.id}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Estado</label>
                <div className="mt-1">
                  <Badge variant={getEstadoBadge(selectedPeticion.estado)}>
                    {selectedPeticion.estado}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Solicitante</label>
                <p className="text-lg text-gray-900 mt-1">{selectedPeticion.solicitante}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Tipo de Petición</label>
                <p className="text-lg text-gray-900 mt-1">{selectedPeticion.tipo}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Fecha de Radicación</label>
                <p className="text-lg text-gray-900 mt-1">{selectedPeticion.fecha}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Días Restantes</label>
                <p className={`text-lg font-bold mt-1 ${getDiasColor(selectedPeticion.diasRestantes)}`}>
                  {selectedPeticion.diasRestantes > 0 ? `${selectedPeticion.diasRestantes} días` : 'Completada'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Descripción</label>
              <p className="text-gray-700 mt-2">{selectedPeticion.descripcion}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Este es un ejemplo de datos. En producción, estos datos provendrán de Supabase.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
