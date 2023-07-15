import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, TextField } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChatMessage, { Message } from "../chatMessage/ChatMessage";
import "./Chat.css";

const Chat = () => {
  const session = useSession();
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  async function startWebSocketServer() {
    await axios.post("/api/socket");
  }

  function connectToWebSocketServer() {
    const ws = new WebSocket("ws://localhost:443");

    ws.onopen = (event) => {
      console.log("onopen", event);
    };
    ws.onmessage = (event) => {
      console.log("onmessage", event);
    };
    ws.onerror = (event) => {
      console.log("onerror", event);
    };

    setWebSocket(ws);
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
                  onClick={() => {
                    if (messageContent) {
                      const newMessage = {
                        sender: "John Doe",
                        content: messageContent,
                        time: new Date(),
                      };
                      setMessages((prev) => [...prev, newMessage]);
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
