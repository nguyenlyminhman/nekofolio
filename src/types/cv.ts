export type CVSummary = {
  id: string;
  title: string;
  fileName?: string;
  sourceUrl?: string;
  updatedAt: string;
  published?: boolean;
};

export type CVDetail = CVSummary & {
  content?: string;
  mimeType?: string;
};

export type CVCreateInput = {
  title: string;
  file?: File | null;
  sourceUrl?: string;
};

export type CVUpdateInput = {
  title?: string;
  sourceUrl?: string;
  file?: File | null;
};
