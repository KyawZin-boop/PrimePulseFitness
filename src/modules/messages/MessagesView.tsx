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
import { useState } from "react";
import type { Message } from "@/types";
import { toast } from "sonner";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: "trainer" | "user";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

const MessagesView = () => {
  const currentUserId = "user-1"; // Replace with actual user ID
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

  // Mock conversations - replace with API call
  const [conversations] = useState<Conversation[]>([
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

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  
  const conversationMessages = selectedConversation
    ? messages.filter(
        (m) =>
          (m.senderId === currentUserId && m.receiverId === selectedConv?.participantId) ||
          (m.receiverId === currentUserId && m.senderId === selectedConv?.participantId)
      )
    : [];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConv) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      receiverId: selectedConv.participantId,
      content: messageInput,
      createdAt: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
    toast.success("Message sent!");
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Chat with your trainers and get personalized guidance
        </p>
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
                        className={`flex ${isSent ? "justify-end" : "justify-start"}`}
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
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
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
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesView;
