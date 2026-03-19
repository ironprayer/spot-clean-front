const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.spot-clean.example.com";

interface RequestOptions {
  method?: string;
  body?: unknown;
  guestId?: string;
}

async function request<T>(
  path: string,
  { method = "GET", body, guestId }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (guestId) {
    headers["X-Guest-Id"] = guestId;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, guestId?: string) =>
    request<T>(path, { guestId }),
  post: <T>(path: string, body: unknown, guestId?: string) =>
    request<T>(path, { method: "POST", body, guestId }),
  patch: <T>(path: string, body: unknown, guestId?: string) =>
    request<T>(path, { method: "PATCH", body, guestId }),
};
