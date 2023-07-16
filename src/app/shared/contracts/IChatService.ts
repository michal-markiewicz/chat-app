import { Message } from "@/app/components/chatMessage/ChatMessage";
import { IErrorMessage } from "./Global";

export interface IChatService {
  saveMessage(request: ISaveMessageRequest): Promise<ISaveMessageResult>;
  fetchMessages(): Promise<Message[]>;
}

export interface ISaveMessageRequest extends Message {}
export interface ISaveMessageResult extends IErrorMessage {}
