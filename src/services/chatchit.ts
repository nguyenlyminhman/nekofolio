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

export function createChatStream(
  onMessage: (msg: Message) => void,
): EventSource {
  let activeSource: EventSource | null = null;
  let closeActiveSource: (() => void) | null = null;
  let manuallyClosed = false;

  const connect = (): EventSource => {
    const source = new EventSource(STREAM_URL, { withCredentials: true });
    closeActiveSource = source.close.bind(source);

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as Message;
        onMessage(parsed);
      } catch (error) {
        console.error("Unable to parse SSE message", error);
      }
    };

    source.onerror = () => {
      source.close();

      if (manuallyClosed || source.readyState === EventSource.CLOSED) {
        return;
      }

      window.setTimeout(() => {
        if (!manuallyClosed) {
          activeSource = connect();
        }
      }, RETRY_DELAY_MS);
    };

    return source;
  };

  activeSource = connect();
  const initialSource = activeSource;
  const originalClose = initialSource.close.bind(initialSource);

  initialSource.close = () => {
    manuallyClosed = true;
    closeActiveSource?.();
    if (activeSource !== initialSource) {
      originalClose();
    }
  };

  return initialSource;
}