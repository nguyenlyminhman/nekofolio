import { unwrapPayloadData } from "@/lib/unwrap-payload-data";
import { endpoint } from "@/services/endpoint";
import type { CvCmsCreatePayload, CvCmsRecord, CvCmsUpdatePayload } from "@/types/cv";

function normalizeCvContent(raw: unknown): Record<string, unknown> {
  if (raw === null || raw === undefined) {
    return {};
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return {};
}

function normalizeCvCmsRecord(raw: Record<string, unknown>): CvCmsRecord {
  const contentRaw = raw.cv_content ?? raw.content;
  const activeRaw = raw.is_active ?? raw.status;
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    cv_content: normalizeCvContent(contentRaw),
    created_at: (raw.created_at as string | null) ?? null,
    created_by: (raw.created_by as string | null) ?? null,
    updated_at: (raw.updated_at as string | null) ?? null,
    updated_by: (raw.updated_by as string | null) ?? null,
    is_active: activeRaw === true || activeRaw === "true" || activeRaw === 1,
  };
}

async function parseCvMutationResponse(data: unknown): Promise<CvCmsRecord> {
  const inner = unwrapPayloadData<Record<string, unknown>>(data);
  if (inner && inner.id) {
    return normalizeCvCmsRecord(inner);
  }
  const refetched = await fetchCvCms();
  if (refetched) {
    return refetched;
  }
  throw new Error("Phản hồi API CV không hợp lệ");
}

/**
 * GET /cms/cv/fetch — Bearer từ `endpoint` interceptor.
 */
export async function fetchCvCms(): Promise<CvCmsRecord | null> {
  const { data } = await endpoint.get<unknown>("/cms/cv/fetch");
  const inner = unwrapPayloadData<Record<string, unknown>>(data);
  if (!inner || !inner.id) {
    return null;
  }
  return normalizeCvCmsRecord(inner);
}

/**
 * POST /cms/cv/create — body `{ name, content }`.
 */
export async function createCvCms(payload: CvCmsCreatePayload): Promise<CvCmsRecord> {
  const { data } = await endpoint.post<unknown>("/cms/cv/create", {
    name: payload.name.trim(),
    content: payload.content,
  });
  return parseCvMutationResponse(data);
}

/**
 * POST /cms/cv/update — body `{ id, name, content, status }`.
 */
export async function updateCvCms(payload: CvCmsUpdatePayload): Promise<CvCmsRecord> {
  const { data } = await endpoint.post<unknown>("/cms/cv/update", {
    id: payload.id,
    name: payload.name.trim(),
    content: payload.content,
    status: payload.status,
  });
  return parseCvMutationResponse(data);
}
