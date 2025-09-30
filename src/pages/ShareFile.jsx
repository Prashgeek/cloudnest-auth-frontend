// src/pages/ShareFile.jsx
import React, { useState, useRef, useEffect } from "react";
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
  // useOutletContext returns whatever Dashboard passed to <Outlet context={...} />
  let outletContext = {};
  try {
    // safe call — if not mounted inside an Outlet, this returns undefined and we fall back to {}
    outletContext = useOutletContext() || {};
  } catch (err) {
    outletContext = {};
  }
  const dashboardHandleFileUploaded = outletContext.handleFileUploaded;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const notificationTimeouts = useRef(new Map()); // map id -> timeoutId

  useEffect(() => {
    return () => {
      // Clear any pending timeouts on unmount
      for (const t of notificationTimeouts.current.values()) {
        clearTimeout(t);
      }
      notificationTimeouts.current.clear();
    };
  }, []);

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
      id: Date.now() + Math.floor(Math.random() * 999),
      type: "success",
      title: "File Uploaded Successfully!",
      message: `${uploadedFile.name} has been uploaded and is ready to share.`,
      timestamp: new Date().toISOString(),
      shareUrl: uploadedFile.shareUrl,
      hasPassword: uploadedFile.hasPassword,
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remove after 5s (store timeout so we can clear if component unmounts)
    const to = setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      notificationTimeouts.current.delete(notification.id);
    }, 5000);
    notificationTimeouts.current.set(notification.id, to);
  };

  const removeNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    const t = notificationTimeouts.current.get(notificationId);
    if (t) {
      clearTimeout(t);
      notificationTimeouts.current.delete(notificationId);
    }
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    // try modern API first
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        addTempInfoNotification("Copied to Clipboard!", "Share URL has been copied to your clipboard.");
        return;
      } catch (err) {
        // fallthrough to legacy approach
      }
    }

    // legacy fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      addTempInfoNotification("Copied to Clipboard!", "Share URL has been copied to your clipboard.");
    } catch (err) {
      console.error("Fallback clipboard copy failed", err);
      addTempErrorNotification("Copy failed", "Unable to copy the share URL to clipboard.");
    }
  };

  const addTempInfoNotification = (title, message) => {
    const n = {
      id: Date.now() + Math.floor(Math.random() * 999),
      type: "info",
      title,
      message,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [...prev, n]);
    const to = setTimeout(() => {
      setNotifications((prev) => prev.filter((x) => x.id !== n.id));
      notificationTimeouts.current.delete(n.id);
    }, 3000);
    notificationTimeouts.current.set(n.id, to);
  };

  const addTempErrorNotification = (title, message) => {
    const n = {
      id: Date.now() + Math.floor(Math.random() * 999),
      type: "error",
      title,
      message,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [...prev, n]);
    const to = setTimeout(() => {
      setNotifications((prev) => prev.filter((x) => x.id !== n.id));
      notificationTimeouts.current.delete(n.id);
    }, 4000);
    notificationTimeouts.current.set(n.id, to);
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