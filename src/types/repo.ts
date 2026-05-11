/** Bản ghi repo từ `GET /cms/repo/fetch` (chuẩn hóa snake_case → camelCase trong UI). */
export type RepoCmsRecord = {
  id: string;
  repoName: string;
  description: string;
  highlights: string;
  markdown: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string[];
  sortOrder: number;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  is_active: boolean;
};

/** Body POST create (không có `id`). */
export type RepoCmsCreatePayload = {
  repoName: string;
  highlights: string;
  description: string;
  markdown: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string[];
  sortOrder: number;
  /** Gửi kèm create/update nếu backend hỗ trợ (form chỉnh sửa có Switch). */
  isActive: boolean;
};

/** Body POST update (cùng endpoint create, thêm `id`). */
export type RepoCmsUpdatePayload = RepoCmsCreatePayload & {
  id: string;
};

/** Form dialog (không có id). */
export type RepoCmsFormValues = RepoCmsCreatePayload;
