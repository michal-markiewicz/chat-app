import ChatService from "@/app/client/ChatService";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, TextField } from "@mui/material";
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
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const initializeWebSocketConnection = async () => {
      const isServerRunning = await isWebSocketServerRunning();
      if (!isServerRunning) {
        await startWebSocketServer();
      }
      connectToWebSocketServer();
    };

    initializeWebSocketConnection();
  }, []);

  useEffect(() => {
    chatService.fetchMessages().then((messages) => {
      setMessages(messages);
    });
  }, []);

  async function startWebSocketServer() {
    await axios.post("/api/socket");
  }

  function connectToWebSocketServer() {
    const ws = new WebSocket("ws://localhost:443");

    ws.onopen = (event) => {
      console.log("onopen", event);
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };

    ws.onerror = (event) => {
      console.log("onerror", event);
    };

    setWs(ws);
  }

  function isWebSocketServerRunning(): Promise<boolean> {
    return new Promise((resolve) => {
      const ws = new WebSocket("ws://localhost:443");

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
      <Box className="w-11/12 h-full">
        {messages.map((message) => {
          return <ChatMessage {...message} />;
        })}
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
                  icon={faPaperPlane}
                  onClick={async () => {
                    if (messageContent) {
                      const newMessage = {
                        sender: session.data?.user?.name as string,
                        content: messageContent,
                        date: new Date(),
                      };

                      ws?.send(JSON.stringify(newMessage));
                    }
                  }}
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
