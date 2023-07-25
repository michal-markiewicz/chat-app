import ChatService from "@/app/client/ChatService";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChatMessage, { Message } from "../chatMessage/ChatMessage";
import "./Chat.css";
import { useRouter } from "next/navigation";

const Chat = () => {
  const router = useRouter();
  const chatService = new ChatService();
  const session = useSession();
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const username = session.data?.user?.name;

    if (!username && session.status !== "loading") {
      router.push("/register");
    }
  }, [session.status]);

  useEffect(() => {
    if (session.data?.user?.name) {
      connectToWebSocketServer();
    }
  }, [session.data?.user?.name]);

  useEffect(() => {
    chatService.fetchMessages().then((messages) => {
      setMessages(messages);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", handleEnterKeyUp);
    return () => {
      window.removeEventListener("keyup", handleEnterKeyUp);
    };
  }, [messageContent]);

  const handleEnterKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      sendChatMessage();
    }
  };

  function sendChatMessage() {
    if (messageContent) {
      const newMessage = {
        sender: session.data?.user?.name as string,
        content: messageContent,
        date: new Date(),
        type: "message",
      };

      setMessageContent("");
      const newMessageJson = JSON.stringify(newMessage);
      ws?.send(newMessageJson);
    }
  }

  function connectToWebSocketServer() {
    const ws = new WebSocket(
      process.env.NODE_ENV === "production"
        ? `wss://${window.location.host}`
        : "ws://localhost:3000"
    );

    ws.onopen = (event) => {
      const user = {
        username: session.data?.user?.name,
        type: "user-connected",
      };

      const userJson = JSON.stringify(user);
      ws.send(userJson);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "message":
          delete data.type;
          setMessages((prev) => [...prev, data]);
          break;
        case "users":
          setUsers(data.users);
          break;
      }
    };

    ws.onerror = (event) => {
      console.log("onerror", event);
    };

    setWs(ws);
  }

  return (
    <Box className="chat-container flex w-full h-full flex-col items-center">
      <Box className="chat-messages w-11/12 h-full pb-4">
        {messages.map((message) => {
          return <ChatMessage {...message} />;
        })}
      </Box>
      <Box className="flex w-full justify-center pt-2 pb-2">
        <Typography className="w-11/12">
          Online ({users.length}):{" "}
          {users.map((user, index) => {
            return (
              <>
                {user}
                {index < users.length - 1 ? ", " : ""}
              </>
            );
          })}
        </Typography>
      </Box>
      <Box className="message-input-container flex items-center justify-center h-20 w-full pb-4">
        <TextField
          label={"Message to Channel 1"}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          variant="outlined"
          className="w-11/12 bg-white"
          InputProps={{
            endAdornment: (
              <>
                <FontAwesomeIcon
                  className="send-message-icon"
                  icon={faPaperPlane}
                  onClick={() => sendChatMessage()}
                />
              </>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default Chat;
