export type Scope = "global" | string;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface UsageInfo {
  used: number;
  limit: number;
  resetAt: string;
}

export interface NdjsonTokenChunk {
  type: "token";
  data: string;
}

export interface NdjsonDoneChunk {
  type: "done";
}

export type NdjsonChunk = NdjsonTokenChunk | NdjsonDoneChunk;

export interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  usage: UsageInfo;
  error: string | null;
}
