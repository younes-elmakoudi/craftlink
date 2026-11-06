import { io, type Socket } from 'socket.io-client';

/**
 * One shared Socket.IO connection for the whole app.
 * It is created disconnected: call connectSocket() after login, disconnectSocket() on logout.
 * Authentication uses the same httpOnly cookie as the REST API.
 * Event names: see docs/api-contract.md ("Realtime events").
 */
export const socket: Socket = io({
  path: '/socket.io',
  withCredentials: true,
  autoConnect: false,
});

export function connectSocket(): void {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket(): void {
  if (socket.connected) socket.disconnect();
}
