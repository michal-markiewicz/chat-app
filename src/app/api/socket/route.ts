import ChatService from "@/app/server/helpers/ChatService";
import { NextRequest, NextResponse } from "next/server";
import { WebSocketServer } from "ws";

export async function POST(req: NextRequest, res: NextResponse) {
  const chatService = new ChatService();
  const wss = new WebSocketServer({
    port: 443,
  });

  wss.on("connection", (ws, req) => {
    ws.on("error", console.error);
    ws.on("message", async (data) => {
      const newMessageJson = data.toString();
      const newMessage = JSON.parse(newMessageJson);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(newMessageJson);
        }
      });

      await chatService.saveMessage(newMessage);
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
