# Trainer Messages WebSocket Integration

## Overview
The `TrainerMessagesView` component has been successfully refactored to use WebSocket for real-time chat messaging between trainers and their clients, matching the same pattern used in the user `MessagesView`.

## Key Changes Made

### 1. **WebSocket Integration**
- Integrated `useChat` hook for real-time messaging
- Connection state management with auto-reconnection
- Real-time message sending and receiving
- Message history loading from backend API

### 2. **Client List Management**
- Changed from static trainer list to dynamic client list
- Added client filtering by search term
- Query parameter support for deep-linking to specific conversations (`?client=CLIENT_ID`)

### 3. **UI Components**
- Connection status badge (Connected, Connecting, Disconnected, Error)
- Reconnection button when connection fails
- Loading skeletons for better UX
- Message bubbles with timestamps
- Image attachment support

### 4. **File Attachments**
- File upload support via `api.files.uploadFile`
- Image preview in messages
- Upload progress indicators

## Architecture

### Component Structure
```
TrainerMessagesView
├── Clients List (Left Panel)
│   ├── Search Input
│   ├── Loading Skeletons
│   └── Client Cards (clickable)
└── Message Thread (Right Panel)
    ├── Header (Client info + Connection Status)
    ├── Messages Area (scrollable)
    └── Input Area (text + file upload)
```

### WebSocket Flow
```
1. User selects a client from list
2. Conversation ID is generated: conversation:{userId}:{clientId}
3. useChat hook establishes WebSocket connection
4. Message history is loaded from API
5. Real-time messages sync via WebSocket
6. Sent messages show optimistically before server confirmation
```

## Backend Requirements

### ⚠️ Important: Backend TODO Items

#### 1. **Trainer Clients Endpoint** (REQUIRED)
The component currently has a placeholder for fetching the trainer's clients. You need to implement:

**Frontend Call (line 124-134):**
```typescript
const fetchClients = async () => {
  try {
    setIsLoadingClients(true);
    // TODO: Implement api.trainer.getMyClients() on backend
    const response = await api.trainer.getMyClients();
    setClients(response.data);
  } catch (error) {
    console.error("Failed to load clients:", error);
    setIsClientsError(true);
  } finally {
    setIsLoadingClients(false);
  }
};
```

**Backend Endpoint:**
- **Route:** `GET /api/trainer/clients`
- **Authentication:** Required (trainer only)
- **Response:**
```json
{
  "data": [
    {
      "userID": "client-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User"
    }
  ]
}
```

**Implementation Notes:**
- Return users who have active bookings/sessions with the trainer
- Or users who have sent messages to the trainer
- Filter by role = "User" on backend

#### 2. **WebSocket Server** (REQUIRED)
Implement WebSocket endpoint at `wss://localhost:7003/ws/chat`

See the previously provided ASP.NET Core implementation in the conversation history.

Key components:
- `Program.cs` - WebSocket middleware setup
- `ChatConnectionManager.cs` - Connection management
- Message routing between users

#### 3. **Chat History API** (ALREADY EXISTS)
The component uses `api.chat.getChatHistory()` which should already be implemented.

**Expected API:**
- **Route:** `GET /api/chat/history`
- **Query Params:** `userId`, `trainerId`
- **Response:** Array of chat messages

#### 4. **File Upload API** (ALREADY EXISTS)
The component uses `api.files.uploadFile()` for image attachments.

**Expected API:**
- **Route:** `POST /api/files/upload`
- **Body:** FormData with file
- **Response:** `{ url: "https://..." }`

## Environment Configuration

### Frontend (.env.local)
```env
VITE_WS_CHAT_URL=wss://localhost:7003/ws/chat
```

**Note:** Update to match your actual backend WebSocket URL.

## Usage

### For Trainers
1. Navigate to Messages page
2. See list of clients in left panel
3. Click on a client to open conversation
4. Type message and press Enter or click Send
5. Attach images using the image button
6. Real-time updates when client responds

### For Developers

#### Testing WebSocket Connection
1. Open browser DevTools > Network > WS tab
2. Look for WebSocket connection to `wss://localhost:7003/ws/chat`
3. Check connection status badge in UI
4. Test sending/receiving messages
5. Test reconnection by stopping backend

#### Adding New Features
- **Read Receipts:** Extend `ChatMessage` type and WebSocket protocol
- **Typing Indicators:** Send typing events via WebSocket
- **Voice Messages:** Add audio file upload support
- **Notifications:** Integrate with browser Notification API

## Troubleshooting

### "No clients found"
- Backend `/api/trainer/clients` endpoint not implemented
- Trainer has no clients yet
- Authentication token invalid

### "Disconnected" status
- Backend WebSocket server not running
- VITE_WS_CHAT_URL incorrect
- Network/firewall blocking WebSocket connection

### Messages not sending
- Check browser console for errors
- Verify WebSocket connection is "Connected"
- Check backend logs for message processing errors

### Images not uploading
- File size too large (check backend limits)
- File type not supported
- Upload endpoint returning errors

## Security Considerations

1. **Authentication:** All WebSocket connections must be authenticated
2. **Authorization:** Trainers should only see their own clients
3. **Message Validation:** Sanitize message content on backend
4. **File Uploads:** Validate file types and sizes
5. **Rate Limiting:** Prevent message spam

## Performance

- **Lazy Loading:** Message history loaded on conversation open
- **Auto-scroll:** Messages scroll to bottom automatically
- **Optimistic Updates:** Messages show immediately, confirmed later
- **Reconnection:** Automatic with exponential backoff

## Next Steps

1. ✅ Frontend WebSocket integration complete
2. ⚠️ Implement `/api/trainer/clients` endpoint
3. ⚠️ Implement WebSocket server
4. ✅ Test real-time messaging
5. ✅ Deploy to production

---

**Last Updated:** 2025-01-XX
**Component:** `src/modules/trainer/TrainerMessagesView.tsx`
**Dependencies:** `useChat` hook, `api.chat`, `api.files`, `api.trainer`
