export type RepoStatus = "active" | "hidden";

export type RepoSummary = {
  id: string;
  name: string;
  status: RepoStatus;
};

export type RepoDetail = RepoSummary & {
  description: string;
  techStack: string[];
  link: string;
  thumbnailUrl?: string;
};

export type RepoCreateInput = {
  name: string;
  description: string;
  techStack: string[];
  link: string;
  thumbnailUrl?: string;
  status: RepoStatus;
};

export type RepoUpdateInput = Partial<RepoCreateInput>;
