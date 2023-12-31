import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import "./ChatMessage.css";

export interface Message {
  sender: string;
  content: string;
  date: string | Date;
}
interface ChatMessageProps extends Message {}

const ChatMessage = (props: ChatMessageProps) => {
  const { sender, content, date } = props;
  const formattedTime = dayjs(date).format("hh:mm A");
  return (
    <Box className="flex gap-4 mt-6 max-w-full">
      <Box className="pt-4">
        <Image width={50} height={50} src="/user.png" alt="" />
      </Box>
      <Box>
        <Box className="flex gap-4 pt-4 pb-2 w-fit max-w-full items-center">
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {sender}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#9E9E9E",
              fontSize: "1rem",
            }}
          >
            {formattedTime}
          </Typography>
        </Box>
        <Box className="messageContent p-4 w-fit max-w-2xl">
          <Typography variant="body1" style={{ wordWrap: "break-word" }}>
            {content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;
