// src/pages/ShareFile.jsx
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ShareFileComponent from "../components/Dashboard/ShareFileComponent";

/**
 * ShareFile page MUST NOT render Sidebar/Header/Footer.
 * Dashboard route ("/dashboard/*") renders chrome and an <Outlet />.
 * This page only renders the share UI and uses the Outlet context (if provided)
 * to update the Dashboard's recent files.
 */

export default function ShareFile() {
  const navigate = useNavigate();
  // get context provided by Dashboard (if available)
  const outletContext = useOutletContext?.() || {};
  const dashboardHandleFileUploaded = outletContext.handleFileUploaded;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Save to localStorage helper (fallback if Dashboard doesn't provide a handler)
  const pushToLocalRecentFiles = (fileObj) => {
    try {
      const existing = JSON.parse(localStorage.getItem("recentFiles") || "[]");
      const updated = [fileObj, ...existing].slice(0, 10);
      localStorage.setItem("recentFiles", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to write recentFiles to localStorage", err);
    }
  };

  // Called when ShareFileComponent finishes an upload
  const handleFileUploaded = (uploadedFile) => {
    setUploadedFiles((prev) => [...prev, uploadedFile]);

    // Prefer Dashboard's handler if provided so Dashboard's UI updates immediately
    if (typeof dashboardHandleFileUploaded === "function") {
      try {
        dashboardHandleFileUploaded(uploadedFile);
      } catch (err) {
        // if something goes wrong, fallback to localStorage
        console.error("Dashboard handler failed, falling back to localStorage", err);
        pushToLocalRecentFiles(uploadedFile);
      }
    } else {
      // fallback: persist so Dashboard can read it later
      pushToLocalRecentFiles(uploadedFile);
    }

    // Add a success notification
    const notification = {
      id: Date.now(),
      type: "success",
      title: "File Uploaded Successfully!",
      message: `${uploadedFile.name} has been uploaded and is ready to share.`,
      timestamp: new Date().toISOString(),
      shareUrl: uploadedFile.shareUrl,
      hasPassword: uploadedFile.hasPassword,
    };

    setNotifications((prev) => [...prev, notification]);
    // Auto-remove after 5s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      const notification = {
        id: Date.now(),
        type: "info",
        title: "Copied to Clipboard!",
        message: "Share URL has been copied to your clipboard.",
        timestamp: new Date().toISOString(),
      };
      setNotifications((prev) => [...prev, notification]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 3000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const onBack = () => {
    // navigate back to dashboard home
    navigate("/dashboard");
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto p-0">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border shadow-sm ${
                  notification.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : notification.type === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
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
                    aria-label="Dismiss notification"
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

        {/* Share UI only — no Sidebar/Header/Footer here */}
        <ShareFileComponent onFileUploaded={handleFileUploaded} onBackToDashboard={onBack} />
      </div>
    </div>
  );
}
