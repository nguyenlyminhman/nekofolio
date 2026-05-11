import { unwrapApiList } from "@/lib/unwrap-api-list";
import { unwrapPayloadData } from "@/lib/unwrap-payload-data";
import { endpoint } from "@/services/endpoint";
import type { RepoCmsCreatePayload, RepoCmsRecord, RepoCmsUpdatePayload } from "@/types/repo";

function normalizeRepoRecord(raw: Record<string, unknown>): RepoCmsRecord {
  const tech =
    Array.isArray(raw.tech_stack) ? (raw.tech_stack as string[])
    : Array.isArray(raw.techStack) ? (raw.techStack as string[])
    : [];
  const active = raw.is_active ?? raw.isActive;
  return {
    id: String(raw.id ?? ""),
    repoName: String(raw.repo_name ?? raw.repoName ?? ""),
    description: String(raw.description ?? ""),
    highlights: String(raw.highlights ?? ""),
    markdown: String(raw.markdown ?? ""),
    githubUrl: String(raw.github_url ?? raw.githubUrl ?? ""),
    liveUrl: String(raw.live_url ?? raw.liveUrl ?? ""),
    techStack: tech.map(String),
    sortOrder: Number(raw.sort_order ?? raw.sortOrder ?? 0),
    created_at: (raw.created_at as string | null) ?? null,
    updated_at: (raw.updated_at as string | null) ?? null,
    created_by: (raw.created_by as string | null) ?? null,
    updated_by: (raw.updated_by as string | null) ?? null,
    is_active: active === true || active === "true" || active === 1,
  };
}

function toWriteBody(p: RepoCmsCreatePayload) {
  return {
    repoName: p.repoName.trim(),
    highlights: p.highlights.trim(),
    description: p.description.trim(),
    markdown: p.markdown,
    githubUrl: p.githubUrl.trim(),
    liveUrl: p.liveUrl.trim(),
    techStack: p.techStack,
    sortOrder: Number.isFinite(p.sortOrder) ? p.sortOrder : 0,
    isActive: Boolean(p.isActive),
  };
}

async function parseRepoMutationResponse(data: unknown, refetchId?: string): Promise<RepoCmsRecord> {
  const inner = unwrapPayloadData<Record<string, unknown>>(data);
  if (inner && inner.id) {
    return normalizeRepoRecord(inner);
  }
  if (refetchId) {
    const list = await fetchReposCms();
    const found = list.find((r) => r.id === refetchId);
    if (found) {
      return found;
    }
  }
  throw new Error("Phản hồi API repo không hợp lệ");
}

/**
 * GET /cms/repo/fetch — `payload.data` là mảng.
 */
export async function fetchReposCms(): Promise<RepoCmsRecord[]> {
  const { data } = await endpoint.get<unknown>("/cms/repo/fetch");
  const rows = unwrapApiList<Record<string, unknown>>(data);
  return rows.map(normalizeRepoRecord);
}

/**
 * POST /cms/repo/create — chỉ tạo mới (body không gửi `id`).
 */
export async function createRepoCms(payload: RepoCmsCreatePayload): Promise<RepoCmsRecord> {
  const body = toWriteBody(payload);
  const { data } = await endpoint.post<unknown>("/cms/repo/create", body);
  return parseRepoMutationResponse(data);
}

/**
 * POST /cms/repo/update — cập nhật theo `id` (tách khỏi create để backend không nhầm thành tạo mới).
 */
export async function updateRepoCms(payload: RepoCmsUpdatePayload): Promise<RepoCmsRecord> {
  const { data } = await endpoint.post<unknown>("/cms/repo/update", {
    id: payload.id,
    ...toWriteBody(payload),
  });
  return parseRepoMutationResponse(data, payload.id);
}
