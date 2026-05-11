/** User trả về từ POST /auth/login (không lưu password xuống storage). */
export type AuthUser = {
  id: string;
  nickname: string;
  email: string;
  fullname: string;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
};

export type LoginRequest = {
  username: string;
  password: string;
};

/** Body JSON khi login thành công (HTTP 2xx). */
export type LoginSuccessResponse = {
  statusCode: number;
  message: string;
  payload: {
    data: {
      accessToken: string;
      user: AuthUser & { password?: string };
    };
  };
};

/** Body JSON khi login thất bại (ví dụ HTTP 400). */
export type LoginErrorResponse = {
  statusCode: number;
  message: string;
};

export type LoginResult = {
  accessToken: string;
  user: AuthUser;
};
