// 청크 벡터를 보관하고, 질문 벡터와의 유사도로 관련 청크를 검색하는 간이 벡터 스토어
//
// ⚠️ 프로덕션 연동 가이드
// 문서/청크 수가 많아지면 브라우저 메모리 선형 탐색은 한계가 있다.
// 실서비스에서는 pgvector, Pinecone, Qdrant, Weaviate 같은 벡터 DB에
// 임베딩을 저장하고 ANN(근사 최근접 이웃) 검색을 사용해야 한다.
import type { DocChunk } from "../types";

/** 두 벡터의 코사인 유사도 (-1 ~ 1, 임베딩이 정규화되어 있으면 내적과 동일) */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

/**
 * 질문 임베딩과 가장 유사한 상위 K개의 청크를 찾는다.
 * @param chunks 검색 대상이 되는 전체 청크(여러 문서를 합친 것일 수 있음)
 * @param queryEmbedding 사용자 질문을 임베딩한 벡터
 * @param topK 반환할 최대 개수
 */
export function searchTopK(
  chunks: DocChunk[],
  queryEmbedding: number[],
  topK = 4,
): Array<{ chunk: DocChunk; score: number }> {
  return chunks
    .map((chunk) => ({ chunk, score: cosineSimilarity(chunk.embedding, queryEmbedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
