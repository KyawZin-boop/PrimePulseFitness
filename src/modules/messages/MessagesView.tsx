import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Message } from "@/types";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: "trainer" | "user";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

type ParticipantRole = Conversation["participantRole"];

type SocketEnvelope = {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderRole?: ParticipantRole;
  receiverId: string;
  receiverName?: string;
  receiverRole?: ParticipantRole;
  content: string;
  createdAt?: string;
};

const WS_URL =
  import.meta.env.VITE_WS_CHAT_URL ?? "wss://localhost:7003/ws/chat";

const MessagesView = () => {
  const { userCredentials } = useAuth();
  const currentUserId = useMemo(
    () => userCredentials?.userId ?? "",
    [userCredentials]
  );
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const selectedConversationRef = useRef<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");

  // Mock conversations - replace with API call
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      participantId: "trainer-1",
      participantName: "Mike Chen",
      participantRole: "trainer",
      lastMessage: "Great progress on your strength training!",
      lastMessageTime: new Date("2025-10-04T14:30:00"),
      unreadCount: 2,
    },
    {
      id: "conv-2",
      participantId: "trainer-2",
      participantName: "Sarah Williams",
      participantRole: "trainer",
      lastMessage: "Let's schedule your next cardio session",
      lastMessageTime: new Date("2025-10-03T10:15:00"),
      unreadCount: 0,
    },
    {
      id: "conv-3",
      participantId: "trainer-3",
      participantName: "Alex Rodriguez",
      participantRole: "trainer",
      lastMessage: "Thanks for the diet plan feedback!",
      lastMessageTime: new Date("2025-10-02T16:45:00"),
      unreadCount: 1,
    },
  ]);

  // Mock messages - replace with API call
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      senderId: "trainer-1",
      receiverId: currentUserId,
      content: "Hi! How are you feeling after yesterday's workout?",
      createdAt: new Date("2025-10-04T13:00:00"),
      read: true,
    },
    {
      id: "msg-2",
      senderId: currentUserId,
      receiverId: "trainer-1",
      content: "Great! A bit sore but in a good way. I'm ready for more!",
      createdAt: new Date("2025-10-04T13:15:00"),
      read: true,
    },
    {
      id: "msg-3",
      senderId: "trainer-1",
      receiverId: currentUserId,
      content: "Perfect! That means your muscles are adapting. Keep it up!",
      createdAt: new Date("2025-10-04T14:20:00"),
      read: false,
    },
    {
      id: "msg-4",
      senderId: "trainer-1",
      receiverId: currentUserId,
      content: "Great progress on your strength training!",
      createdAt: new Date("2025-10-04T14:30:00"),
      read: false,
    },
  ]);

  const selectedConv = useMemo(
    () => conversations.find((c) => c.id === selectedConversation) ?? null,
    [conversations, selectedConversation]
  );

  const conversationMessages = useMemo(() => {
    if (!selectedConv) {
      return [];
    }

    return messages
      .filter(
        (m) =>
          (m.senderId === currentUserId &&
            m.receiverId === selectedConv.participantId) ||
          (m.receiverId === currentUserId &&
            m.senderId === selectedConv.participantId)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }, [messages, selectedConv, currentUserId]);

  const handleIncomingEnvelope = useCallback(
    (payload: SocketEnvelope) => {
      if (!payload?.conversationId) {
        return;
      }

      const createdAt = payload.createdAt
        ? new Date(payload.createdAt)
        : new Date();
      const messageId =
        payload.id ?? `msg-${payload.conversationId}-${createdAt.getTime()}`;
      const isOwnMessage = payload.senderId === currentUserId;
      const activeConversationId = selectedConversationRef.current;
      const isActiveConversation =
        activeConversationId === payload.conversationId;

      const incomingMessage: Message = {
        id: messageId,
        senderId: payload.senderId,
        receiverId: payload.receiverId,
        content: payload.content,
        createdAt,
        read:
          isOwnMessage ||
          (payload.receiverId === currentUserId && isActiveConversation)
            ? true
            : payload.receiverId !== currentUserId
            ? true
            : false,
      };

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === incomingMessage.id)) {
          return prev;
        }
        const next = [...prev, incomingMessage];
        next.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return next;
      });

      const otherParticipantId =
        payload.senderId === currentUserId
          ? payload.receiverId
          : payload.senderId;
      if (!otherParticipantId) {
        return;
      }

      const otherParticipantName =
        payload.senderId === currentUserId
          ? payload.receiverName ?? "PrimePulse Member"
          : payload.senderName ?? "PrimePulse Trainer";

      const otherParticipantRole: ParticipantRole =
        payload.senderId === currentUserId
          ? payload.receiverRole === "user"
            ? "user"
            : "trainer"
          : payload.senderRole === "trainer"
          ? "trainer"
          : "user";

      setConversations((prev) => {
        const existing = prev.find(
          (conv) => conv.id === payload.conversationId
        );

        if (existing) {
          const nextUnread =
            isOwnMessage || isActiveConversation ? 0 : existing.unreadCount + 1;

          const updated = prev
            .map((conv) =>
              conv.id === payload.conversationId
                ? {
                    ...conv,
                    participantId: otherParticipantId,
                    participantName: otherParticipantName,
                    participantRole: otherParticipantRole,
                    lastMessage: payload.content,
                    lastMessageTime: createdAt,
                    unreadCount: nextUnread,
                  }
                : conv
            )
            .sort(
              (a, b) =>
                b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
            );

          return updated;
        }

        const newConversation: Conversation = {
          id: payload.conversationId,
          participantId: otherParticipantId,
          participantName: otherParticipantName,
          participantRole: otherParticipantRole,
          lastMessage: payload.content,
          lastMessageTime: createdAt,
          unreadCount: isOwnMessage || isActiveConversation ? 0 : 1,
        };

        return [newConversation, ...prev];
      });
    },
    [currentUserId]
  );

  useEffect(() => {
    let isMounted = true;
    let attempt = 0;

    const connect = () => {
      if (!isMounted) {
        return;
      }

      setConnectionStatus("connecting");

      const ws = new WebSocket(`${WS_URL}?userId=${currentUserId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        attempt = 0;
        setConnectionStatus("connected");
        if (reconnectTimeoutRef.current) {
          window.clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const raw =
            typeof event.data === "string" ? event.data : "" + event.data;
          const payload = JSON.parse(raw) as SocketEnvelope;
          handleIncomingEnvelope(payload);
        } catch (error) {
          console.error("Failed to parse incoming chat message", error);
        }
      };

      ws.onerror = () => {
        ws.close();
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        if (!isMounted) {
          return;
        }
        attempt += 1;
        const delay = Math.min(10000, 1000 * attempt);
        reconnectTimeoutRef.current = window.setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [currentUserId, handleIncomingEnvelope]);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (!selectedConversation || !selectedConv) {
      return;
    }

    setConversations((prev) => {
      let changed = false;
      const next = prev.map((conv) => {
        if (conv.id === selectedConversation && conv.unreadCount > 0) {
          changed = true;
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });
      return changed ? next : prev;
    });

    setMessages((prev) => {
      let changed = false;
      const next = prev.map((msg) => {
        if (
          msg.senderId === selectedConv.participantId &&
          msg.receiverId === currentUserId &&
          !msg.read
        ) {
          changed = true;
          return { ...msg, read: true };
        }
        return msg;
      });
      return changed ? next : prev;
    });
  }, [selectedConversation, selectedConv, currentUserId]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConv) {
      return;
    }

    const trimmed = messageInput.trim();
    const createdAt = new Date();
    const messageId = `msg-${createdAt.getTime()}`;

    const payload: SocketEnvelope = {
      id: messageId,
      conversationId: selectedConv.id,
      senderId: currentUserId,
      senderRole: "user",
      receiverId: selectedConv.participantId,
      receiverRole: selectedConv.participantRole,
      content: trimmed,
      createdAt: createdAt.toISOString(),
    };

    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
      toast.success("Message sent!");
    } else {
      toast.error("Unable to send message. Attempting to reconnect...");
    }

    const optimisticMessage: Message = {
      id: messageId,
      senderId: currentUserId,
      receiverId: selectedConv.participantId,
      content: trimmed,
      createdAt,
      read: true,
    };

    setMessages((prev) => {
      const next = [...prev, optimisticMessage];
      next.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return next;
    });

    setConversations((prev) =>
      prev
        .map((conv) =>
          conv.id === selectedConv.id
            ? {
                ...conv,
                lastMessage: trimmed,
                lastMessageTime: createdAt,
                unreadCount: 0,
              }
            : conv
        )
        .sort(
          (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        )
    );

    setMessageInput("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const connectionIndicator = useMemo(() => {
    switch (connectionStatus) {
      case "connected":
        return { label: "Connected", dotClass: "bg-emerald-500" };
      case "connecting":
        return { label: "Connecting…", dotClass: "bg-amber-500" };
      default:
        return { label: "Disconnected", dotClass: "bg-rose-500" };
    }
  }, [connectionStatus]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Chat with your trainers and get personalized guidance
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={`h-2 w-2 rounded-full ${connectionIndicator.dotClass}`}
          />
          <span>{connectionIndicator.label}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Conversations List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-accent" />
              Conversations
            </CardTitle>
            <CardDescription>Your active chats with trainers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {conversations.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`cursor-pointer rounded-lg border p-3 transition hover:shadow-md ${
                    selectedConversation === conv.id
                      ? "border-accent bg-accent/5"
                      : "bg-card"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{conv.participantName}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {conv.participantRole}
                        </p>
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {conv.lastMessage}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatTime(conv.lastMessageTime)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="shadow-card">
          {selectedConv ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{selectedConv.participantName}</CardTitle>
                    <CardDescription className="capitalize">
                      {selectedConv.participantRole}
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={`h-2 w-2 rounded-full ${connectionIndicator.dotClass}`}
                    />
                    <span>{connectionIndicator.label}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-96 space-y-4 overflow-y-auto p-4">
                  {conversationMessages.map((message) => {
                    const isSent = message.senderId === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isSent ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isSent
                              ? "bg-accent text-white"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`mt-1 text-xs ${
                              isSent ? "text-white/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.createdAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex h-full min-h-96 flex-col items-center justify-center p-8 text-center">
              <MessageCircle className="mb-4 h-16 w-16 text-muted-foreground opacity-20" />
              <h3 className="mb-2 font-semibold">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a trainer from the list to start chatting
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${connectionIndicator.dotClass}`}
                />
                <span>{connectionIndicator.label}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesView;
