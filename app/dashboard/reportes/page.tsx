'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Card, Select } from '@/components/ui';
import { Download, BarChart3 } from 'lucide-react';

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail="admin@montelibano.gov.co" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Reportes y Análisis"
          subtitle="Estadísticas y seguimiento institucional"
          icon={<BarChart3 size={32} />}
          action={
            <Button size="md" variant="secondary">
              <Download size={20} />
              Descargar Reporte
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Period Filter */}
            <Card className="mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Período:</label>
                <Select
                  options={[
                    { value: 'semana', label: 'Esta semana' },
                    { value: 'mes', label: 'Este mes' },
                    { value: 'trimestre', label: 'Este trimestre' },
                    { value: 'año', label: 'Este año' },
                  ]}
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-48"
                />
              </div>
            </Card>

            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Peticiones Procesadas', value: '45', change: '+12%' },
                { title: 'Tiempo Promedio', value: '4 días', change: '-2%' },
                { title: 'Tasa Cumplimiento', value: '98%', change: '+3%' },
                { title: 'Satisfacción', value: '4.8/5', change: '+0.2' },
              ].map((stat, i) => (
                <Card key={i} className="text-center">
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </Card>
              ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Peticiones por Tipo</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-gray-500">
                  Gráfico de barras (recharts - próximamente)
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h3>
                <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-gray-500">
                  Gráfico de líneas (recharts - próximamente)
                </div>
              </Card>
            </div>

            {/* Table Report */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle por Dependencia</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">Dependencia</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">Peticiones</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">Respondidas</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">Tiempo Prom.</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">Cumplimiento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { dept: 'DEEA', peticiones: 15, respondidas: 14, tiempo: '3 días', cum: '93%' },
                      { dept: 'Tesorería', peticiones: 8, respondidas: 8, tiempo: '4 días', cum: '100%' },
                      { dept: 'Planeación', peticiones: 12, respondidas: 11, tiempo: '5 días', cum: '92%' },
                      { dept: 'Jurídica', peticiones: 10, respondidas: 9, tiempo: '6 días', cum: '90%' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 font-medium text-gray-900">{row.dept}</td>
                        <td className="px-6 py-3 text-gray-600">{row.peticiones}</td>
                        <td className="px-6 py-3 text-gray-600">{row.respondidas}</td>
                        <td className="px-6 py-3 text-gray-600">{row.tiempo}</td>
                        <td className="px-6 py-3">
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                            {row.cum}
                          </span>
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
