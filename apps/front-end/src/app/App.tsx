import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuth';
import { SelectedClientsProvider } from '@/features/clients/context/SelectedClientsContext';
import LoginPage from '@/features/auth/pages/LoginPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import ClientsListPage from '@/features/clients/pages/ClientsListPage';
import SelectedClientsPage from '@/features/clients/pages/SelectedClientsPage';
import ClientDetailPage from '@/features/clients/pages/ClientDetailPage';
import ClientFormPage from '@/features/clients/pages/ClientFormPage';
import Layout from './Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Aguardar o carregamento da autenticação antes de redirecionar
  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/clients" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clients" element={<ClientsListPage />} />
        <Route path="clients/selected" element={<SelectedClientsPage />} />
        <Route path="clients/new" element={<ClientFormPage />} />
        <Route path="clients/:id" element={<ClientDetailPage />} />
        <Route path="clients/:id/edit" element={<ClientFormPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SelectedClientsProvider>
        <AppRoutes />
      </SelectedClientsProvider>
    </AuthProvider>
  );
}

export default App;

