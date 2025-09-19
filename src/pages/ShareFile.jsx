// src/pages/ShareFile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareFileComponent from "../components/Dashboard/ShareFileComponent";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Footer from "../components/Dashboard/Footer";

export default function ShareFile() {
  const navigate = useNavigate();

  // State management for the page
  const [activeMenu, setActiveMenu] = useState("Home");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Save to localStorage helper
  const pushToLocalRecentFiles = (fileObj) => {
    try {
      const existing = JSON.parse(localStorage.getItem('recentFiles') || '[]');
      const updated = [fileObj, ...existing].slice(0, 10);
      localStorage.setItem('recentFiles', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to write recentFiles to localStorage', err);
    }
  };

  // Handle file upload completion
  const handleFileUploaded = (uploadedFile) => {
    setUploadedFiles(prev => [...prev, uploadedFile]);

    // also persist to localStorage so Dashboard can read it
    pushToLocalRecentFiles(uploadedFile);

    // Add success notification
    const notification = {
      id: Date.now(),
      type: 'success',
      title: 'File Uploaded Successfully!',
      message: `${uploadedFile.name} has been uploaded and is ready to share.`,
      timestamp: new Date().toISOString(),
      shareUrl: uploadedFile.shareUrl,
      hasPassword: uploadedFile.hasPassword
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Copy URL to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      const notification = {
        id: Date.now(),
        type: 'info',
        title: 'Copied to Clipboard!',
        message: 'Share URL has been copied to your clipboard.',
        timestamp: new Date().toISOString()
      };

      setNotifications(prev => [...prev, notification]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Called when user clicks a menu item in this page's Sidebar
  // we will both set local activeMenu and navigate back to /dashboard,
  // passing the desired activeMenu in location.state so Dashboard can pick it up.
  const handleMenuChange = (menuText) => {
    setActiveMenu(menuText);

    // Always navigate back to the main dashboard route, but include which menu
    // the dashboard should open via location.state
    navigate('/dashboard', { state: { activeMenu: menuText } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - pass onMenuChange, not setActiveMenu */}
      <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Files</h1>
              <p className="text-gray-600">
                Upload and share files securely with optional password protection
              </p>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="mb-6 space-y-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border shadow-sm ${
                      notification.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : notification.type === 'error'
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm mt-1">{notification.message}</p>

                        {notification.shareUrl && (
                          <div className="mt-3 flex items-center space-x-2">
                            <input
                              type="text"
                              value={notification.shareUrl}
                              readOnly
                              className="flex-1 px-3 py-1 text-xs bg-white border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => copyToClipboard(notification.shareUrl)}
                              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                              Copy
                            </button>
                            {notification.hasPassword && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                🔒 Password Protected
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 ml-4"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* File Upload Component */}
              <div className="lg:col-span-2">
                <ShareFileComponent onFileUploaded={handleFileUploaded} />
              </div>

              {/* Recent Uploads Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Uploads ({uploadedFiles.length})
                  </h3>

                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-500 text-sm">No files uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {uploadedFiles.slice().reverse().map((file, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.date}</span>
                                {file.hasPassword && (
                                  <>
                                    <span>•</span>
                                    <span className="text-yellow-600">🔒</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {file.shareUrl && (
                            <div className="mt-2 flex items-center space-x-1">
                              <input
                                type="text"
                                value={file.shareUrl}
                                readOnly
                                className="flex-1 px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded"
                              />
                              <button
                                onClick={() => copyToClipboard(file.shareUrl)}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                title="Copy URL"
                              >
                                Copy
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Usage Statistics (unchanged) */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Files Shared</span>
                      <span className="font-medium text-gray-900">{uploadedFiles.length}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Password Protected</span>
                      <span className="font-medium text-gray-900">
                        {uploadedFiles.filter(file => file.hasPassword).length}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Size</span>
                      <span className="font-medium text-gray-900">
                        {uploadedFiles.reduce((total, file) => {
                          const sizeMatch = file.size.match(/(\d+(?:\.\d+)?)\s*(\w+)/);
                          if (sizeMatch) {
                            const [, size, unit] = sizeMatch;
                            const multiplier = unit === 'KB' ? 1 : unit === 'MB' ? 1024 : unit === 'GB' ? 1024*1024 : 1/1024;
                            return total + (parseFloat(size) * multiplier);
                          }
                          return total;
                        }, 0).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions - navigate back to /dashboard but set desired menu via location.state */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/dashboard', { state: { activeMenu: 'Files' } })}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      📁 View All Files
                    </button>

                    <button
                      onClick={() => navigate('/dashboard', { state: { activeMenu: 'Home' } })}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      🔗 Manage Shared Links
                    </button>

                    <button
                      onClick={() => navigate('/dashboard', { state: { activeMenu: 'Settings' } })}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      ⚙️ Upload Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  ); 
}
