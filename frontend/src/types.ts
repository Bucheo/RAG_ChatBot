// 앱 전역에서 공유하는 타입 정의 모음

/** 업로드된 문서를 텍스트 조각(청크) 단위로 쪼갠 결과 */
export interface DocChunk {
  id: string;
  docId: string;
  docName: string;
  page: number;
  text: string;
  /** 검색(유사도 계산)에 사용되는 벡터 임베딩 */
  embedding: number[];
}

export type DocStatus =
  | "parsing" // PDF/텍스트에서 원문 추출 중
  | "chunking" // 청크 단위로 분할 중
  | "embedding" // 임베딩(벡터화) 생성 중
  | "ready" // 검색 가능한 상태
  | "error";

/** 업로드된 데이터시트(문서) 한 건의 상태 */
export interface SourceDocument {
  id: string;
  name: string;
  sizeBytes: number;
  pageCount: number;
  status: DocStatus;
  errorMessage?: string;
  chunks: DocChunk[];
}

/** 답변 생성 시 근거로 사용된 출처(citation) */
export interface Citation {
  chunkId: string;
  docName: string;
  page: number;
  snippet: string;
  /** 질문과의 코사인 유사도 (0~1) */
  score: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  createdAt: number;
}

/** 로그인한 사용자 정보 (비밀번호 등 민감 정보는 제외한 공개 형태) */
export interface User {
  id: string;
  email: string;
  nickname: string;
  createdAt: number;
}
