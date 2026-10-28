'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a login automáticamente
    router.push('/login');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">SYNC DEEA</h1>
        <p className="text-xl text-gray-600 mb-8">Cargando...</p>
      </div>
    </div>
  );
}
