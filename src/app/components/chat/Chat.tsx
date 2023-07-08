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
  const [webSocketServerRunning, setWebSocketServerRunning] = useState(false);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  // This code is obviously trash, but it's just for testing purposes
  useEffect(() => {
    if (!webSocketServerRunning) {
      const result = axios.post("/api/socket").then(() => {
        console.log("serwer chyba odpalony");
        setWebSocketServerRunning(true);
      });
    } else {
      const socket = new WebSocket("ws://localhost:443");
      setWebSocket(socket);
    }
  }, [webSocketServerRunning]);

  console.log("webSocket", webSocket);

  if (webSocket) {
    webSocket.onopen = function (event) {
      console.log("onopen", event);
    };
    webSocket.onmessage = function (event) {
      console.log("onmessage", event);
    };
    webSocket.onerror = function (event) {
      console.log("onerror", event);
    };
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
