/** Lấy `payload.data` từ envelope API (một object hoặc null). */
export function unwrapPayloadData<T>(body: unknown): T | null {
  if (!body || typeof body !== "object") {
    return null;
  }
  const o = body as Record<string, unknown>;
  if (o.payload && typeof o.payload === "object") {
    const p = o.payload as Record<string, unknown>;
    const d = p.data;
    if (d === null || d === undefined) {
      return null;
    }
    return d as T;
  }
  if ("data" in o && o.data !== undefined && o.data !== null) {
    return o.data as T;
  }
  return null;
}
