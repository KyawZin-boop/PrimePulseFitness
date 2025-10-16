import axios from "@/configs/axios";
import type {
  ChatHistoryItem,
  ChatHistoryQuery,
  SaveChatPayload,
  SaveChatResponse,
} from "./type";

export const getChatHistory = async (params: ChatHistoryQuery): Promise<ChatHistoryItem[]> => {
  const { data } = await axios.get<ChatHistoryItem[]>("Chat/GetChatHistory", { params });
  return data ?? [];
};

export const saveChatMessage = async (payload: SaveChatPayload): Promise<SaveChatResponse> => {
  const {
    conversationId,
    senderId,
    receiverId,
    message,
    imageUrl,
    timestamp,
  } = payload;

  const finalTimestamp = timestamp ?? new Date().toISOString();

  const { data } = await axios.post<ChatHistoryItem>(
    "Chat/AddChat",
    {
      senderId,
      receiverId,
      message,
      imageUrl: imageUrl ?? null,
      timestamp: finalTimestamp,
    },
    {
      params: {
        senderId,
        receiverId,
      },
    },
  );

  if (!data) {
    throw new Error("Failed to save chat message");
  }

  const mapped = mapHistoryItemToChatMessage(data, () => conversationId);

  if (mapped) {
    return mapped;
  }

  return {
    id: conversationId,
    conversationId,
    conversationID: conversationId,
    senderId,
    senderID: senderId,
    receiverId,
    receiverID: receiverId,
    chatId: conversationId,
    chatID: conversationId,
    content: message,
    message,
    timestamp: finalTimestamp,
    createdAt: finalTimestamp,
    updatedAt: finalTimestamp,
    status: "sent",
    imageUrl: imageUrl ?? null,
  };
};

export const mapHistoryItemToChatMessage = (
  item: ChatHistoryItem,
  resolveConversationId: (senderId: string, receiverId: string) => string
): ChatMessage | null => {
  const senderId = item.senderId ?? item.senderID;
  const receiverId = item.receiverId ?? item.receiverID;
  if (!senderId || !receiverId) {
    return null;
  }

  const conversationId = resolveConversationId(senderId, receiverId);
  const id = item.chatId ?? item.chatID ?? `${conversationId}:${item.createdAt ?? crypto.randomUUID?.() ?? Date.now()}`;
  const timestamp = item.createdAt ?? item.updatedAt ?? new Date().toISOString();
  const message = item.message ?? "";

  return {
    id: String(id),
    chatId: String(id),
    chatID: String(id),
    conversationId,
    conversationID: conversationId,
    senderId,
    senderID: senderId,
    receiverId,
    receiverID: receiverId,
    content: message,
    message,
    timestamp,
    createdAt: item.createdAt ?? timestamp,
    updatedAt: item.updatedAt ?? timestamp,
    status: item.isView ? "read" : "delivered",
    imageUrl: item.imageUrl ?? null,
  };
};
