import axios from "axios";
import { Message } from "../components/chatMessage/ChatMessage";
import {
  IChatService,
  ISaveMessageRequest,
  ISaveMessageResult,
} from "../shared/contracts/IChatService";

class ChatService implements IChatService {
  async saveMessage(request: ISaveMessageRequest): Promise<ISaveMessageResult> {
    const result = await axios.post("/api/chat", request);
    return result.data;
  }
  async fetchMessages(): Promise<Message[]> {
    const result = await axios.get("/api/chat");
    return result.data;
  }
}

export default ChatService;
