// 인증 상태를 앱 전역에서 공유하기 위한 컨텍스트
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as authApi from "../lib/auth";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  /** 앱 최초 로드 시 서버에 세션 쿠키 유효성을 확인하는 동안 true */
  isAuthLoading: boolean;
  signUp: (params: { email: string; password: string; nickname: string }) => Promise<void>;
  logIn: (params: { email: string; password: string }) => Promise<void>;
  logOut: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 앱 최초 로드 시 httpOnly 세션 쿠키가 유효한지 서버에 물어 로그인 상태를 복원한다.
  useEffect(() => {
    authApi
      .getSessionUser()
      .then(setUser)
      .finally(() => setIsAuthLoading(false));
  }, []);

  const signUp = useCallback(async (params: { email: string; password: string; nickname: string }) => {
    const created = await authApi.signUp(params);
    setUser(created);
  }, []);

  const logIn = useCallback(async (params: { email: string; password: string }) => {
    const found = await authApi.logIn(params);
    setUser(found);
  }, []);

  const logOut = useCallback(async () => {
    await authApi.logOut();
    setUser(null);
  }, []);

  const updateNickname = useCallback(async (nickname: string) => {
    const updated = await authApi.updateNickname(nickname);
    setUser(updated);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthLoading, signUp, logIn, logOut, updateNickname }),
    [user, isAuthLoading, signUp, logIn, logOut, updateNickname],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
