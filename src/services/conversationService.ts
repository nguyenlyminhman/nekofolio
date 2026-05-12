import { unwrapApiList } from "@/lib/unwrap-api-list";
import { endpoint } from "@/services/endpoint";
import type {
  ConversationMessageRow,
  ConversationUserAgentUpdatePayload,
  ConversationVisitorRow,
} from "@/types/conversation";

/**
 * GET /cms/conv/fetch — payload.data là mảng visitor + nested conversation.
 */
export async function fetchConversationList(): Promise<ConversationVisitorRow[]> {
  const { data } = await endpoint.get<unknown>("/cms/conv/fetch");
  return unwrapApiList<ConversationVisitorRow>(data);
}

/**
 * GET /cms/conv/content?id=<conversation.id>
 */
export async function fetchConversationMessages(conversationId: string): Promise<ConversationMessageRow[]> {
  const { data } = await endpoint.get<unknown>("/cms/conv/content", {
    params: { id: conversationId },
  });
  return unwrapApiList<ConversationMessageRow>(data);
}

/**
 * POST /cms/conv/comment — JSON body `{ id, comment }`.
 * `id`: id của conversation (cùng giá trị `conversation.id` trong fetch list).
 */
export async function updateConversationComment(conversationId: string, comment: string): Promise<void> {
  await endpoint.post("/cms/conv/comment", {
    id: conversationId,
    comment,
  });
}

/**
 * POST /cms/conv/user-agent — cập nhật `user_agent` và `is_interesting` cho bản ghi visitor.
 * Body: `{ id, userAgent, isInteresting }` (`id` = visitor row id trong fetch list).
 */
export async function updateConversationUserAgent(payload: ConversationUserAgentUpdatePayload): Promise<void> {
  await endpoint.post("/cms/conv/user-agent", {
    id: payload.id,
    userAgent: payload.userAgent,
    isInteresting: payload.isInteresting,
  });
}
