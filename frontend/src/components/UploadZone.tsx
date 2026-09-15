// 파일 드래그앤드롭 업로드 카드 — iLovePDF 메인 화면의 큰 드롭존 UI를 참고
import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface UploadZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
}

const ACCEPTED_TYPES = ".pdf,.txt,.csv,.md";

export function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        onFilesSelected(e.dataTransfer.files);
      }
    },
    [onFilesSelected],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`group flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        isDragOver
          ? "border-brand-500 bg-brand-50"
          : "border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/40"
      }`}
    >
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-md transition-transform group-hover:scale-105">
        <UploadCloud size={30} />
      </span>
      <p className="text-lg font-semibold text-ink-900">
        데이터시트 파일을 여기로 끌어다 놓거나 클릭해서 업로드하세요
      </p>
      <p className="mt-2 text-sm text-ink-500">
        PDF, TXT, CSV, Markdown 지원 · 여러 파일 동시 업로드 가능
      </p>

      <span className="mt-6 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-brand-600">
        파일 선택
      </span>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFilesSelected(e.target.files);
            e.target.value = ""; // 같은 파일 재업로드 가능하도록 초기화
          }
        }}
      />
    </div>
  );
}
