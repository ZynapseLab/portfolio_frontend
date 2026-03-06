const API_BASE = import.meta.env.PUBLIC_APP_API_URL ?? "http://localhost:8000";

export interface ContactPayload {
  name: string;
  email: string;
  country: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  ok: boolean;
  error?: string;
}

export async function sendContactEmail(
  payload: ContactPayload,
): Promise<ContactResponse> {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return { ok: false, error: data?.detail ?? "Error al enviar el mensaje." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Error de conexion. Verifica tu red e intenta de nuevo." };
  }
}
