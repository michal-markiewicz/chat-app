import { Message } from "@/app/components/chatMessage/ChatMessage";
import mysql2 from "mysql2/promise";
import ChatService from "../helpers/ChatService";
import DatabaseService from "../helpers/DatabaseService";
const chatService = new ChatService();
const databaseService = new DatabaseService();

let connection: mysql2.Connection;

beforeAll(async () => {
  connection = await databaseService.connect();
  await connection.query(`
  INSERT INTO messages (sender, content, date) VALUES ('John Cooper', 'test', '2021-01-11 11:11:11');
  `);
});

describe("ChatService", () => {
  test("should save message", async () => {
    const message: Message = {
      content: "Hi",
      sender: "Adam Sandler",
      date: new Date(),
    };
    await chatService.saveMessage(message);
    const messages = await chatService.fetchMessages();
    const filteredMessages = messages.filter((message: Message) => {
      if (message.content === "Hi") {
        return message;
      }
    });
    expect(filteredMessages[0]).toBeDefined();
  });
  test("should fetch test message", async () => {
    const messages = await chatService.fetchMessages();
    const filteredMessages = messages.filter((message: Message) => {
      if (message.content === "test") {
        return message;
      }
    });
    expect(filteredMessages[0]).toBeDefined();
  });
});

afterAll(async () => {
  await connection.query(`DELETE FROM messages`);
  await connection.end();
});
