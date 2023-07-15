import { NextRequest, NextResponse } from "next/server";
import { WebSocketServer } from "ws";

export async function POST(req: NextRequest, res: NextResponse) {
  const ws = new WebSocketServer({
    port: 443,
  });

  console.log("WebSockets server is starting :)");

  ws.on("connection", (ws, req) => {
    ws.on("error", console.error);

    ws.on("message", (data) => {
      console.log("received: %s", data);
    });

    ws.send("Handshake :)");
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
