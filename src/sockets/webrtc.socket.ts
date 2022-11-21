import { Socket, io } from "socket.io-client";
import { ENV, Device } from "cons";

let socket: Socket;
const URL = ENV.socketURL;

export const initWebRTC = () => {
  socket = io(URL + "/webrtc", {
    reconnectionAttempts: 10,
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ["websocket"],
    auth: {
      token: "accessToken_mobile" + Device.info,
    },
  });

  socket.on("connect", () => {
    console.log("rtc socket connected!!");
  });

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("connect_error", (error) => {
    console.log("client couldn't connec", error);
  });

  socket.on("unauthorized", (data) => {
    console.log("unauthorized--", data);
  });

  socket.on("success", (data) => {
    console.log(data);
  });
};

export const disconnect = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket.removeAllListeners();
};

export const reconnect = (): void => {
  if (socket?.disconnected) {
    socket.connect();
  }
};

export const userJoined = (callback: any): void => {
  socket.on("user-joined", (socketId: any) => {
    socket.emit("reply-to", socketId);
    callback(socketId);
  });
};

export const replyIn = (callback: any): void => {
  socket.on("reply-in", (socketId: any) => {
    callback(socketId);
  });
};

export const sendOffer = (id: string, offer: any): void => {
  socket.emit("offer", { id, offer });
};

export const offerIn = (callback: any): void => {
  socket.on("in-offer", (data: any) => {
    callback(data);
  });
};

export const sendAnswer = (id: string, answer: any): void => {
  socket.emit("answer", { id, answer });
};

export const answerIn = (callback: any): void => {
  socket.on("in-answer", (data: any) => {
    callback(data);
  });
};

export const sendCandidate = (id: string, candidate: any): void => {
  socket.emit("candidate", { id, candidate });
};

export const candidateIn = (callback: any): void => {
  socket.on("in-candidate", (data: any) => {
    callback(data);
  });
};
