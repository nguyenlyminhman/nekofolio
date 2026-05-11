import { unwrapApiList } from "@/lib/unwrap-api-list";
import { endpoint } from "@/services/endpoint";
import type { CVCreateInput, CVDetail, CVSummary, CVUpdateInput } from "@/types/cv";

export async function listCVs(): Promise<CVSummary[]> {
  const { data } = await endpoint.get<unknown>("/admin/cvs");
  return unwrapApiList<CVSummary>(data);
}

export async function getCV(id: string): Promise<CVDetail> {
  const { data } = await endpoint.get<CVDetail>(`/admin/cvs/${id}`);
  return data;
}

export async function createCV(input: CVCreateInput): Promise<CVDetail> {
  if (input.file) {
    const form = new FormData();
    form.append("title", input.title);
    form.append("file", input.file);
    const { data } = await endpoint.post<CVDetail>("/admin/cvs", form);
    return data;
  }

  const { data } = await endpoint.post<CVDetail>("/admin/cvs", {
    title: input.title,
    sourceUrl: input.sourceUrl,
  });
  return data;
}

export async function updateCV(id: string, input: CVUpdateInput): Promise<CVDetail> {
  if (input.file) {
    const form = new FormData();
    if (input.title != null) {
      form.append("title", input.title);
    }
    if (input.sourceUrl != null) {
      form.append("sourceUrl", input.sourceUrl);
    }
    form.append("file", input.file);
    const { data } = await endpoint.patch<CVDetail>(`/admin/cvs/${id}`, form);
    return data;
  }

  const { data } = await endpoint.patch<CVDetail>(`/admin/cvs/${id}`, {
    title: input.title,
    sourceUrl: input.sourceUrl,
  });
  return data;
}

export async function publishCV(id: string): Promise<void> {
  await endpoint.post(`/admin/cvs/${id}/publish`);
}
