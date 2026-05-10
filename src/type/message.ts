export type Message = {
  id: string;
  role: "hr" | "bot";
  content: string;
};


export type ChatHistoryResponse = {
  statusCode: number;
  message: string;
  payload: {
    data: Message[];
  };
};