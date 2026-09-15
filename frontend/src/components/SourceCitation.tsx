// 답변 하단에 표시되는 출처(근거 청크) 카드 — 어떤 문서의 몇 페이지를 근거로 답했는지 보여준다
import { FileText } from "lucide-react";
import type { Citation } from "../types";

export function SourceCitation({ citation }: { citation: Citation }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-ink-50 p-2.5 text-xs">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 font-medium text-ink-700">
          <FileText size={12} /> {citation.docName} · p.{citation.page}
        </span>
        <span className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-brand-500">
          연관도 {(citation.score * 100).toFixed(0)}%
        </span>
      </div>
      <p className="line-clamp-2 text-ink-500">{citation.snippet}</p>
    </div>
  );
}
