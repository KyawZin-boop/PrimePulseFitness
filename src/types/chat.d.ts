type ChatConnectionState = "idle" | "connecting" | "open" | "closing" | "closed" | "error";

type ChatUserIdentity = {
  id: string;
  name: string;
  email?: string;
};

type ChatMessage = {
  id: string;
  conversationId: string;
  conversationID?: string;
  senderId: string;
  senderID?: string;
  senderName?: string;
  receiverId: string;
  receiverID?: string;
  receiverName?: string;
  content: string;
  message?: string | null;
  timestamp: string;
  chatID?: string;
  chatId?: string;
  clientMessageId?: string;
  status?: "pending" | "sent" | "delivered" | "read" | "error";
  imageUrl?: string | null;
  ImageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ChatEventPayload =
  | { type: "message"; data: ChatMessage }
  | { type: "history"; data: ChatMessage[] }
  | { type: "acknowledge"; data: { messageId: string; status: ChatMessage["status"] } }
  | { type: "error"; data: { message: string } }
  | { type: "info"; data: { message: string } };
