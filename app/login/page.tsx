import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SYNC DEEA</h1>
        <p className="text-gray-600">
          Secretaría de Desarrollo Económico, Empresarial y Agrícola
        </p>
        <p className="text-sm text-gray-500 mt-1">Alcaldía Municipal de Montelíbano, Córdoba</p>
      </div>
      <LoginForm />
    </div>
  );
}
