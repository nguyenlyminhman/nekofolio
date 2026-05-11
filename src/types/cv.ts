/** Bản ghi CV từ CMS (`GET /cms/cv/fetch`). `cv_content` là JSON trong DB (map với field `content` khi gọi create/update). */
export type CvCmsRecord = {
  id: string;
  name: string;
  cv_content: Record<string, unknown>;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  is_active: boolean;
};

/** POST /cms/cv/create */
export type CvCmsCreatePayload = {
  name: string;
  content: Record<string, unknown>;
};

/** POST /cms/cv/update */
export type CvCmsUpdatePayload = {
  id: string;
  name: string;
  content: Record<string, unknown>;
  status: boolean;
};

/** @deprecated Giữ tạm cho repo cũ. */
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
