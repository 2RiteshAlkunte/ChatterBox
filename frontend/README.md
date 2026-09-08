# ChatterBox — Frontend (React)

A WhatsApp-inspired real-time chat UI built with plain React (Create React App) and
`socket.io-client`. No Next.js, no Tailwind — plain CSS in `src/styles/index.css`.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend isn't on http://localhost:5000
npm start
```

Opens on `http://localhost:3000`. Make sure the backend is running first.

## Project structure

```
src/
  api/axios.js          Axios instance, attaches JWT to every request
  socket/socket.js       Socket.io client singleton (auth via JWT)
  context/AuthContext.js Login / register / guest / logout, persists to localStorage
  components/
    AuthScreen.js         Login / Register / Guest tabs
    Sidebar.js             Room list + "create room" form + logged-in user footer
    ChatRoom.js             Joins the active room's socket channel, renders messages
    MessageBubble.js         A single chat bubble (WhatsApp-style, own vs. others)
    MessageInput.js           Input box; blocks empty sends; emits typing events
    TypingIndicator.js         "X is typing…" with animated dots
    OnlineUsersList.js          Slide-out panel of who's online in the room
  styles/index.css        WhatsApp-inspired theme (teal header, green bubbles, wallpaper bg)
```

## How real-time flow works
1. On login/register/guest, the server returns a JWT. The client stores it and opens a
   Socket.io connection authenticated with that token (`socket/socket.js`).
2. Selecting a room in the sidebar makes `ChatRoom` emit `joinRoom`. The server replies
   with `roomHistory` (chat history from MongoDB) and everyone in the room gets an
   updated `onlineUsers` list.
3. Sending a message emits `chatMessage`; the server persists it and broadcasts it back
   to everyone in the room (including the sender), so the UI always renders from the
   server's copy.
4. Typing in the input box emits `typing: true`, and stops after 1.5s of inactivity or
   on send — other clients render the "is typing…" indicator.

## Build for production

```bash
npm run build
```

Deploy the `build/` folder to Netlify, Vercel, or any static host. Set the
`REACT_APP_API_URL` environment variable on the host to your deployed backend URL
before building.
