import React from 'react';

export interface CargaArchivosProps {
  bucket: string;
  onUpload?: (url: string) => void;
}

export default function CargaArchivos({ bucket, onUpload }: CargaArchivosProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded p-4">
      <p className="text-gray-600">Carga de archivos - Componente en desarrollo</p>
    </div>
  );
}
