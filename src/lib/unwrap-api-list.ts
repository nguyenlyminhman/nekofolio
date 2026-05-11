/** Chuẩn hóa list từ API (mảng thuần hoặc envelope phổ biến). */
export function unwrapApiList<T>(body: unknown): T[] {
  if (Array.isArray(body)) {
    return body as T[];
  }
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if (Array.isArray(o.items)) {
      return o.items as T[];
    }
    if (o.payload && typeof o.payload === "object") {
      const p = o.payload as Record<string, unknown>;
      if (Array.isArray(p.data)) {
        return p.data as T[];
      }
    }
    if (Array.isArray(o.data)) {
      return o.data as T[];
    }
  }
  return [];
}
