// 인증 API 클라이언트
//
// 비밀번호 해싱(bcrypt)과 세션 발급(JWT, httpOnly 쿠키)은 백엔드(server/index.js)에서 실제로 처리한다.
// 이 파일은 그 API를 호출하는 얇은 클라이언트일 뿐이며, 비밀번호 원문은 HTTPS 요청 본문으로만 전송되고
// 해싱·토큰 서명·세션 저장은 전부 서버 책임이다 (브라우저는 httpOnly 쿠키라 값을 읽지도 못한다).
import type { User } from "../types";

export class AuthError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include", // 세션 쿠키를 요청에 포함시켜 서버가 로그인 상태를 식별할 수 있게 한다
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new AuthError(body?.message ?? "요청 처리 중 문제가 발생했습니다.");
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function signUp(params: { email: string; password: string; nickname: string }): Promise<User> {
  const { user } = await request<{ user: User }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return user;
}

export async function logIn(params: { email: string; password: string }): Promise<User> {
  const { user } = await request<{ user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return user;
}

export async function logOut(): Promise<void> {
  await request<void>("/auth/logout", { method: "POST" });
}

/** 서버에 세션 쿠키 유효성을 물어 로그인 상태를 확인한다 (비로그인/만료 시 null) */
export async function getSessionUser(): Promise<User | null> {
  try {
    const { user } = await request<{ user: User }>("/auth/me");
    return user;
  } catch {
    return null;
  }
}

export async function updateNickname(nickname: string): Promise<User> {
  const { user } = await request<{ user: User }>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ nickname }),
  });
  return user;
}
