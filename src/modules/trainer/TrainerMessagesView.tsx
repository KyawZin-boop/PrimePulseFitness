import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ImagePlus,
  Loader2,
  MessageCircle,
  RefreshCw,
  Send,
  User,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import api from "@/api";
import { useSearchParams } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { set } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STATUS_LABEL: Record<NonNullable<ChatMessage["status"]>, string> = {
  pending: "Pending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  error: "Failed",
};

const connectionMeta: Record<
  ChatConnectionState,
  { label: string; className: string }
> = {
  idle: { label: "Idle", className: "bg-muted text-muted-foreground" },
  connecting: { label: "Connecting", className: "bg-amber-100 text-amber-700" },
  open: { label: "Connected", className: "bg-emerald-100 text-emerald-700" },
  closing: { label: "Closing", className: "bg-amber-200 text-amber-800" },
  closed: { label: "Disconnected", className: "bg-gray-200 text-gray-700" },
  error: { label: "Error", className: "bg-destructive/10 text-destructive" },
};

const buildConversationId = (first: string, second: string) => {
  const [a, b] = [first, second].sort((x, y) => x.localeCompare(y));
  return `conversation:${a}:${b}`;
};

const parseTimestamp = (timestamp: string) => {
  if (!timestamp) {
    return null;
  }

  const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(timestamp);
  const normalized = hasTimezone ? timestamp : `${timestamp}Z`;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const formatTimestamp = (timestamp: string) => {
  const date = parseTimestamp(timestamp);
  if (!date) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    month: "short",
    day: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(date);
};

interface Client {
  userID: string;
  name: string;
  email: string;
  role: string;
}

const filterClients = (clients: Client[] | undefined, term: string) => {
  if (!clients) {
    return [];
  }

  const trimmed = term.trim().toLowerCase();
  if (!trimmed) {
    return clients;
  }

  return clients.filter((client) => {
    return (
      client.name?.toLowerCase().includes(trimmed) ||
      client.email?.toLowerCase().includes(trimmed)
    );
  });
};

const TrainerMessagesView = () => {
  const { userCredentials: currentUser } = useAuth();
  const currentUserId = useMemo(() => currentUser?.userId ?? "", [currentUser]);

  // TODO: Replace with actual trainer clients endpoint
  // For now, using empty array - backend needs to provide api.trainer.getMyClients()
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isClientsError, setIsClientsError] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const clientIdFromQuery = searchParams.get("client");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeClientId, setActiveClientId] = useState<string | null>(
    clientIdFromQuery
  );
  const [draft, setDraft] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  const { data: response } = api.user.getAllUsers.useQuery();
  // Load clients on mount
  useEffect(() => {
    if (response) {
      setClients(response);
      return;
    }
  }, [response]);

  useEffect(() => {
    if (!clients?.length) {
      return;
    }

    if (
      clientIdFromQuery &&
      clients.some((client) => client.userID === clientIdFromQuery)
    ) {
      setActiveClientId(clientIdFromQuery);
      return;
    }

    setActiveClientId((prev) => {
      if (prev && clients.some((client) => client.userID === prev)) {
        return prev;
      }
      return clients[0]?.userID ?? null;
    });
  }, [clients, clientIdFromQuery]);

  useEffect(() => {
    if (!activeClientId) {
      if (clientIdFromQuery) {
        setSearchParams({}, { replace: true });
      }
      return;
    }

    if (clientIdFromQuery !== activeClientId) {
      setSearchParams({ client: activeClientId }, { replace: true });
    }
  }, [activeClientId, clientIdFromQuery, setSearchParams]);

  const filteredClients = useMemo(
    () => filterClients(clients, searchTerm),
    [clients, searchTerm]
  );

  const activeClient =
    clients?.find((client) => client.userID === activeClientId) ?? null;

  const chatIdentity = currentUser
    ? {
        id: currentUser.userId,
        name: currentUser.name,
        email: currentUser.email,
      }
    : null;
  const peerIdentity = activeClient
    ? {
        id: activeClient.userID,
        name: activeClient.name,
        email: activeClient.email,
      }
    : null;

  const conversationId =
    chatIdentity && peerIdentity
      ? buildConversationId(chatIdentity.id, peerIdentity.id)
      : undefined;

  const loadHistory = useCallback(async () => {
    if (!conversationId || !chatIdentity?.id || !peerIdentity?.id) {
      return [];
    }

    try {
      const history = await api.chat.getChatHistory({
        userId: chatIdentity.id,
        trainerId: peerIdentity.id,
      });

      return history
        .map((item) =>
          api.chat.mapHistoryItemToChatMessage(item, buildConversationId)
        )
        .filter(
          (item): item is ChatMessage =>
            !!item && item.conversationId === conversationId
        );
    } catch (error) {
      console.error("Failed to fetch chat history", error);
      throw error;
    }
  }, [chatIdentity?.id, conversationId, peerIdentity?.id]);

  const {
    connectionState,
    messages,
    sendMessage,
    lastError,
    reconnect,
    clearMessages,
    isHistoryLoading,
    historyLoaded,
  } = useChat({
    conversationId,
    currentUser: chatIdentity ?? undefined,
    peer: peerIdentity ?? undefined,
    loadHistory,
  });

  const isLoadingInitial = isLoadingClients || isHistoryLoading;
  const hasChatTarget = !!chatIdentity && !!peerIdentity;

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeClientId]);

  useEffect(() => {
    setAttachmentUrl("");
  }, [conversationId]);

  const { mutate: uploadAttachment, isPending: isUploadingAttachment } =
    api.files.uploadFile.useMutation({
      onMutate: () => {
        setAttachmentUrl("");
      },
      onSuccess: (url) => {
        setAttachmentUrl(url);
        toast.success("Image attached");
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to upload image. Please try again.";
        toast.error(message);
      },
    });

  const canSubmit =
    hasChatTarget &&
    !isUploadingAttachment &&
    !isLoadingInitial &&
    (!!draft.trim() || !!attachmentUrl);

  const handleAttachmentClick = () => {
    if (!hasChatTarget || isUploadingAttachment) {
      return;
    }

    attachmentInputRef.current?.click();
  };

  const handleAttachmentChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      uploadAttachment(file);
      event.target.value = "";
    },
    [uploadAttachment]
  );

  const handleRemoveAttachment = () => {
    setAttachmentUrl("");
  };

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUploadingAttachment || !hasChatTarget) {
      return;
    }

    const trimmed = draft.trim();
    const imageUrl = attachmentUrl || null;
    if (!trimmed && !imageUrl) {
      return;
    }

    const result = sendMessage(trimmed, { imageUrl });
    if (result) {
      setDraft("");
      setAttachmentUrl("");
    }
  };

  const connectionIndicator = useMemo(() => {
    switch (connectionState) {
      case "open":
        return { label: "Connected", dotClass: "bg-emerald-500" };
      case "connecting":
        return { label: "Connecting…", dotClass: "bg-amber-500" };
      default:
        return { label: "Disconnected", dotClass: "bg-rose-500" };
    }
  }, [connectionState]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (isUploadingAttachment || !hasChatTarget) {
      return;
    }

    const trimmed = draft.trim();
    const imageUrl = attachmentUrl || null;
    if (!trimmed && !imageUrl) {
      return;
    }

    const result = sendMessage(trimmed, { imageUrl });
    if (result) {
      setDraft("");
      setAttachmentUrl("");
    }
  };

  return (
    <div className="container flex justify-center items-center px-4 mb-3 lg:mb-0 h-full">
      <div className="grid gap-6 lg:grid-cols-[350px_1fr] flex-1">
        {/* Clients List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-accent" />
              Clients
            </CardTitle>
            <CardDescription>Your chats with clients</CardDescription>
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-4"
            />
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoadingClients && (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-md border p-3"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoadingClients &&
              !isClientsError &&
              filteredClients.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  No clients match that search.
                </p>
              )}

            {!isLoadingClients &&
              !isClientsError &&
              filteredClients.length > 0 &&
              filteredClients.map((conv) => (
                <div
                  key={conv.userID}
                  onClick={() => setActiveClientId(conv.userID)}
                  className={`cursor-pointer rounded-lg border p-3 transition hover:shadow-md ${
                    activeClientId === conv.userID
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
                        <h4 className="font-medium">{conv.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {conv.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="shadow-card">
          {peerIdentity ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{peerIdentity.name}</CardTitle>
                    <CardDescription className="capitalize">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "border-transparent",
                            connectionMeta[connectionState].className
                          )}
                        >
                          {connectionMeta[connectionState].label}
                        </Badge>
                        {lastError && (
                          <span className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="size-3" /> {lastError}
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reconnect()}
                      disabled={!hasChatTarget}
                    >
                      <RefreshCw className="size-4" /> Reconnect
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => clearMessages()}
                      disabled={!messages.length || !hasChatTarget}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-96 space-y-4 overflow-y-auto p-4">
                  {isLoadingInitial && (
                    <div className="flex flex-1 items-center justify-center text-muted-foreground">
                      <Loader2 className="mr-2 size-5 animate-spin" /> Preparing
                      chat...
                    </div>
                  )}

                  {!isLoadingInitial && !hasChatTarget && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                      <MessageCircle className="size-12" />
                      <p className="text-sm">
                        Select a designer to start chatting.
                      </p>
                    </div>
                  )}

                  {!isLoadingInitial && hasChatTarget && (
                    <>
                      {messages.length === 0 && historyLoaded && (
                        <div className="text-muted-foreground text-sm">
                          No messages yet. Say hello to get things started!
                        </div>
                      )}
                    </>
                  )}

                  {messages.map((message) => {
                    const status = message.status
                      ? STATUS_LABEL[message.status]
                      : undefined;
                    const isOwnMessage = message.senderId === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex w-full max-w-full gap-2",
                          isOwnMessage ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={peerIdentity?.name}
                              alt={peerIdentity?.name}
                            />
                            <AvatarFallback>
                              {peerIdentity?.name?.charAt(0)?.toUpperCase() ||
                                "T"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[75%] space-y-1 break-words",
                            isOwnMessage && "items-end text-right"
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-lg px-3 py-2 text-sm text-left",
                              isOwnMessage
                                ? "bg-accent text-white"
                                : "bg-secondary text-foreground",
                              message.imageUrl && "p-2"
                            )}
                          >
                            <div className="space-y-2">
                              {message.imageUrl ? (
                                <img
                                  src={message.imageUrl}
                                  alt="Sent attachment"
                                  className="max-h-72 w-full rounded-md object-cover"
                                />
                              ) : null}
                              {message.content ? (
                                <p className="whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {formatTimestamp(message.timestamp)}
                            {isOwnMessage && status ? ` · ${status}` : null}
                          </div>
                        </div>
                        {isOwnMessage && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={chatIdentity?.name}
                              alt={chatIdentity?.name}
                            />
                            <AvatarFallback>
                              {chatIdentity?.name?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSend}
                  className="border-t bg-card px-6 pt-4"
                >
                  <div className="flex flex-col gap-3">
                    {attachmentUrl ? (
                      <div className="flex items-center gap-3 rounded-md border p-2">
                        <img
                          src={attachmentUrl}
                          alt="Attachment preview"
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveAttachment}
                        >
                          <XCircle className="mr-2 size-4" />
                          Remove
                        </Button>
                      </div>
                    ) : null}
                    <div className="flex items-end gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!hasChatTarget}
                        rows={2}
                        className="resize-none"
                      />
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAttachmentClick}
                          disabled={!hasChatTarget || isUploadingAttachment}
                        >
                          {isUploadingAttachment ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Uploading
                            </>
                          ) : (
                            <>
                              <ImagePlus className="mr-2 size-4" />
                              Image
                            </>
                          )}
                        </Button>
                        <Button type="submit" disabled={!canSubmit}>
                          <Send className="size-4" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAttachmentChange}
                    className="hidden"
                  />
                </form>
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

export default TrainerMessagesView;
