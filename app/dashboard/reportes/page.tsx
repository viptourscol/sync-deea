'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Header, Button, Card, Select, BarChart, LineChart, PieChartComponent } from '@/components/ui';
import { Download, BarChart3 } from 'lucide-react';

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  // Data for charts
  const peticionesPorTipo = [
    { name: 'Petición General', value: 15, pv: 2400 },
    { name: 'Documentos', value: 8, pv: 1398 },
    { name: 'Consulta Jurídica', value: 12, pv: 9800 },
    { name: 'Congresista', value: 5, pv: 3908 },
    { name: 'Tutela', value: 2, pv: 4800 },
  ];

  const tendenciaMensual = [
    { name: 'Sem 1', Procesadas: 10, Respondidas: 9, Pendientes: 1 },
    { name: 'Sem 2', Procesadas: 14, Respondidas: 13, Pendientes: 2 },
    { name: 'Sem 3', Procesadas: 12, Respondidas: 11, Pendientes: 3 },
    { name: 'Sem 4', Procesadas: 18, Respondidas: 17, Pendientes: 1 },
    { name: 'Sem 5', Procesadas: 15, Respondidas: 14, Pendientes: 2 },
  ];

  const estadosPeticiones = [
    { name: 'Respondidas', value: 45 },
    { name: 'En trámite', value: 12 },
    { name: 'Pendientes', value: 3 },
  ];

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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card noPadding className="p-6">
                <BarChart
                  data={peticionesPorTipo}
                  dataKey="value"
                  title="Peticiones por Tipo"
                  height={300}
                />
              </Card>

              <Card noPadding className="p-6">
                <PieChartComponent
                  data={estadosPeticiones}
                  dataKey="value"
                  title="Estados de Peticiones"
                  height={300}
                />
              </Card>
            </div>

            <Card noPadding className="p-6 mb-8">
              <LineChart
                data={tendenciaMensual}
                dataKey="Procesadas"
                title="Tendencia Mensual de Peticiones"
                height={350}
              />
            </Card>

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
