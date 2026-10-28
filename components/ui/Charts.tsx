import React from 'react';
import {
  BarChart as RechartsBar,
  Bar,
  LineChart as RechartLine,
  Line,
  PieChart as RechartPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface BarChartProps {
  data: ChartData[];
  dataKey: string;
  title?: string;
  height?: number;
}

export function BarChart({ data, dataKey, title, height = 300 }: BarChartProps) {
  return (
    <div>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
          />
          <Legend />
          <Bar dataKey={dataKey} fill="#1F4E5F" radius={[8, 8, 0, 0]} />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}

interface LineChartProps {
  data: ChartData[];
  dataKey: string;
  title?: string;
  height?: number;
}

export function LineChart({ data, dataKey, title, height = 300 }: LineChartProps) {
  return (
    <div>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartLine data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#1F4E5F"
            strokeWidth={2}
            dot={{ fill: '#1F4E5F', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartLine>
      </ResponsiveContainer>
    </div>
  );
}

interface PieChartProps {
  data: ChartData[];
  dataKey: string;
  title?: string;
  height?: number;
  colors?: string[];
}

export function PieChartComponent({ data, dataKey, title, height = 300, colors = ['#1F4E5F', '#2E7D4F', '#B87708', '#B3261E'] }: PieChartProps) {
  return (
    <div>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartPie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </RechartPie>
      </ResponsiveContainer>
    </div>
  );
}
