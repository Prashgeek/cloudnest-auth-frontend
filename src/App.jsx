// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ResetPasswordForm from './components/ResetPasswordForm';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './pages/Settings';
import ViewStorage from './pages/ViewStorage';
import ShareFile from './pages/ShareFile';
import SetPassword from './pages/SetPassword';
import SharePage from './pages/SharePage';
import SuccessPage from './pages/SuccessPage';
import FailedPage from './pages/FailedPage';
import AccountProfile from './pages/AccountProfile';
import Downloads from './pages/Downloads';
import Trash from './pages/Trash';
import Files from './pages/Files';

// Lightweight placeholders used as index / demo components inside Dashboard
const DashboardHome = () => (
  <div style={{ padding: '20px' }}>
    <h2>Dashboard Home</h2>
    <p>Welcome to your dashboard!</p>
  </div>
);

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Dashboard main pages */}
          <Route index element={<DashboardHome />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="files" element={<Files />} />
          <Route path="trash" element={<Trash />} />
          <Route path="share-file" element={<ShareFile />} />
          <Route path="set-password" element={<SetPassword />} />
          <Route path="share" element={<SharePage />} />
          <Route path="success" element={<SuccessPage />} />
          <Route path="failed" element={<FailedPage />} />
          <Route path="view-storage" element={<ViewStorage />} />

          {/* Settings with nested routes */}
          <Route path="settings/*" element={<Settings />}>
            {/* Default main settings page */}
            <Route index element={null} />
            <Route path="account" element={<AccountProfile />} />
          </Route>

          {/* Fallback for unknown dashboard sub-path */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}
