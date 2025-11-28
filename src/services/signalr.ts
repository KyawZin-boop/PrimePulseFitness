import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";
import type { Notification as GymNotification } from "@/types/notification";

const API_BASE_URL = "https://localhost:7003";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async startConnection(userId: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("SignalR already connected");
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/notificationHub`, {
        accessTokenFactory: () => {
          // Get token from cookies
          const token = Cookies.get("gym-token");
          return token || "";
        },
        withCredentials: true,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
          return null;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Connection event handlers
    this.connection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log("SignalR connection closed", error);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          this.startConnection(userId);
        }, 5000);
      }
    });

    try {
      await this.connection.start();
      console.log("SignalR connected successfully");
      
      // Send userId to server for user-specific notifications
      await this.connection.invoke("RegisterUser", userId);
    } catch (error) {
      console.error("Error starting SignalR connection:", error);
      throw error;
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("SignalR connection stopped");
      } catch (error) {
        console.error("Error stopping SignalR connection:", error);
      }
    }
  }

  onNotification(callback: (notification: GymNotification) => void): void {
    if (!this.connection) {
      console.error("SignalR connection not established");
      return;
    }

    this.connection.on("ReceiveNotification", (notification: GymNotification) => {
      callback(notification);
    });
  }

  onNewMessage(callback: (data: unknown) => void): void {
    if (!this.connection) return;
    this.connection.on("NewMessage", callback);
  }

  onBookingUpdate(callback: (data: unknown) => void): void {
    if (!this.connection) return;
    this.connection.on("BookingUpdated", callback);
  }

  onDietPlanUpdate(callback: (data: unknown) => void): void {
    if (!this.connection) return;
    this.connection.on("DietPlanUpdated", callback);
  }

  onWorkoutPlanUpdate(callback: (data: unknown) => void): void {
    if (!this.connection) return;
    this.connection.on("WorkoutPlanUpdated", callback);
  }

  onProgressUpdate(callback: (data: unknown) => void): void {
    if (!this.connection) return;
    this.connection.on("ProgressUpdated", callback);
  }

  onClassUpdate(callback: (data: unknown) => void): void {
    if (!this.connection) return;
    this.connection.on("ClassUpdated", callback);
  }

  onMembershipUpdate(callback: (data: unknown) => void): void {
    if (!this.connection) return;
    this.connection.on("MembershipUpdated", callback);
  }

  onOrderUpdate(callback: (data: unknown) => void): void {
    if (!this.connection) return;
    this.connection.on("OrderUpdated", callback);
  }

  offAllHandlers(): void {
    if (this.connection) {
      this.connection.off("ReceiveNotification");
      this.connection.off("NewMessage");
      this.connection.off("BookingUpdated");
      this.connection.off("DietPlanUpdated");
      this.connection.off("WorkoutPlanUpdated");
      this.connection.off("ProgressUpdated");
      this.connection.off("ClassUpdated");
      this.connection.off("MembershipUpdated");
      this.connection.off("OrderUpdated");
    }
  }

  getConnectionState(): signalR.HubConnectionState {
    return this.connection?.state || signalR.HubConnectionState.Disconnected;
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();
export default signalRService;