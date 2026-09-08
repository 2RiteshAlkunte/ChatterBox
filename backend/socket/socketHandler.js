const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

// In-memory presence map: roomName -> Map<socketId, { userId, username, avatarColor }>
// This is fine for a single Node process. For multi-instance scaling you'd move
// this into Redis (e.g. via the socket.io-redis adapter) and use its pub/sub.
const roomPresence = new Map();

function getRoomUsers(room) {
  const map = roomPresence.get(room);
  if (!map) return [];
  // De-duplicate by username in case the same user has multiple tabs open
  const seen = new Map();
  for (const info of map.values()) {
    seen.set(info.username, info);
  }
  return Array.from(seen.values());
}

function addToRoom(room, socketId, userInfo) {
  if (!roomPresence.has(room)) roomPresence.set(room, new Map());
  roomPresence.get(room).set(socketId, userInfo);
}

function removeFromAllRooms(socketId) {
  const affectedRooms = [];
  for (const [room, map] of roomPresence.entries()) {
    if (map.has(socketId)) {
      map.delete(socketId);
      affectedRooms.push(room);
      if (map.size === 0) roomPresence.delete(room);
    }
  }
  return affectedRooms;
}

module.exports = function registerSocketHandlers(io) {
  // Authenticate the socket connection using the JWT issued at login/guest login.
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, username, isGuest }
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.user.username})`);
    let currentRoom = null;

    // --- joinRoom -----------------------------------------------------
    // Client sends the room NAME. We look up (or trust) the room, join the
    // socket.io room channel, track presence, send back chat history, and
    // broadcast the updated online users list to everyone in the room.
    socket.on('joinRoom', async ({ room }) => {
      try {
        if (!room) return;

        // Leave the previous room first, if any
        if (currentRoom && currentRoom !== room) {
          socket.leave(currentRoom);
          const map = roomPresence.get(currentRoom);
          if (map) map.delete(socket.id);
          io.to(currentRoom).emit('onlineUsers', getRoomUsers(currentRoom));
          socket.to(currentRoom).emit('userLeft', { username: socket.user.username });
        }

        socket.join(room);
        currentRoom = room;

        addToRoom(room, socket.id, {
          userId: socket.user.id,
          username: socket.user.username,
        });

        // Load recent chat history (last 50 messages) for this room
        const roomDoc = await Room.findOne({ name: room });
        let history = [];
        if (roomDoc) {
          history = await Message.find({ room: roomDoc._id })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
          history.reverse();
        }

        socket.emit('roomHistory', { room, messages: history });
        io.to(room).emit('onlineUsers', getRoomUsers(room));
        socket.to(room).emit('userJoined', { username: socket.user.username });
      } catch (err) {
        socket.emit('errorMessage', { message: 'Failed to join room' });
      }
    });

    // --- chatMessage ----------------------------------------------------
    // Persists the message to MongoDB, then broadcasts it to everyone in
    // the room (including the sender, so all clients render from one source
    // of truth rather than optimistically echoing locally).
    socket.on('chatMessage', async ({ room, text }) => {
      try {
        if (!room || !text || !text.trim()) return;

        const roomDoc = await Room.findOne({ name: room });
        if (!roomDoc) {
          return socket.emit('errorMessage', { message: 'Room does not exist' });
        }

        const message = await Message.create({
          room: roomDoc._id,
          sender: socket.user.id,
          username: socket.user.username,
          text: text.trim().slice(0, 2000),
        });

        io.to(room).emit('chatMessage', {
          _id: message._id,
          room,
          username: message.username,
          text: message.text,
          createdAt: message.createdAt,
        });
      } catch (err) {
        socket.emit('errorMessage', { message: 'Failed to send message' });
      }
    });

    // --- typing -----------------------------------------------------
    // Broadcast to everyone else in the room (never back to the sender).
    socket.on('typing', ({ room, isTyping }) => {
      if (!room) return;
      socket.to(room).emit('typing', {
        username: socket.user.username,
        isTyping: !!isTyping,
      });
    });

    // --- disconnect -----------------------------------------------------
    socket.on('disconnect', async () => {
      const affectedRooms = removeFromAllRooms(socket.id);
      affectedRooms.forEach((room) => {
        io.to(room).emit('onlineUsers', getRoomUsers(room));
        socket.to(room).emit('userLeft', { username: socket.user.username });
      });

      try {
        await User.findByIdAndUpdate(socket.user.id, { lastSeen: new Date() });
      } catch (_) {
        // non-critical
      }

      console.log(`Socket disconnected: ${socket.id} (${socket.user.username})`);
    });
  });
};
