import { useCallback, useEffect, useRef, useState } from "react";

interface UseChatOptions {
  conversationId?: string | null;
  currentUser?: ChatUserIdentity | null;
  peer?: ChatUserIdentity | null;
  websocketUrl?: string;
  autoReconnect?: boolean;
  reconnectIntervalMs?: number;
  loadHistory?: (context: ChatSessionContext) => Promise<ChatMessage[] | null | undefined>;
  persistMessage?: (
    context: ChatPersistContext
  ) => Promise<ChatMessage | Partial<ChatMessage> | void>;
}

interface UseChatResult {
  connectionState: ChatConnectionState;
  messages: ChatMessage[];
  sendMessage: (content: string, options?: { imageUrl?: string | null }) => ChatMessage | null;
  lastError: string | null;
  reconnect: () => void;
  clearMessages: () => void;
  isHistoryLoading: boolean;
  historyLoaded: boolean;
}

type ChatSessionContext = {
  conversationId: string;
  currentUser: ChatUserIdentity;
  peer: ChatUserIdentity;
};

type ChatPersistContext = ChatSessionContext & {
  message: ChatMessage;
};

const DEFAULT_WS_URL = import.meta.env.VITE_CHAT_WS_URL ?? "wss://localhost:7003/ws/chat";
const MAX_RECONNECT_ATTEMPTS = 5;

const buildConversationId = (first: string, second: string) => {
  const [a, b] = [first, second].sort((x, y) => x.localeCompare(y));
  return `conversation:${a}:${b}`;
};

const createMessageId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const serializeMessage = (message: ChatMessage) => ({
  type: "message",
  data: {
    ...message,
    message: message.content,
    senderID: message.senderId,
    receiverID: message.receiverId,
    chatID: message.id,
    conversationID: message.conversationId,
    timestamp: message.timestamp,
    clientMessageId: message.clientMessageId ?? message.id,
    ImageUrl: message.imageUrl ?? null,
  },
});

