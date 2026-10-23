import { io } from "socket.io-client";

let socket = null;

export function connectSocket() {
  if (socket) {
    return socket;
  }

  socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
    withCredentials: true,
    extraHeaders: {
      "ngrok-skip-browser-warning": "true",
    },
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}