// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NotificationProvider } from './contexts/NotificationContext';

import LandingPage from './pages/LandingPage';
import TermsConditions from './pages/TermsConditions';
import ContactUs from './pages/ContactUs';
import AuthPage from './pages/AuthPage';
import ResetPasswordForm from './components/ResetPasswordForm';

import ContactUsContent from './pages/ContactUsContent';
import TermsConditionsContent from './pages/TermsConditionsContent';

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

import Notifications from './pages/Notifications';
import UpgradeSpace from './pages/UpgradeSpace';
import ChangePassword from './pages/ChangePassword';

import Header from './components/Dashboard/Header';
// Use the Dashboard Footer here
import Footer from './components/Dashboard/Footer';

// Placeholder for dashboard home
const DashboardHome = () => (
  <div style={{ padding: '20px' }}>
    <h2>Dashboard Home</h2>
    <p>Welcome to your dashboard!</p>
  </div>
);

// Wrappers for content-only pages
const DashboardContactUs = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <ContactUsContent />
    <Footer />
  </div>
);

const DashboardTerms = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <TermsConditionsContent />
    <Footer />
  </div>
);

export default function App() {
  return (
    <NotificationProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
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
          <Route path="upgrade" element={<UpgradeSpace />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="settings/*" element={<Settings />}>
            <Route index element={null} />
            <Route path="account" element={<AccountProfile />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Standalone dashboard content pages */}
        <Route
          path="/dashboard/contact"
          element={
            <ProtectedRoute>
              <DashboardContactUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/terms"
          element={
            <ProtectedRoute>
              <DashboardTerms />
            </ProtectedRoute>
          }
        />

        {/* Notifications page without sidebar */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Notifications />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Global fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </NotificationProvider>
  );
}
