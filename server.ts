import ChatService from "@/app/server/helpers/ChatService";
import { createServer } from "http";
import next from "next";
import { parse } from "url";
import { WebSocket, WebSocketServer } from "ws";

const dev = process.env.NODE_ENV !== "production";
const hostname = "127.0.0.1";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  const chatService = new ChatService();
  const wss = new WebSocketServer({ server });
  const users = new Map();

  function sendDataToEachClient(wss: WebSocketServer, data: any) {
    const dataJson = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(dataJson);
      }
    });
  }

  wss.on("connection", (ws, req) => {
    ws.on("close", () => {
      users.delete(ws);
      const usernames = users.values();
      sendDataToEachClient(wss, {
        users: Array.from(usernames),
        type: "users",
      });
    });
    ws.on("error", console.error);
    ws.on("message", async (data) => {
      const dataJson = data.toString();
      const dataObj = JSON.parse(dataJson);

      if (dataObj.type === "message") {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(dataJson);
          }
        });
        await chatService.saveMessage(dataObj);
      }

      if (dataObj.type === "user-connected") {
        users.set(ws, dataObj.username);
        const usernames = users.values();
        sendDataToEachClient(wss, {
          users: Array.from(usernames),
          type: "users",
        });
      }
    });
  });
});
