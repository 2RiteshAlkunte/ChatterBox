# ChatterBox — Backend

Node.js + Express + Socket.io + MongoDB backend for the real-time chat app.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local Mongo or a MongoDB Atlas connection string)
#            set JWT_SECRET to any long random string
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

Server starts on `http://localhost:5000` by default. Health check: `GET /api/health`.

### Requirements
- Node.js 18+
- A running MongoDB instance (local `mongod`, Docker, or MongoDB Atlas)

## REST API

| Method | Route                          | Auth | Description                          |
|--------|--------------------------------|------|---------------------------------------|
| POST   | `/api/auth/register`           | No   | `{ username, password }` → creates account |
| POST   | `/api/auth/login`               | No   | `{ username, password }` → returns JWT |
| POST   | `/api/auth/guest`                | No   | `{ username }` → instant guest login, no password |
| GET    | `/api/rooms`                     | No   | List all chat rooms |
| POST   | `/api/rooms`                     | Yes  | `{ name, description }` → create a room |
| GET    | `/api/rooms/:roomId/messages`    | No   | Paginated history (`?before=&limit=`) |

All authenticated routes expect `Authorization: Bearer <token>`.

## Socket.io events

Connect with `auth: { token }` (the JWT from login/register/guest).

**Client → Server**
- `joinRoom` — `{ room: <roomName> }`
- `chatMessage` — `{ room: <roomName>, text: <string> }`
- `typing` — `{ room: <roomName>, isTyping: boolean }`

**Server → Client**
- `roomHistory` — `{ room, messages: [...] }` (sent right after joining)
- `chatMessage` — `{ _id, room, username, text, createdAt }`
- `onlineUsers` — `[{ userId, username }]` for the current room
- `typing` — `{ username, isTyping }`
- `userJoined` / `userLeft` — `{ username }`
- `errorMessage` — `{ message }`

## Data models
- **User**: `username`, `password` (hashed, omitted for guests), `isGuest`, `avatarColor`, `lastSeen`
- **Room**: `name`, `description`, `createdBy`
- **Message**: `room`, `sender`, `username`, `text`, `recipient` (reserved for 1-to-1 DMs), timestamps

## Notes on scaling
Online-user presence is tracked in an in-memory `Map` inside `socket/socketHandler.js`.
That's fine for a single server instance. If you deploy multiple backend instances behind
a load balancer, swap this for the `@socket.io/redis-adapter` so presence and broadcasts
are shared across instances.
