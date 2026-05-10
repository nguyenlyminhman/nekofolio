import { endpoint as api } from "./endpoint";
import type { ChatHistoryResponse, Message } from "@/type/message";

export async function initCookies(): Promise<void> {
  await api.post("/cookies/init");
}

export async function getChatHistory(): Promise<Message[]> {
  const response = await api.get<ChatHistoryResponse>("/chat/history"); 
  return response.data.payload.data;
}
