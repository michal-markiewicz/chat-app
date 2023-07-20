import ChatService from "@/app/server/helpers/ChatService";
import { NextRequest, NextResponse } from "next/server";
import { WebSocketServer } from "ws";

export async function POST(req: NextRequest, res: NextResponse) {
  const chatService = new ChatService();
  const wss = new WebSocketServer({
    port: 443,
  });

  const users: string[] = [];

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
      if (ws.user) {
        const disconnectedUserIndex = users.findIndex(
          (user) => user === ws.user
        );
        users.splice(disconnectedUserIndex, 1);
        sendDataToEachClient(wss, { users, type: "users" });
      }
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
        ws.user = dataObj.username;
        users.push(dataObj.username);
        sendDataToEachClient(wss, { users, type: "users" });
      }
    });
  });

  return NextResponse.json(
    {
      msg: "Socket server started",
    },
    {
      status: 200,
    }
  );
}
