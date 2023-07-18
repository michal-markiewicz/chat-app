import ChatService from "@/app/server/helpers/ChatService";
import { NextRequest, NextResponse } from "next/server";
const chatService = new ChatService();

export async function POST(req: NextRequest, res: NextResponse) {
  let message;
  try {
    message = await req.json();
  } catch {
    return NextResponse.json(
      {},
      {
        status: 400,
      }
    );
  }

  const saveMessageResult = await chatService.saveMessage(message);
  return NextResponse.json(
    {
      errorMsg: saveMessageResult.errorMsg,
    },
    {
      status: 200,
    }
  );
}

export async function GET(req: NextRequest, res: NextResponse) {
  const messages = await chatService.fetchMessages();
  return NextResponse.json(messages, {
    status: 200,
  });
}
