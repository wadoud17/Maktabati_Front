import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import POS from './pages/POS';
import LoadingSpinner from './components/UI/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.typeUser !== requiredRole) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <LoginForm />;

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Routes pour Admin */}
      <Route
        element={
          <ProtectedRoute requiredRole="Admin">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/produits" element={<Products />} />
      </Route>

      {/* Routes pour Caissier */}
      <Route
        element={
          <ProtectedRoute requiredRole="caissier">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/caisse" element={<POS />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
