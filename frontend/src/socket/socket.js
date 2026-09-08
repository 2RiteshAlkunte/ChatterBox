import { io } from 'socket.io-client';
import { API_URL } from '../api/axios';

let socket = null;

// Creates (or returns the existing) authenticated socket connection.
// Called once the user is logged in / has a guest token.
export function connectSocket(token) {
  if (socket && socket.connected) return socket;

  socket = io(API_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
