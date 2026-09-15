// 문서가 하나 이상 업로드된 이후의 작업 화면: 좌측 문서 패널 + 우측 Q&A 채팅 패널
import type { ChatMessage, SourceDocument } from "../types";
import { DocumentPanel } from "./DocumentPanel";
import { ChatPanel } from "./ChatPanel";

interface WorkspaceLayoutProps {
  documents: SourceDocument[];
  messages: ChatMessage[];
  isAnswering: boolean;
  hasReadyDocument: boolean;
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveDocument: (docId: string) => void;
  onSend: (question: string) => void;
}

export function WorkspaceLayout({
  documents,
  messages,
  isAnswering,
  hasReadyDocument,
  onAddFiles,
  onRemoveDocument,
  onSend,
}: WorkspaceLayoutProps) {
  return (
    <div className="mx-auto grid h-[calc(100vh-4rem)] w-full max-w-6xl grid-cols-1 overflow-hidden border-x border-ink-100 bg-white shadow-sm sm:grid-cols-[280px_1fr]">
      <DocumentPanel documents={documents} onAddFiles={onAddFiles} onRemove={onRemoveDocument} />
      <ChatPanel
        messages={messages}
        isAnswering={isAnswering}
        hasReadyDocument={hasReadyDocument}
        onSend={onSend}
      />
    </div>
  );
}
