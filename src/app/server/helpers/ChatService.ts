import { Message } from "@/app/components/chatMessage/ChatMessage";
import {
    IChatService,
    IFetchMessagesResult,
    ISaveMessageRequest,
    ISaveMessageResult,
} from "@/app/shared/contracts/IChatService";
import { RowDataPacket } from "mysql2";
import DatabaseService from "./DatabaseService";
import "./server-only";

export default class ChatService implements IChatService {
  databaseService: DatabaseService;
  constructor() {
    this.databaseService = new DatabaseService();
  }
  async saveMessage(request: ISaveMessageRequest): Promise<ISaveMessageResult> {
    const { sender, content, date } = request;
    const dbConnection = await this.databaseService.connect();

    await dbConnection.execute(
      "INSERT INTO messages (sender, content, date) VALUES (?, ?, ?)",
      [sender, content, date]
    );

    await dbConnection.end();
    return { errorMsg: "" };
  }

  async fetchMessages(): Promise<IFetchMessagesResult> {
    const dbConnection = await this.databaseService.connect();
    let rows: RowDataPacket[] = [];

      const [result] = await dbConnection.execute<RowDataPacket[]>(
        "SELECT * FROM messages"
      );
      rows.push(...result);
      await dbConnection.end();
        return rows as Message[];
    }
  }
}
