// 작업 화면 좌측 패널 — 업로드된 데이터시트 목록과 인덱싱 진행 상태를 보여준다
import { useRef } from "react";
import { AlertCircle, CheckCircle2, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import type { SourceDocument } from "../types";

interface DocumentPanelProps {
  documents: SourceDocument[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemove: (docId: string) => void;
}

const STATUS_LABEL: Record<SourceDocument["status"], string> = {
  parsing: "텍스트 추출 중",
  chunking: "문서 분할 중",
  embedding: "벡터 임베딩 생성 중",
  ready: "분석 완료",
  error: "처리 실패",
};

function StatusBadge({ status }: { status: SourceDocument["status"] }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
        <CheckCircle2 size={13} /> {STATUS_LABEL[status]}
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
        <AlertCircle size={13} /> {STATUS_LABEL[status]}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
      <Loader2 size={13} className="animate-spin" /> {STATUS_LABEL[status]}
    </span>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function DocumentPanel({ documents, onAddFiles, onRemove }: DocumentPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="flex h-full flex-col border-r border-ink-100 bg-white">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-ink-900">업로드된 데이터시트</h2>
        <span className="text-xs text-ink-400">{documents.length}개</span>
      </div>

      <div className="thin-scrollbar flex-1 overflow-y-auto px-4 py-3">
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="group rounded-xl border border-ink-100 p-3 transition-colors hover:border-brand-200"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-500">
                  <FileText size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{doc.name}</p>
                  <p className="text-xs text-ink-400">
                    {formatSize(doc.sizeBytes)}
                    {doc.pageCount > 0 && ` · ${doc.pageCount}페이지`}
                    {doc.status === "ready" && ` · 청크 ${doc.chunks.length}개`}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={doc.status} />
                  </div>
                </div>
                <button
                  onClick={() => onRemove(doc.id)}
                  className="shrink-0 rounded-lg p-1.5 text-ink-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  aria-label="문서 삭제"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-ink-100 p-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-200 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-500"
        >
          <Plus size={16} /> 파일 추가
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.csv,.md"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onAddFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
      </div>
    </aside>
  );
}
