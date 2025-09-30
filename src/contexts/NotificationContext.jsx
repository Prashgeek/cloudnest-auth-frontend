// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cloudnest_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cloudnest_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }, [notifications]);

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      time: 'Just now',
      hasMarkAsRead: true,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, hasMarkAsRead: false } : notif
      )
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(notif => notif.hasMarkAsRead).length;
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Notification helpers for common actions
  const helpers = {
    shareFile: (fileName, sharedBy) => {
      addNotification({
        type: 'file',
        title: 'New File Shared',
        description: `${sharedBy} has shared a new document with you: "${fileName}".`,
        icon: (
          <svg viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#2c7be5" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        )
      });
    },

    planUpgrade: (planName) => {
      addNotification({
        type: 'upgrade',
        title: 'Plan Upgrade Successful',
        description: `Your plan has been successfully upgraded to the ${planName} Tier.`,
        icon: (
          <svg viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#2c7be5" strokeWidth="2">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
        )
      });
    },

    newComment: (fileName, commenterName) => {
      addNotification({
        type: 'comment',
        title: 'New Comment',
        description: `${commenterName} has commented on your "${fileName}" Document.`,
        icon: (
          <svg viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#2c7be5" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M17 2h-10a2 2 0 0 0-2 2v3h14v-3a2 2 0 0 0-2-2z"/>
          </svg>
        )
      });
    },

    loginAlert: (location, deviceInfo) => {
      addNotification({
        type: 'login',
        title: 'Login Alert',
        description: `A new device logged into your account. Location: ${location}. Device: ${deviceInfo}`,
        icon: (
          <svg viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#2c7be5" strokeWidth="2">
            <path d="M10 9l5 3-5 3V9z"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        )
      });
    },

    securityUpdate: (action) => {
      addNotification({
        type: 'security',
        title: 'Security Update',
        description: `Your ${action} was successfully completed.`,
        icon: (
          <svg viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#000" strokeWidth="2">
            <path d="M12 1v4m0 14v4m7-11h4m-18 0H1m14.07-6.93l2.83 2.83m-12.02 0l2.83-2.83m12.02 12.02l-2.83 2.83m-12.02 0l-2.83-2.83M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
          </svg>
        )
      });
    },

    storageAlert: (percentage) => {
      addNotification({
        type: 'storage',
        title: 'Storage Usage Alert',
        description: `Your storage is ${percentage}% full. Upgrade your plan to get more space.`,
        icon: (
          <svg viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#000" strokeWidth="2">
            <rect x="3" y="11" width="18" height="6" rx="2"/>
            <line x1="3" y1="13" x2="21" y2="13"/>
          </svg>
        )
      });
    },

    systemUpdate: (updateInfo) => {
      addNotification({
        type: 'system',
        title: 'System Update Complete',
        description: `${updateInfo}`,
        icon: (
          <svg viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" fill="none" stroke="#000" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-9-9v4"/>
            <polyline points="12 7 12 12 15 15"/>
          </svg>
        )
      });
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      deleteNotification,
      getUnreadCount,
      clearAll,
      helpers
    }}>
      {children}
    </NotificationContext.Provider>
  );
};