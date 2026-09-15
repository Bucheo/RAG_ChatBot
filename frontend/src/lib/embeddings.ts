// 텍스트를 벡터로 변환(임베딩)하는 모듈
//
// ⚠️ 프로덕션 연동 가이드
// 지금은 API 키 없이 브라우저에서 바로 동작을 확인할 수 있도록
// "해싱 기반 로컬 임베딩(hashing trick)"으로 대체 구현되어 있다.
// 실제 서비스에서는 아래처럼 서버(백엔드)를 경유해 임베딩 API를 호출해야 한다.
//   1) 브라우저 -> 자체 백엔드(/api/embeddings)로 텍스트 전송
//   2) 백엔드 -> OpenAI(text-embedding-3-small), Voyage, Cohere 등 임베딩 API 호출
//   3) 임베딩 API 키는 절대 프론트엔드 코드/번들에 노출하지 않는다
// 이 파일의 embedText/embedBatch 함수 시그니처만 유지하면
// 내부 구현을 실제 API 호출로 교체해도 나머지 RAG 파이프라인은 그대로 재사용 가능하다.

const VECTOR_DIM = 256;

/** 문자열 해시를 이용해 결정적으로(deterministic) 벡터 차원 인덱스를 뽑아내는 간단한 해싱 함수 */
function hashToken(token: string): number {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
  }
  return hash % VECTOR_DIM;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s.]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** 텍스트 하나를 고정 차원의 벡터로 변환 (hashing trick + L2 정규화) */
export function embedText(text: string): number[] {
  const vector = new Array(VECTOR_DIM).fill(0);
  const tokens = tokenize(text);

  for (const token of tokens) {
    const idx = hashToken(token);
    vector[idx] += 1;
  }

  // 코사인 유사도 비교를 안정적으로 만들기 위해 벡터 길이를 1로 정규화
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / norm);
}

/** 여러 텍스트를 배치로 임베딩. 실제 API 연동 시 배치 호출로 비용/지연을 줄이는 지점 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  // 실제 API 연동 예시:
  // const res = await fetch("/api/embeddings", { method: "POST", body: JSON.stringify({ texts }) });
  // return (await res.json()).embeddings;
  return texts.map(embedText);
}
