// 채팅 메시지 한 건(사용자/AI)을 렌더링하는 버블 컴포넌트
import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import type { ChatMessage } from "../types";
import { SourceCitation } from "./SourceCitation";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-2.5 text-sm text-white shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <Sparkles size={14} />
          </span>
          <div className="rounded-2xl rounded-tl-sm border border-ink-100 bg-white px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line text-ink-800 shadow-sm">
            {message.content}
          </div>
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="ml-9 mt-2">
            <button
              onClick={() => setShowSources((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-ink-400 hover:text-brand-500"
            >
              출처 {message.citations.length}개 {showSources ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showSources && (
              <div className="mt-2 space-y-1.5">
                {message.citations.map((c) => (
                  <SourceCitation key={c.chunkId} citation={c} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
