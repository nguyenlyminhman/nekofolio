import { endpoint as api } from "./endpoint";
import type { Message } from "@/type/message";

export async function initCookies(): Promise<void> {
  await api.post("/cookies/init");
}

export async function getChatHistory(): Promise<Message[]> {
  const response = await api.get<Message[]>("/chat/history");
  return response.data;
}

