// 문서 업로드 상태 + 채팅 상태를 관리하는 커스텀 훅
// UI 컴포넌트는 이 훅이 제공하는 값/함수만 사용하고, RAG 내부 구현은 몰라도 되도록 분리한다.
import { useCallback, useMemo, useState } from "react";
import { indexDocument, answerQuestion, createMessage } from "../lib/ragPipeline";
import type { ChatMessage, DocChunk, SourceDocument } from "../types";

export function useRagChat() {
  const [documents, setDocuments] = useState<SourceDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);

  // 검색 가능한(=인덱싱 완료된) 문서에서 모은 전체 청크
  const readyChunks = useMemo<DocChunk[]>(
    () => documents.filter((d) => d.status === "ready").flatMap((d) => d.chunks),
    [documents],
  );

  const hasReadyDocument = readyChunks.length > 0;

  /** 새 파일을 업로드하면 문서 목록에 추가하고 인덱싱 파이프라인을 백그라운드로 실행 */
  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const placeholder: SourceDocument = {
        id: docId,
        name: file.name,
        sizeBytes: file.size,
        pageCount: 0,
        status: "parsing",
        chunks: [],
      };
      setDocuments((prev) => [...prev, placeholder]);

      const updateStatus = (status: SourceDocument["status"]) => {
        setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, status } : d)));
      };

      indexDocument(file, docId, updateStatus)
        .then(({ pageCount, chunks }) => {
          setDocuments((prev) =>
            prev.map((d) => (d.id === docId ? { ...d, pageCount, chunks, status: "ready" } : d)),
          );
        })
        .catch((err: unknown) => {
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === docId
                ? { ...d, status: "error", errorMessage: err instanceof Error ? err.message : "처리 실패" }
                : d,
            ),
          );
        });
    }
  }, []);

  const removeDocument = useCallback((docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  }, []);

  /** 사용자 질문을 받아 검색 + 답변 생성을 수행하고 대화 목록에 반영 */
  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isAnswering) return;

      setMessages((prev) => [...prev, createMessage("user", trimmed)]);
      setIsAnswering(true);

      try {
        const { answer, citations } = await answerQuestion(trimmed, readyChunks);
        setMessages((prev) => [...prev, createMessage("assistant", answer, citations)]);
      } finally {
        setIsAnswering(false);
      }
    },
    [readyChunks, isAnswering],
  );

  return {
    documents,
    messages,
    isAnswering,
    hasReadyDocument,
    addFiles,
    removeDocument,
    sendMessage,
  };
}
