import { Socket, io } from "socket.io-client";
import { ENV } from "cons";

let socket: Socket;
const URL = ENV.socketURL;

export const initMessageSocket = () => {
  socket = io(URL + "/chat", {
    reconnectionAttempts: 4,
    reconnection: true,
    reconnectionDelay: 2000,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("client connected to chat=>>", socket);
  });

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("connect_error", (error) => {
    console.log("client couldn't connect to chat=>>", error);
  });
};
