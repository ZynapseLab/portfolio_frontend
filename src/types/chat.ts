import { onPageLoad } from "astro/virtual-modules/transitions-events.js";

export type Scope = "global" | string;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ConversationHistory {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
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

export interface NdjsonUsageChunk {
  type: "usage";
  data: {
    used: number;
    limit: number;
    reset_at: string;
  };
}

export type NdjsonChunk = NdjsonTokenChunk | NdjsonDoneChunk | NdjsonUsageChunk;

export interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  usage: UsageInfo;
  error: string | null;
}
