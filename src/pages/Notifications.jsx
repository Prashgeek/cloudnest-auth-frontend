// src/pages/Notifications.jsx
import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Trash2 } from 'lucide-react';

const Notifications = () => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();

  // mark all unread notifications as read
  const markAllAsRead = () => {
    if (!notifications || notifications.length === 0) return;
    notifications.forEach((n) => {
      if (n.hasMarkAsRead) markAsRead(n.id);
    });
  };

  const hasUnread = notifications.some((n) => n.hasMarkAsRead);

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '28px 48px',
      fontFamily: "'Roboto', sans-serif",
      boxSizing: 'border-box'
    },
    header: {
      position: 'relative',
      width: '100%',
      margin: '0 0 24px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      paddingBottom: '18px'
    },
    title: {
      fontWeight: 800,
      fontSize: '32px',
      color: '#1f2937',
      margin: 0,
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    markAllText: {
      position: 'absolute',
      right: 0,
      top: 0,
      fontSize: '13px',
      color: hasUnread ? '#2563eb' : '#9ca3af',
      cursor: hasUnread ? 'pointer' : 'default',
      userSelect: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      background: 'transparent',
      border: 'none',
      textTransform: 'none'
    },
    notificationsList: {
      width: '100%',
      maxWidth: '1600px',
      margin: '12px auto 0 auto',
      padding: '0 12px',
      boxSizing: 'border-box'
    },
    notification: {
      display: 'flex',
      alignItems: 'flex-start',
      background: '#fff',
      boxShadow: '0 2px 8px rgb(0 0 0 / 0.05)',
      borderRadius: '10px',
      padding: '22px 26px',
      marginBottom: '18px',
      gap: '22px',
      border: '1px solid #e5e7eb',
      width: '100%',
      boxSizing: 'border-box'
    },
    unreadNotification: {
      borderLeft: '5px solid #2563eb',
      backgroundColor: '#f0f5ff'
    },
    iconWrapper: {
      minWidth: '72px',
      minHeight: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      background: '#f0f5ff',
      color: '#2c7be5',
      flexShrink: 0
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    notificationTitle: {
      fontWeight: 700,
      fontSize: '18px',
      margin: '0 0 8px 0',
      color: '#1f2937'
    },
    description: {
      fontWeight: 400,
      fontSize: '15px',
      color: '#4b5563',
      margin: '0 0 10px 0',
      lineHeight: '1.5'
    },
    time: {
      fontWeight: 400,
      fontSize: '13px',
      color: '#9ca3af',
      userSelect: 'none'
    },
    actions: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '12px',
      marginLeft: '24px'
    },
    markRead: {
      fontSize: '13px',
      color: '#2563eb',
      textDecoration: 'none',
      cursor: 'pointer',
      userSelect: 'none',
      background: 'transparent',
      border: 'none',
      padding: '6px 10px',
      borderRadius: '6px'
    },
    deleteBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      color: '#6b7280'
    }
  };

  const formatTime = (timeString) => {
    if (timeString === 'Just now') return timeString;

    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch {
      return timeString;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Notification</h1>

        <button
          style={styles.markAllText}
          onClick={() => hasUnread && markAllAsRead()}
          aria-label="Mark all notifications as read"
          title={hasUnread ? 'Mark all as read' : 'All notifications are read'}
        >
          Mark all as read
        </button>
      </div>

      <div style={styles.notificationsList}>
        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <h3>No notifications yet</h3>
            <p>You'll see notifications about file shares, plan upgrades, and account activity here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                ...styles.notification,
                ...(notification.hasMarkAsRead ? styles.unreadNotification : {})
              }}
            >
              <div style={styles.iconWrapper}>
                {notification.icon}
              </div>

              <div style={styles.content}>
                <h3 style={styles.notificationTitle}>{notification.title}</h3>
                <p style={styles.description}>{notification.description}</p>
                <p style={styles.time}>{formatTime(notification.time)}</p>
              </div>

              <div style={styles.actions}>
                {notification.hasMarkAsRead && (
                  <button
                    style={styles.markRead}
                    onClick={() => markAsRead(notification.id)}
                    aria-label="Mark notification as read"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                  aria-label="Delete notification"
                >
                  <Trash2 size={22} strokeWidth={1.6} color="#ef4444" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
