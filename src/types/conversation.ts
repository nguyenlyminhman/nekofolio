export type ConversationSession = {
  id: string;
  session_id: string;
  started_at: string | null;
  last_message_at: string | null;
  message_count: number;
  token_count: number;
  comment: string | null;
};

export type ConversationVisitorRow = {
  id: string;
  cookie_token: string;
  ip_address: string | null;
  user_agent: string | null;
  company_hint: string | null;
  is_interesting: boolean | null;
  first_seen_at: string | null;
  last_seen_at: string | null;
  conversation: ConversationSession;
};

export type ConversationMessageRow = {
  id: string;
  conversation_id: string;
  role: "hr" | "bot" | string;
  content: string;
  created_at: string | null;
  used_token: number;
};

/** POST /cms/conv/user-agent — `id` là id bản ghi visitor (hàng trong fetch list), không phải conversation.id. */
export type ConversationUserAgentUpdatePayload = {
  id: string;
  userAgent: string;
  isInteresting: boolean;
};
