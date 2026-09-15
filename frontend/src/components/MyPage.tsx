// 마이페이지 — 계정 정보 확인/닉네임 수정, 현재 세션의 이용 현황을 보여준다
import { useState } from "react";
import { ArrowLeft, FileText, LogOut, MessagesSquare, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types";

interface MyPageProps {
  user: User;
  documentCount: number;
  messageCount: number;
  onBack: () => void;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export function MyPage({ user, documentCount, messageCount, onBack }: MyPageProps) {
  const { logOut, updateNickname } = useAuth();
  const [nickname, setNickname] = useState(user.nickname);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (nickname.trim()) await updateNickname(nickname);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-500"
      >
        <ArrowLeft size={16} /> 홈으로
      </button>

      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <UserIcon size={28} />
          </span>
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="w-full max-w-[200px] rounded-lg border border-ink-200 px-2.5 py-1 text-base font-semibold outline-none focus:border-brand-400"
                />
                <button
                  onClick={handleSave}
                  className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-600"
                >
                  저장
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold text-ink-900">{user.nickname}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-medium text-ink-400 underline-offset-2 hover:text-brand-500 hover:underline"
                >
                  닉네임 수정
                </button>
              </div>
            )}
            <p className="mt-0.5 truncate text-sm text-ink-500">{user.email}</p>
            <p className="mt-0.5 text-xs text-ink-400">{formatDate(user.createdAt)} 가입</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-ink-50 p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-500 shadow-sm">
              <FileText size={16} />
            </span>
            <p className="mt-3 text-2xl font-bold text-ink-900">{documentCount}</p>
            <p className="text-xs text-ink-500">현재 세션 업로드 문서</p>
          </div>
          <div className="rounded-xl bg-ink-50 p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-500 shadow-sm">
              <MessagesSquare size={16} />
            </span>
            <p className="mt-3 text-2xl font-bold text-ink-900">{messageCount}</p>
            <p className="text-xs text-ink-500">주고받은 채팅 메시지</p>
          </div>
        </div>

        <button
          onClick={logOut}
          className="mt-8 flex w-full items-center justify-center gap-1.5 rounded-full border border-ink-200 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:border-red-300 hover:text-red-500"
        >
          <LogOut size={15} /> 로그아웃
        </button>
      </div>
    </div>
  );
}
