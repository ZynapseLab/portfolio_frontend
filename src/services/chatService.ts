import type { NdjsonChunk, UsageInfo } from "../types/chat";

const API_BASE = import.meta.env.PUBLIC_API_URL ?? "http://localhost:8000";

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
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message, scope }),
      signal,
    });

    const used = parseInt(response.headers.get("X-Messages-Used") ?? "0", 10);
    const limit = parseInt(response.headers.get("X-Messages-Limit") ?? "10", 10);
    const resetAt = response.headers.get("X-Reset-At") ?? "";

    callbacks.onUsage({ used, limit, resetAt });

    if (response.status === 429) {
      callbacks.onError("Has alcanzado el límite diario de mensajes. Vuelve mañana.");
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
            callbacks.onDone();
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
