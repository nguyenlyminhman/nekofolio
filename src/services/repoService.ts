import { unwrapApiList } from "@/lib/unwrap-api-list";
import { endpoint } from "@/services/endpoint";
import type { RepoCreateInput, RepoDetail, RepoSummary, RepoUpdateInput } from "@/types/repo";

export async function listRepos(): Promise<RepoSummary[]> {
  const { data } = await endpoint.get<unknown>("/admin/repos");
  return unwrapApiList<RepoSummary>(data);
}

export async function getRepo(id: string): Promise<RepoDetail> {
  const { data } = await endpoint.get<RepoDetail>(`/admin/repos/${id}`);
  return data;
}

export async function createRepo(input: RepoCreateInput): Promise<RepoDetail> {
  const { data } = await endpoint.post<RepoDetail>("/admin/repos", input);
  return data;
}

export async function updateRepo(id: string, input: RepoUpdateInput): Promise<RepoDetail> {
  const { data } = await endpoint.patch<RepoDetail>(`/admin/repos/${id}`, input);
  return data;
}

export async function deleteRepo(id: string): Promise<void> {
  await endpoint.delete(`/admin/repos/${id}`);
}
