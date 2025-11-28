import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import signalRService from "@/services/signalr";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { Notification, NotificationContextType } from "@/types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { userCredentials, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (isAuthenticated && userCredentials?.userId) {
      // Start SignalR connection
      signalRService
        .startConnection(userCredentials.userId)
        .then(() => {
          setIsConnected(true);
          
          // Set up notification handler
          signalRService.onNotification((notification: Notification) => {
            addNotification(notification);
            
            // Show toast for new notifications
            toast(notification.title, {
              description: notification.message,
              action: notification.actionUrl
                ? {
                    label: "View",
                    onClick: () => {
                      window.location.href = notification.actionUrl!;
                    },
                  }
                : undefined,
            });
          });

          // Set up other event handlers for specific events
          signalRService.onNewMessage((data) => {
            console.log("New message received:", data);
          });

          signalRService.onBookingUpdate((data) => {
            console.log("Booking updated:", data);
          });

          signalRService.onDietPlanUpdate((data) => {
            console.log("Diet plan updated:", data);
          });

          signalRService.onWorkoutPlanUpdate((data) => {
            console.log("Workout plan updated:", data);
          });

          signalRService.onProgressUpdate((data) => {
            console.log("Progress updated:", data);
          });

          signalRService.onClassUpdate((data) => {
            console.log("Class updated:", data);
          });

          signalRService.onMembershipUpdate((data) => {
            console.log("Membership updated:", data);
          });

          signalRService.onOrderUpdate((data) => {
            console.log("Order updated:", data);
          });
        })
        .catch((error) => {
          console.error("Failed to connect to notification hub:", error);
          setIsConnected(false);
        });

      // Cleanup on unmount
      return () => {
        signalRService.offAllHandlers();
        signalRService.stopConnection();
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, userCredentials?.userId]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    isConnected,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};