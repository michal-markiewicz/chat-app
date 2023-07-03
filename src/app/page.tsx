"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  if (true) {
    router.push("/register");
  }

  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
}
