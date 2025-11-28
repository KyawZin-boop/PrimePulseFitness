type NotificationType = "consultation" | "project" | "message" | "booking" | "deadline" | "general";

type NotificationPriority = "low" | "medium" | "high";

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
}

interface NotificationDTO {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  data?: Record<string, unknown>;
  actionUrl?: string;
}