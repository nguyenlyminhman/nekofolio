import { isAxiosError } from "axios";

import { endpoint } from "@/services/endpoint";
import type { AuthUser, LoginRequest, LoginResult, LoginSuccessResponse } from "@/types/auth";

function sanitizeUser(raw: AuthUser & { password?: string }): AuthUser {
  return {
    id: raw.id,
    nickname: raw.nickname,
    email: raw.email,
    fullname: raw.fullname,
    created_at: raw.created_at ?? null,
    created_by: raw.created_by ?? null,
    updated_at: raw.updated_at ?? null,
    updated_by: raw.updated_by ?? null,
  };
}

function parseLoginSuccess(data: unknown): LoginResult {
  if (!data || typeof data !== "object") {
    throw new Error("Phản hồi đăng nhập không hợp lệ");
  }
  const body = data as LoginSuccessResponse;
  const inner = body.payload?.data;
  if (!inner || typeof inner.accessToken !== "string" || !inner.user || typeof inner.user !== "object") {
    throw new Error("Phản hồi đăng nhập không hợp lệ");
  }
  return {
    accessToken: inner.accessToken,
    user: sanitizeUser(inner.user as AuthUser & { password?: string }),
  };
}

function parseLoginErrorMessage(data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) {
      return m;
    }
  }
  return "Đăng nhập thất bại";
}

/**
 * POST /auth/login — payload `{ username, password }`.
 * Thành công: `payload.data.accessToken` + `payload.data.user`.
 */
export async function login(payload: LoginRequest): Promise<LoginResult> {
  try {
    const { data } = await endpoint.post<unknown>("/auth/login", {
      username: payload.username.trim(),
      password: payload.password,
    });
    return parseLoginSuccess(data);
  } catch (e) {
    if (isAxiosError(e) && e.response?.data !== undefined) {
      throw new Error(parseLoginErrorMessage(e.response.data));
    }
    throw e instanceof Error ? e : new Error("Đăng nhập thất bại");
  }
}
