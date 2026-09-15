// RAG(Retrieval-Augmented Generation) 파이프라인 오케스트레이션
//
// 흐름: 파일 업로드 -> 텍스트 추출 -> 청킹 -> 임베딩 -> (질문 시) 검색 -> 답변 생성
import { parseDocument } from "./pdfParser";
import { chunkPages } from "./textChunker";
import { embedBatch, embedText } from "./embeddings";
import { searchTopK } from "./vectorStore";
import { generateAnswer } from "./llmClient";
import type { ChatMessage, Citation, DocChunk, SourceDocument } from "../types";

const TOP_K = 4;

/**
 * 문서 하나를 업로드했을 때 실행되는 인덱싱 파이프라인.
 * 진행 단계마다 onStatusChange로 상태를 알려 UI(문서 패널)에서 진행 표시를 할 수 있게 한다.
 */
export async function indexDocument(
  file: File,
  docId: string,
  onStatusChange: (status: SourceDocument["status"]) => void,
): Promise<{ pageCount: number; chunks: DocChunk[] }> {
  onStatusChange("parsing");
  const parsed = await parseDocument(file);

  onStatusChange("chunking");
  const rawChunks = chunkPages(parsed.pages);

  onStatusChange("embedding");
  const embeddings = await embedBatch(rawChunks.map((c) => c.text));

  const chunks: DocChunk[] = rawChunks.map((raw, i) => ({
    id: `${docId}-chunk-${i}`,
    docId,
    docName: file.name,
    page: raw.page,
    text: raw.text,
    embedding: embeddings[i],
  }));

  return { pageCount: parsed.pageCount, chunks };
}

/**
 * 사용자 질문 하나에 대해 검색(retrieval) + 생성(generation)을 수행한다.
 * @param allChunks 현재 "ready" 상태인 모든 문서의 청크 (여러 데이터시트 통합 검색)
 */
export async function answerQuestion(
  question: string,
  allChunks: DocChunk[],
): Promise<{ answer: string; citations: Citation[] }> {
  // 1) 질문을 같은 벡터 공간으로 임베딩
  const queryEmbedding = embedText(question);

  // 2) 벡터 유사도 기반으로 가장 관련 있는 청크 상위 K개 검색
  const topMatches = searchTopK(allChunks, queryEmbedding, TOP_K);

  // 3) 검색된 청크를 컨텍스트로 LLM에 전달해 답변 생성
  const { answer, citations } = await generateAnswer({
    question,
    contexts: topMatches.map(({ chunk, score }) => ({
      text: chunk.text,
      docName: chunk.docName,
      page: chunk.page,
      score,
      chunkId: chunk.id,
    })),
  });

  return { answer, citations };
}

export function createMessage(role: ChatMessage["role"], content: string, citations?: Citation[]): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    citations,
    createdAt: Date.now(),
  };
}
