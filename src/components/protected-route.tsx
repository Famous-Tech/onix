import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}