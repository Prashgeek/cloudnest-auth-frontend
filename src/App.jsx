import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ResetPasswordForm from './components/ResetPasswordForm';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
      <Toaster richColors closeButton />
      
      <Routes>
        {/* Landing page as default route */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
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

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
