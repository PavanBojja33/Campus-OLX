import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});
