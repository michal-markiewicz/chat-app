"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/register");
  }, []);

  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
}
