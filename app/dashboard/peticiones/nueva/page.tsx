'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, FormField, Card, Alert, Breadcrumb } from '@/components/ui';
import { Plus, ChevronRight } from 'lucide-react';

export default function NuevaPeticionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    solicitante: '',
    email: '',
    telefono: '',
    tipo: 'peticion-general',
    asunto: '',
    descripcion: '',
    documentos: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Guardar en Supabase
    setSubmitted(true);
    setTimeout(() => {
      router.push('/dashboard/peticiones');
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="admin@montelibano.gov.co" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Nueva Petición"
          subtitle="Registrar un nuevo derecho de petición"
          icon={<Plus size={32} />}
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Peticiones', href: '/dashboard/peticiones' },
                { label: 'Nueva Petición' },
              ]}
            />

            {submitted && (
              <Alert
                type="success"
                title="Petición registrada exitosamente"
                message="La petición ha sido radicada y recibirá un acuse de recibo por correo."
                className="mt-6 mb-6"
              />
            )}

            <Card className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos del Solicitante</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Nombre completo"
                      name="solicitante"
                      value={formData.solicitante}
                      onChange={(value) => handleInputChange('solicitante', value)}
                      placeholder="Ej: Juan Pérez García"
                      required
                    />
                    <FormField
                      label="Correo electrónico"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      placeholder="usuario@correo.com"
                      required
                    />
                    <FormField
                      label="Teléfono"
                      name="telefono"
                      type="number"
                      value={formData.telefono}
                      onChange={(value) => handleInputChange('telefono', value)}
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la Petición</h2>
                  <div className="space-y-6">
                    <FormField
                      label="Tipo de Petición"
                      name="tipo"
                      type="select"
                      value={formData.tipo}
                      onChange={(value) => handleInputChange('tipo', value)}
                      options={[
                        { value: 'peticion-general', label: 'Petición General (15 días)' },
                        { value: 'documentos-info', label: 'Documentos e Información (10 días)' },
                        { value: 'consulta-juridica', label: 'Consulta Jurídica (30 días)' },
                        { value: 'congresista', label: 'Solicitud Congresista (5 días)' },
                        { value: 'tutela', label: 'Acción de Tutela (2 días)' },
                      ]}
                      required
                    />
                    <FormField
                      label="Asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={(value) => handleInputChange('asunto', value)}
                      placeholder="Resuma en una línea el tema de su petición"
                      required
                    />
                    <FormField
                      label="Descripción detallada"
                      name="descripcion"
                      type="textarea"
                      value={formData.descripcion}
                      onChange={(value) => handleInputChange('descripcion', value)}
                      placeholder="Describa con detalle su petición, derecho que solicita o información que requiere"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Radicar Petición
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
