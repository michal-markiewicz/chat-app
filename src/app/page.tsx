"use client";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Chat from "./components/chat/Chat";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/register");
    }
  }, [session.status]);

  return (
    <Box className="w-screen h-screen">
      <Chat />
    </Box>
  );
}
