// utils/socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io(`${process.env.NEXT_PUBLIC_API_URL_TWO}`, {});

socket.on("connection", () => {
  console.log("Connected to socket.io server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket.io server");
});

// socket.on('connect_error', (error) => {
//     console.error('Connection error:', error);
//   });

export default socket;