const sortMessages = (messages: ChatMessage[]) =>
  [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

const normalizeIncomingMessage = (
  raw: Partial<ChatMessage> | null | undefined
): ChatMessage | null => {
  if (!raw) {
    return null;
  }

  const senderId = raw.senderId ?? raw.senderID;
  const receiverId = raw.receiverId ?? raw.receiverID;

  if (!senderId || !receiverId) {
    return null;
  }

  const resolvedConversationId =
    raw.conversationId ?? raw.conversationID ?? buildConversationId(senderId, receiverId);

  const id = raw.id ?? raw.chatId ?? raw.chatID ?? createMessageId();
  const timestamp =
    raw.timestamp ?? raw.createdAt ?? raw.updatedAt ?? new Date().toISOString();
  const content = raw.content ?? raw.message ?? "";
  const clientMessageId =
    raw.clientMessageId ??
    (raw as { clientMessageID?: string }).clientMessageID ??
    undefined;

  const pascalCaseImage = (raw as { ImageUrl?: string }).ImageUrl;

  return {
    id: String(id),
  conversationId: String(resolvedConversationId),
  conversationID: String(resolvedConversationId),
    senderId: String(senderId),
    senderID: String(senderId),
    senderName: raw.senderName,
    receiverId: String(receiverId),
    receiverID: String(receiverId),
    receiverName: raw.receiverName,
    content,
    message: content,
    timestamp,
    status: raw.status,
    imageUrl: pascalCaseImage ?? raw.imageUrl ?? null,
    createdAt: raw.createdAt ?? timestamp,
    updatedAt: raw.updatedAt ?? timestamp,
    clientMessageId: clientMessageId ? String(clientMessageId) : String(id),
  };
};

const resolveAckMessageId = (
  data: {
    messageId?: string;
    chatId?: string;
    chatID?: string;
    id?: string;
    clientMessageId?: string;
    clientMessageID?: string;
  }
) => {
  const candidate =
    data.messageId ??
    data.chatId ??
    data.chatID ??
    data.clientMessageId ??
    data.clientMessageID ??
    data.id;
  return candidate ? String(candidate) : "";
};

export const useChat = ({
  conversationId,
  currentUser,
  peer,
  websocketUrl = DEFAULT_WS_URL,
  autoReconnect = true,
  reconnectIntervalMs = 1500,
  loadHistory,
  persistMessage,
}: UseChatOptions): UseChatResult => {
  const [connectionState, setConnectionState] = useState<ChatConnectionState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const pendingMessagesRef = useRef<ChatMessage[]>([]);
  const shouldReconnectRef = useRef(true);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadHistoryRef = useRef<UseChatOptions["loadHistory"] | null>(null);
  const persistMessageRef = useRef<UseChatOptions["persistMessage"] | null>(null);

  useEffect(() => {
    loadHistoryRef.current = typeof loadHistory === "function" ? loadHistory : null;
  }, [loadHistory]);

  useEffect(() => {
    persistMessageRef.current = typeof persistMessage === "function" ? persistMessage : null;
  }, [persistMessage]);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    setMessages([]);
    setLastError(null);
    setConnectionState("idle");
    setIsHistoryLoading(false);
    setHistoryLoaded(false);
    reconnectAttemptsRef.current = 0;
    pendingMessagesRef.current = [];
  }, []);

  const closeSocket = useCallback(
    ({ skipReconnect = false }: { skipReconnect?: boolean } = {}) => {
      shouldReconnectRef.current = !skipReconnect;

      const socket = socketRef.current;
      if (!socket) {
        return;
      }

      setConnectionState("closing");
      socket.close();
    },
    []
  );

  const handleIncomingMessage = useCallback((payload: ChatEventPayload) => {
    switch (payload.type) {
      case "message": {
        const normalized = normalizeIncomingMessage(payload.data);
        if (!normalized) {
          break;
        }
        setMessages((prev) => {
          const matchIndex = prev.findIndex((message) => {
            if (message.id === normalized.id) {
              return true;
            }

            if (normalized.clientMessageId) {
              if (message.id === normalized.clientMessageId) {
                return true;
              }

              if (message.clientMessageId && message.clientMessageId === normalized.clientMessageId) {
                return true;
              }
            }

            if (message.clientMessageId && message.clientMessageId === normalized.id) {
              return true;
            }

            const sameConversation = message.conversationId === normalized.conversationId;
            const sameSender = message.senderId === normalized.senderId;
            const sameContent = message.content === normalized.content;
            const sameImage = (message.imageUrl ?? null) === (normalized.imageUrl ?? null);

            if (sameConversation && sameSender && sameContent && sameImage) {
              if (message.timestamp === normalized.timestamp) {
                return true;
              }

              const messageTime = new Date(message.timestamp).getTime();
              const normalizedTime = new Date(normalized.timestamp).getTime();

              if (Number.isFinite(messageTime) && Number.isFinite(normalizedTime)) {
                if (Math.abs(messageTime - normalizedTime) <= 5_000) {
                  return true;
                }
              }
            }

            return false;
          });

          if (matchIndex >= 0) {
            const next = prev.map((message, index) => {
              if (index !== matchIndex) {
                return message;
              }

              return {
                ...message,
                ...normalized,
                id: normalized.id,
                clientMessageId:
                  normalized.clientMessageId ?? message.clientMessageId ?? message.id,
              } as ChatMessage;
            });

            return sortMessages(next);
          }

          return sortMessages([...prev, normalized]);
        });
        break;
      }
      case "history": {
        const normalized = payload.data
          .map((item) => normalizeIncomingMessage(item))
          .filter((item): item is ChatMessage => !!item);
        setMessages(sortMessages(normalized));
        break;
      }
      case "acknowledge": {
        const { status } = payload.data;
        const messageId = resolveAckMessageId(payload.data);
        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  status: status ?? message.status,
                }
              : message
          )
        );
        break;
      }
      case "error": {
        setLastError(payload.data.message);
        break;
      }
      case "info": {
        break;
      }
      default:
        break;
    }
  }, []);

  const initialiseSocket = useCallback(() => {
    if (!conversationId || !currentUser?.id || !peer?.id) {
      return;
    }

    if (socketRef.current) {
      return;
    }

    shouldReconnectRef.current = true;
    clearReconnectTimer();
    setConnectionState("connecting");
    setLastError(null);

    try {
      const url = new URL(websocketUrl);
      url.searchParams.set("conversationId", conversationId);
      url.searchParams.set("userId", currentUser.id);

      const socket = new WebSocket(url.toString());
      socketRef.current = socket;

      socket.onopen = () => {
        setConnectionState("open");
        reconnectAttemptsRef.current = 0;

        const joinMessage = {
          type: "join",
          data: {
            conversationId,
            userId: currentUser.id,
            userName: currentUser.name,
            peerId: peer.id,
            peerName: peer.name,
          },
        } satisfies ChatEventPayload | { type: string; data: Record<string, unknown> };

        socket.send(JSON.stringify(joinMessage));

        if (pendingMessagesRef.current.length) {
          pendingMessagesRef.current.forEach((message) => {
            socket.send(JSON.stringify(serializeMessage(message)));
          });
          pendingMessagesRef.current = [];
        }
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as ChatEventPayload | ChatEventPayload[];
          if (Array.isArray(payload)) {
            payload.forEach(handleIncomingMessage);
          } else {
            handleIncomingMessage(payload);
          }
        } catch (error) {
          console.error("Failed to parse chat message", error);
        }
      };

      socket.onerror = () => {
        setLastError("Connection error. Please try again.");
        setConnectionState("error");
      };

      socket.onclose = () => {
        socketRef.current = null;
        setConnectionState("closed");

        if (
          shouldReconnectRef.current &&
          autoReconnect &&
          reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS
        ) {
          reconnectAttemptsRef.current += 1;
          const delay = reconnectIntervalMs * reconnectAttemptsRef.current;
          reconnectTimerRef.current = setTimeout(() => {
            initialiseSocket();
          }, delay);
        }
      };
    } catch (error) {
      console.error("Unable to establish chat connection", error);
      setLastError("Unable to establish chat connection");
      setConnectionState("error");
    }
  }, [
    autoReconnect,
    clearReconnectTimer,
    conversationId,
    currentUser?.id,
    currentUser?.name,
    handleIncomingMessage,
    peer?.id,
    peer?.name,
    reconnectIntervalMs,
    websocketUrl,
  ]);

  useEffect(() => {
    resetState();
    clearReconnectTimer();
    closeSocket({ skipReconnect: true });

    if (!conversationId || !currentUser?.id || !peer?.id) {
      return;
    }

    initialiseSocket();

    return () => {
      clearReconnectTimer();
      closeSocket({ skipReconnect: true });
      setConnectionState("closed");
    };
  }, [
    clearReconnectTimer,
    closeSocket,
    conversationId,
    currentUser?.id,
    initialiseSocket,
    peer?.id,
    resetState,
  ]);

  useEffect(() => {
    let isActive = true;

    const userContext = currentUser?.id
      ? {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        }
      : null;

    const peerContext = peer?.id
      ? {
          id: peer.id,
          name: peer.name,
          email: peer.email,
        }
      : null;

    if (!conversationId || !userContext || !peerContext || !loadHistoryRef.current) {
      setIsHistoryLoading(false);
      setHistoryLoaded(false);
      return () => {
        isActive = false;
      };
    }

    setIsHistoryLoading(true);
    loadHistoryRef
      .current({
        conversationId,
        currentUser: userContext,
        peer: peerContext,
      })
      .then((history) => {
        if (!isActive) {
          return;
        }
        const normalized = Array.isArray(history) ? history : [];
        setMessages(sortMessages(normalized));
        setHistoryLoaded(true);
        setIsHistoryLoading(false);
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }
        console.error("Failed to load chat history", error);
        setIsHistoryLoading(false);
        setHistoryLoaded(false);
        setLastError((prev) => prev ?? "Unable to load chat history.");
      });

    return () => {
      isActive = false;
    };
  }, [
    conversationId,
    currentUser?.email,
    currentUser?.id,
    currentUser?.name,
    peer?.email,
    peer?.id,
    peer?.name,
  ]);

  const sendMessage = useCallback(
    (content: string, options?: { imageUrl?: string | null }) => {
      if (!conversationId || !currentUser?.id || !peer?.id) {
        return null;
      }

      const trimmed = content.trim();
      const imageUrl = options?.imageUrl ?? null;

      if (!trimmed && !imageUrl) {
        return null;
      }

      const messageId = createMessageId();

      const message: ChatMessage = {
        id: messageId,
        conversationId,
        conversationID: conversationId,
        senderId: currentUser.id,
        senderID: currentUser.id,
        senderName: currentUser.name,
        receiverId: peer.id,
        receiverID: peer.id,
        receiverName: peer.name,
        content: trimmed,
        message: trimmed,
        timestamp: new Date().toISOString(),
        status: socketRef.current?.readyState === WebSocket.OPEN ? "sent" : "pending",
        clientMessageId: messageId,
        imageUrl: imageUrl ?? null,
      };

      setMessages((prev) => sortMessages([...prev, message]));

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(serializeMessage(message)));
      } else {
        pendingMessagesRef.current.push(message);
      }

      if (persistMessageRef.current) {
        persistMessageRef
          .current({ conversationId, currentUser, peer, message })
          .then((result) => {
            if (!result) {
              return;
            }

            setMessages((prev) => {
              const next = prev.map((existing) => {
                if (existing.id !== message.id) {
                  return existing;
                }

                const merged = {
                  ...existing,
                  ...result,
                } as ChatMessage;

                if ("id" in (result as ChatMessage) && (result as ChatMessage).id) {
                  merged.id = String((result as ChatMessage).id);
                }

                if (!merged.status) {
                  merged.status = "sent";
                }

                return merged;
              });

              return sortMessages(next);
            });
          })
          .catch((error) => {
            console.error("Failed to persist chat message", error);
            setMessages((prev) =>
              prev.map((existing) =>
                existing.id === message.id
                  ? {
                      ...existing,
                      status: "error",
                    }
                  : existing
              )
            );
            setLastError((prev) => prev ?? "Unable to send message. Please retry.");
          });
      }

      return message;
    },
    [conversationId, currentUser, peer]
  );

  const reconnect = useCallback(() => {
    clearReconnectTimer();
    reconnectAttemptsRef.current = 0;
    closeSocket({ skipReconnect: true });
    initialiseSocket();
  }, [clearReconnectTimer, closeSocket, initialiseSocket]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    connectionState,
    messages,
    sendMessage,
    lastError,
    reconnect,
    clearMessages,
    isHistoryLoading,
    historyLoaded,
  };
};
