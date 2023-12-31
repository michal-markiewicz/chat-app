import UserService from "@/app/server/helpers/UserService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.body) {
    const user = await req.json();
    const userService = new UserService();
    const registrationResult = await userService.register(user);

    return NextResponse.json(
      {
        errorMsg: registrationResult.errorMsg,
      },
      {
        status: 200,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  if (req.body) {
    const user = await req.json();
    const userService = new UserService();
    const getUserResult = await userService.getUser(user);

    return NextResponse.json(
      {
        ...getUserResult,
      },
      {
        status: 200,
      }
    );
  }
}
