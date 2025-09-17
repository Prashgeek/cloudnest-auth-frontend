import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ResetPasswordForm from './components/ResetPasswordForm';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './pages/Settings';

export default function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/reset-password" 
          element={
            <ResetPasswordForm
              token={new URLSearchParams(window.location.search).get('token')}
              onBack={() => window.history.back()}
              onSuccess={() => (window.location.href = '/auth')}
            />
          } 
        />

        {/* Protected dashboard with nested routes */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />      {/* Default dashboard content */}
          <Route path="settings" element={<Settings />} /> {/* Settings page */}
        </Route>

        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}
