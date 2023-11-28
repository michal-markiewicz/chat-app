import { Message } from "@/app/components/chatMessage/ChatMessage";
import {
  IChatService,
  ISaveMessageRequest,
  ISaveMessageResult,
} from "@/app/shared/contracts/IChatService";
import dayjs from "dayjs";
import { RowDataPacket } from "mysql2";
import DatabaseService from "./DatabaseService";

export default class ChatService implements IChatService {
  databaseService: DatabaseService;
  constructor() {
    this.databaseService = new DatabaseService();
  }
}
