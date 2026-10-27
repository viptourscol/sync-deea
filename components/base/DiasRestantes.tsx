import React from 'react';

export interface DiasRestantesProps {
  fecha: Date;
  termino?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function DiasRestantes({ fecha, termino = 15 }: DiasRestantesProps) {
  return (
    <div className="inline-block bg-gray-100 px-3 py-1 rounded text-sm">
      <span className="text-gray-700">Días restantes: {termino}</span>
    </div>
  );
}
