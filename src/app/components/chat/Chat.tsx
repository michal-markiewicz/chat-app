import ChatService from "@/app/client/ChatService";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChatMessage, { Message } from "../chatMessage/ChatMessage";
import "./Chat.css";

const Chat = () => {
  const chatService = new ChatService();
  const session = useSession();
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

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

  useEffect(() => {
    if (session.data?.user?.name) {
      const initializeWebSocketConnection = async () => {
        const isServerRunning = await isWebSocketServerRunning();
        if (!isServerRunning) {
          await startWebSocketServer();
        }
        connectToWebSocketServer();
      };

      initializeWebSocketConnection();
    }
  }, [session.data?.user?.name]);

  useEffect(() => {
    chatService.fetchMessages().then((messages) => {
      setMessages(messages);
    });
  }, []);

  const handleEnterKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      sendChatMessage();
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleEnterKeyUp);
    return () => {
      window.removeEventListener("keyup", handleEnterKeyUp);
    };
  }, [messageContent]);

  async function startWebSocketServer() {
    await axios.post("/api/socket");
  }

  function connectToWebSocketServer() {
    const ws = new WebSocket(
      process.env.NODE_ENV === "development"
        ? "ws://localhost:443"
        : `wss://${window.location.hostname}`
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

  function isWebSocketServerRunning(): Promise<boolean> {
    return new Promise((resolve) => {
      const ws = new WebSocket(
        process.env.NODE_ENV === "development"
          ? "ws://localhost:443"
          : `wss://${window.location.hostname}`
      );

      ws.onopen = () => {
        resolve(true);
        ws.close();
      };

      ws.onerror = () => {
        resolve(false);
      };
    });
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
