import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface ConfirmOptions {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
  confirm: (options: ConfirmOptions | string, onConfirm?: () => void, onCancel?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmOptions | null>(null);

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const confirm = useCallback((options: ConfirmOptions | string, onConfirm?: () => void, onCancel?: () => void) => {
    if (typeof options === 'string') {
      setConfirmDialog({ 
        message: options, 
        onConfirm: onConfirm || (() => {}), 
        onCancel,
        title: 'Xác nhận',
        confirmText: 'Đồng ý',
        cancelText: 'Hủy bỏ',
        type: 'warning'
      });
    } else {
      setConfirmDialog({
        ...options,
        title: options.title || 'Xác nhận',
        confirmText: options.confirmText || 'Đồng ý',
        cancelText: options.cancelText || 'Hủy bỏ',
        type: options.type || 'warning'
      });
    }
  }, []);

  const handleConfirm = () => {
    if (confirmDialog?.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };

  const handleCancel = () => {
    if (confirmDialog?.onCancel) {
      confirmDialog.onCancel();
    }
    setConfirmDialog(null);
  };

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}
      
      {/* Toast Notifications */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px'
      }}>
        {notifications.map(n => (
          <div
            key={n.id}
            style={{
              minWidth: '320px',
              backgroundColor: n.type === 'success' ? 'var(--primary-color)' : 
                               n.type === 'error' ? 'var(--secondary-color)' : 
                               n.type === 'warning' ? 'var(--accent-color)' : '#3498db',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              fontWeight: '600',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <span>{n.message}</span>
            <button 
              onClick={() => removeNotification(n.id)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                marginLeft: '15px',
                transition: 'background 0.2s'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Premium Confirm Dialog */}
      {confirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '440px',
            width: '100%',
            overflow: 'hidden',
            animation: 'modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}>
            <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: confirmDialog.type === 'danger' ? 'rgba(228, 29, 36, 0.1)' : 
                                 confirmDialog.type === 'info' ? 'rgba(0, 135, 97, 0.1)' : 'rgba(247, 164, 0, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                {confirmDialog.type === 'danger' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9v4m4-4v4"/></svg>
                ) : confirmDialog.type === 'info' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"/></svg>
                )}
              </div>
              
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#111827' 
              }}>
                {confirmDialog.title}
              </h3>
              
              <p style={{ 
                margin: 0, 
                fontSize: '1.05rem', 
                lineHeight: '1.6', 
                color: '#4b5563' 
              }}>
                {confirmDialog.message}
              </p>
            </div>
            
            <div style={{ 
              padding: '0 32px 32px', 
              display: 'flex', 
              gap: '12px' 
            }}>
              <button 
                onClick={handleCancel}
                style={{ 
                  flex: 1,
                  padding: '12px 24px', 
                  border: '1px solid #e5e7eb', 
                  background: 'white', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                {confirmDialog.cancelText}
              </button>
              <button 
                onClick={handleConfirm}
                style={{ 
                  flex: 1,
                  padding: '12px 24px', 
                  border: 'none', 
                background: confirmDialog.type === 'danger' ? 'var(--secondary-color)' : 'var(--primary-color)', 
                color: 'white', 
                borderRadius: 'var(--border-radius)', 
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(0.9)')}
                onMouseOut={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes modalEnter {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
