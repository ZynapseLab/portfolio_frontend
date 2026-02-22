import type { NdjsonChunk, UsageInfo } from "../types/chat";

const API_BASE = import.meta.env.API_URL ?? "http://localhost:8000";
const MAX_MESSAGES_PER_DAY = import.meta.env.MAX_MESSAGES_PER_DAY ?? 10;

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onUsage: (usage: UsageInfo) => void;
  onError: (error: string) => void;
}

export async function sendMessage(
  message: string,
  scope: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message, scope }),
      signal,
    });

    if (response.status === 429) {
      callbacks.onError(
        "Has alcanzado el límite diario de mensajes. Vuelve mañana.",
      );
      return;
    }

    if (!response.ok) {
      callbacks.onError("Error al comunicarse con el servidor.");
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError("Streaming no disponible.");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const chunk: NdjsonChunk = JSON.parse(trimmed);
          if (chunk.type === "token") {
            callbacks.onToken(chunk.data);
          } else if (chunk.type === "done") {
            console.log("done");
            callbacks.onDone();
            break;
          }
        } catch {
          // Skip malformed lines
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") return;
    callbacks.onError("Error de conexión. Verifica tu red e intenta de nuevo.");
  }
}

export async function deleteConversation(scope: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/conversation`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ scope }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getUsageStats(scope: string): Promise<UsageInfo> {
  try {
    const response = await fetch(`${API_BASE}/chat/usage-stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ scope }),
    });

    const data = await response.json();

    return {
      used: parseInt(data.used, 10),
      limit: parseInt(data.limit, 10),
      resetAt: new Date(data.reset_at).toISOString(),
    };
  } catch (error) {
    return {
      used: MAX_MESSAGES_PER_DAY,
      limit: MAX_MESSAGES_PER_DAY,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}
