import { io } from 'socket.io-client';

const SOCKET_URL = 'https://chatterbox-ckmi.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
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
