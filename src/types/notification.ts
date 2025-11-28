export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
  actionUrl?: string;
}

export type NotificationType =
  | "message"
  | "booking"
  | "dietPlan"
  | "workoutPlan"
  | "progress"
  | "class"
  | "membership"
  | "order"
  | "review"
  | "system"
  | "feature"
  | "general";

export type NotificationPriority = "low" | "medium" | "high";

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  isConnected: boolean;
}
