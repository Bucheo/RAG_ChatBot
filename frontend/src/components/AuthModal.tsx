// 로그인/회원가입 모달 — iLovePDF 상단의 "로그인 / 가입하기" 버튼과 짝을 이루는 모달 폼
import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { AuthError } from "../lib/auth";

export type AuthMode = "login" | "signup";

interface AuthModalProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ mode, onModeChange, onClose, onSuccess }: AuthModalProps) {
  const { logIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (isSignup) {
        await signUp({ email, password, nickname });
      } else {
        await logIn({ email, password });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "처리 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-1 rounded-full bg-ink-50 p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => onModeChange("login")}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                !isSignup ? "bg-white text-brand-500 shadow-sm" : "text-ink-500"
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => onModeChange("signup")}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                isSignup ? "bg-white text-brand-500 shadow-sm" : "text-ink-500"
              }`}
            >
              가입하기
            </button>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup && (
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-600">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                autoComplete="off"
                className="w-full rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
                placeholder="사용하실 닉네임"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-600">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete={isSignup ? "off" : "email"}
              className="w-full rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-600">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="w-full rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
              placeholder="6자 이상"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            {isSubmitting ? "처리 중..." : isSignup ? "가입하기" : "로그인"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-400">
          {isSignup ? "이미 계정이 있으신가요? " : "아직 계정이 없으신가요? "}
          <button
            type="button"
            onClick={() => onModeChange(isSignup ? "login" : "signup")}
            className="font-semibold text-brand-500 hover:underline"
          >
            {isSignup ? "로그인" : "가입하기"}
          </button>
        </p>
      </div>
    </div>
  );
}
