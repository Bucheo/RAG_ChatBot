// 상단 내비게이션 바 — iLovePDF의 화이트 배경 + 레드 포인트 로고 구조를 참고해 구성
// 로그인 여부에 따라 "로그인/가입하기" 버튼 또는 사용자 드롭다운 메뉴를 보여준다
import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileSearch, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import type { AuthMode } from "./AuthModal";

interface NavbarProps {
  onGoHome: () => void;
  onOpenAuth: (mode: AuthMode) => void;
  onGoMyPage: () => void;
}

export function Navbar({ onGoHome, onOpenAuth, onGoMyPage }: NavbarProps) {
  const { user, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button onClick={onGoHome} className="flex items-center gap-2 text-lg font-bold text-ink-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
            <FileSearch size={20} strokeWidth={2.4} />
          </span>
          DataSheet<span className="text-brand-500">AI</span>
        </button>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-600 md:flex">
          <a href="#workflow" className="transition-colors hover:text-brand-500">
            이용 방법
          </a>
          <a href="#faq" className="transition-colors hover:text-brand-500">
            자주 묻는 질문
          </a>
        </nav>

        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-ink-200 py-1.5 pl-1.5 pr-3 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                <UserIcon size={15} />
              </span>
              <span className="max-w-[100px] truncate">{user.nickname}</span>
              <ChevronDown size={14} className="text-ink-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lg">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onGoMyPage();
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-ink-700 hover:bg-ink-50"
                >
                  <UserIcon size={14} /> 마이페이지
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logOut();
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-ink-700 hover:bg-ink-50"
                >
                  <LogOut size={14} /> 로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth("login")}
              className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-brand-500 sm:inline-block"
            >
              로그인
            </button>
            <button
              onClick={() => onOpenAuth("signup")}
              className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
            >
              가입하기
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
