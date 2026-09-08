import { io } from 'socket.io-client';

const SOCKET_URL = 'https://chatterbox-ckmi.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['polling'],
});

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.log('Socket connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

export function connectSocket(token) {
  if (!token) return socket;

  if (socket.connected && socket.auth?.token === token) return socket;

  if (socket.connected) {
    socket.disconnect();
  }

  socket.auth = { token };
  socket.connect();
  return socket;
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
