// 긴 문서를 검색 가능한 작은 조각(청크)으로 분할하는 모듈
import type { ParsedPage } from "./pdfParser";

const CHUNK_SIZE = 700; // 청크 하나의 최대 문자 수
const CHUNK_OVERLAP = 120; // 문맥 단절을 막기 위한 청크 간 중첩 문자 수

export interface RawChunk {
  page: number;
  text: string;
}

/**
 * 페이지별 원문을 받아 고정 길이 + 오버랩 방식으로 청크를 생성한다.
 * 오버랩을 두는 이유: 중요한 문장이 청크 경계에서 잘려 검색 누락되는 것을 방지하기 위함.
 */
export function chunkPages(pages: ParsedPage[]): RawChunk[] {
  const chunks: RawChunk[] = [];

  for (const { page, text } of pages) {
    if (!text) continue;

    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + CHUNK_SIZE, text.length);
      const slice = text.slice(start, end).trim();
      if (slice.length > 0) {
        chunks.push({ page, text: slice });
      }
      if (end === text.length) break;
      start = end - CHUNK_OVERLAP; // 다음 청크는 이전 청크 끝부분과 겹치게 시작
    }
  }

  return chunks;
}
