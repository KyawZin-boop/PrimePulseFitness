import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Search, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isTrainer: boolean;
}

interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientPhoto?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

const TrainerMessagesView = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      clientId: "1",
      clientName: "Alex Johnson",
      clientPhoto: "https://i.pravatar.cc/150?img=1",
      lastMessage: "Thanks for the workout tips!",
      lastMessageTime: new Date("2025-05-22T14:30:00"),
      unreadCount: 2,
      messages: [
        {
          id: "m1",
          senderId: "trainer",
          senderName: "You",
          content: "Great session today! Keep up the excellent work.",
          timestamp: new Date("2025-05-22T10:00:00"),
          isTrainer: true,
        },
        {
          id: "m2",
          senderId: "1",
          senderName: "Alex Johnson",
          content: "Thanks! I'm feeling much stronger already.",
          timestamp: new Date("2025-05-22T10:15:00"),
          isTrainer: false,
        },
        {
          id: "m3",
          senderId: "trainer",
          senderName: "You",
          content:
            "Excellent! For next session, we'll focus on increasing weight.",
          timestamp: new Date("2025-05-22T11:00:00"),
          isTrainer: true,
        },
        {
          id: "m4",
          senderId: "1",
          senderName: "Alex Johnson",
          content: "Thanks for the workout tips!",
          timestamp: new Date("2025-05-22T14:30:00"),
          isTrainer: false,
        },
      ],
    },
    {
      id: "2",
      clientId: "2",
      clientName: "Sarah Williams",
      clientPhoto: "https://i.pravatar.cc/150?img=5",
      lastMessage: "Can we reschedule tomorrow's session?",
      lastMessageTime: new Date("2025-05-22T09:00:00"),
      unreadCount: 1,
      messages: [
        {
          id: "m5",
          senderId: "2",
          senderName: "Sarah Williams",
          content: "Can we reschedule tomorrow's session?",
          timestamp: new Date("2025-05-22T09:00:00"),
          isTrainer: false,
        },
      ],
    },
    {
      id: "3",
      clientId: "3",
      clientName: "Mike Chen",
      clientPhoto: "https://i.pravatar.cc/150?img=12",
      lastMessage: "See you tomorrow at 10 AM!",
      lastMessageTime: new Date("2025-05-21T18:00:00"),
      unreadCount: 0,
      messages: [
        {
          id: "m6",
          senderId: "trainer",
          senderName: "You",
          content: "Your next session is scheduled for tomorrow at 10 AM.",
          timestamp: new Date("2025-05-21T17:00:00"),
          isTrainer: true,
        },
        {
          id: "m7",
          senderId: "3",
          senderName: "Mike Chen",
          content: "See you tomorrow at 10 AM!",
          timestamp: new Date("2025-05-21T18:00:00"),
          isTrainer: false,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m-${Date.now()}`,
      senderId: "trainer",
      senderName: "You",
      content: newMessage,
      timestamp: new Date(),
      isTrainer: true,
    };

    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: new Date(),
            }
          : conv
      )
    );

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
    });

    setNewMessage("");
    toast.success("Message sent!");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with your clients in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <Card className="shadow-card md:col-span-1 overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="space-y-1 p-4 pt-0">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left rounded-lg p-3 transition hover:bg-secondary ${
                    selectedConversation?.id === conv.id ? "bg-secondary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                      {conv.clientPhoto ? (
                        <img
                          src={conv.clientPhoto}
                          alt={conv.clientName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold truncate">
                          {conv.clientName}
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="flex-shrink-0 ml-2 h-5 w-5 rounded-full bg-accent flex items-center justify-center text-xs text-white font-bold">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {conv.lastMessageTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="shadow-card md:col-span-2 overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                    {selectedConversation.clientPhoto ? (
                      <img
                        src={selectedConversation.clientPhoto}
                        alt={selectedConversation.clientName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle>{selectedConversation.clientName}</CardTitle>
                    <CardDescription>Active now</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isTrainer ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isTrainer
                            ? "bg-accent text-white"
                            : "bg-secondary"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isTrainer
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <Send className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="font-semibold mb-2">No conversation selected</h3>
              <p className="text-muted-foreground text-sm">
                Select a client to start messaging
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TrainerMessagesView;
