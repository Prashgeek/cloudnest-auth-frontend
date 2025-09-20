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

// lightweight placeholders — replace with your real page components if you already have them
const DashboardHome = () => (
  <div className="p-10 text-3xl text-center text-gray-600">Dashboard Home</div>
);
const Downloads = () => (
  <div className="p-10 text-xl text-center">Downloads (replace with real component)</div>
);
const Files = () => (
  <div className="p-10 text-xl text-center">Files (replace with real component)</div>
);
const Trash = () => (
  <div className="p-10 text-xl text-center">Trash (replace with real component)</div>
);

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

        {/*
          Protected dashboard parent route.
          Use "/dashboard/*" so nested routes like "/dashboard/settings/view-storage"
          are matched and rendered inside Dashboard (which must include <Outlet />).
        */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Dashboard home (index) */}
          <Route index element={<DashboardHome />} />

          {/* Basic dashboard pages */}
          <Route path="downloads" element={<Downloads />} />
          <Route path="files" element={<Files />} />
          <Route path="trash" element={<Trash />} />

          {/* Share / set-password pages inside dashboard */}
          <Route path="share-file" element={<ShareFile />} />
          <Route path="set-password" element={<SetPassword />} />

          {/* Settings with nested view-storage */}
          <Route path="settings/*" element={<Settings />}>
            {/* URL: /dashboard/settings/view-storage */}
            <Route path="view-storage" element={<ViewStorage />} />
            {/* optional: settings index page */}
            <Route index element={<div className="p-6">Settings Overview</div>} />
          </Route>

          {/* If someone hits an unknown dashboard sub-path, send them to dashboard root */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global 404 fallback -> landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </>
  );
}
