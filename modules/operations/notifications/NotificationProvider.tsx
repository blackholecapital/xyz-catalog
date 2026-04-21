// modules/operations/notifications/NotificationProvider.tsx
// Owns: User-facing notification delivery

import { createContext, useContext, useState, useCallback, type PropsWithChildren } from 'react';

type Notification = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  createdAt: number;
};

type NotificationContextValue = {
  notifications: Notification[];
  notify: (message: string, type?: Notification['type']) => void;
  dismiss: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setNotifications((prev) => [...prev, { id, message, type, createdAt: Date.now() }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
      {/* Toast overlay */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 left-4 z-[90] flex flex-col items-center gap-2 pointer-events-none">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-lg text-sm font-medium animate-card-enter max-w-[360px] w-full ${
                n.type === 'success' ? 'bg-green-500 text-white'
                : n.type === 'error' ? 'bg-red-500 text-white'
                : 'bg-[hsl(var(--color-surface))] text-[hsl(var(--color-foreground))] border border-[hsl(var(--color-border))]'
              }`}
              onClick={() => dismiss(n.id)}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
}
