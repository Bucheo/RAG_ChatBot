// 작업 화면 우측 패널 — Q&A 채팅 인터페이스
import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircleQuestion, Send } from "lucide-react";
import type { ChatMessage } from "../types";
import { ChatMessageBubble } from "./ChatMessageBubble";

interface ChatPanelProps {
  messages: ChatMessage[];
  isAnswering: boolean;
  hasReadyDocument: boolean;
  onSend: (question: string) => void;
}

const SUGGESTED_QUESTIONS = [
  "이 부품의 동작 전압 범위는?",
  "최대 허용 전류는 얼마인가요?",
  "핀 배치를 알려줘",
];

export function ChatPanel({ messages, isAnswering, hasReadyDocument, onSend }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnswering]);

  const submit = () => {
    if (!input.trim() || !hasReadyDocument || isAnswering) return;
    onSend(input);
    setInput("");
  };

  return (
    <section className="flex h-full flex-col bg-ink-50">
      <div className="thin-scrollbar flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
              <MessageCircleQuestion size={24} />
            </span>
            <p className="text-sm font-medium text-ink-700">
              {hasReadyDocument
                ? "데이터시트에 대해 무엇이든 물어보세요"
                : "문서 분석이 끝나면 질문할 수 있어요"}
            </p>
            {hasReadyDocument && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => onSend(q)}
                    className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-500"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((m) => (
              <ChatMessageBubble key={m.id} message={m} />
            ))}
            {isAnswering && (
              <div className="flex items-center gap-2 pl-9 text-xs text-ink-400">
                <Loader2 size={13} className="animate-spin" /> 관련 근거를 찾아 답변을 작성하는 중...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-ink-100 bg-white p-4 sm:p-5">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={
              hasReadyDocument ? "질문을 입력하세요 (Shift+Enter로 줄바꿈)" : "문서 분석이 완료되면 입력할 수 있어요"
            }
            disabled={!hasReadyDocument}
            className="max-h-32 flex-1 resize-none rounded-2xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400 disabled:bg-ink-50"
          />
          <button
            onClick={submit}
            disabled={!hasReadyDocument || !input.trim() || isAnswering}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-ink-200"
            aria-label="질문 보내기"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
