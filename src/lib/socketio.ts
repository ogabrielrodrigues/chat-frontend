import { io as socketio } from "socket.io-client";

const io = socketio(import.meta.env.VITE_BACKEND_URL);

export { io };
