export type ChatHistoryItem = {
  chatID?: string;
  chatId?: string;
  senderID?: string;
  senderId?: string;
  receiverID?: string;
  receiverId?: string;
  message?: string | null;
  imageUrl?: string | null;
  isView?: boolean;
  createdAt?: string;
  updatedAt?: string;
  activeFlag?: boolean;
};

export type ChatHistoryQuery = {
  userId: string;
  trainerId: string;
};

export type SaveChatPayload = {
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string | null;
  timestamp?: string;
};
export type SaveChatResponse = ChatMessage;
