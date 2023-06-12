import { io, Socket } from "socket.io-client";
import { ChatServer, WebService } from "@/api/config/servicePort";
import axios from "axios";

const socketChat: Socket = io(ChatServer, {
	transports: ["Websocket", "polling"],
	timeout: 5000
});

const socketTrain: Socket = io(axios.defaults.baseURL + WebService, {
	transports: ["Websocket", "polling"],
	timeout: 5000
});

export { socketChat, socketTrain };
