import { endpoint as api } from "./endpoint";
import type { Message } from "@/type/message";

const STREAM_URL = "http://localhost:3001/api/v1/chat/stream";
const RETRY_DELAY_MS = 2000;

export async function initCookies(): Promise<void> {
  await api.post("/cookies/init");
}

export async function getChatHistory(): Promise<Message[]> {
  const response = await api.get<Message[]>("/chat/history");
  return response.data;
}

