// 검색된 컨텍스트(청크)를 근거로 최종 답변을 생성하는 모듈
//
// ⚠️ 프로덕션 연동 가이드
// 지금은 API 키 없이 데모가 가능하도록 검색된 청크를 요약/조합해 답변을 만드는
// 규칙 기반(mock) 구현이다. 실제 서비스에서는 아래 구조로 교체한다.
//   1) 브라우저 -> 팀 백엔드로 { question, context } 전송
//   2) 백엔드가 LLM을 호출해 답변과 출처를 생성 (실제 프롬프트/응답 스키마는 팀 백엔드 구현에 맞춘다)
//   3) LLM API 키는 반드시 서버 환경변수로만 보관 (프론트 번들에 절대 포함 금지)
// generateAnswer()의 시그니처만 유지하면 내부를 실제 API 호출로 바꿔도
// useRagChat 훅과 ChatPanel UI는 수정할 필요가 없다.
import type { Citation } from "../types";

export interface GenerateAnswerParams {
  question: string;
  contexts: Array<{ text: string; docName: string; page: number; score: number; chunkId: string }>;
}

export interface GenerateAnswerResult {
  answer: string;
  citations: Citation[];
}

/** 네트워크 호출을 흉내 내기 위한 짧은 지연 (실제 스트리밍 응답 느낌을 위해 유지) */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateAnswer({
  question,
  contexts,
}: GenerateAnswerParams): Promise<GenerateAnswerResult> {
  await delay(600);

  if (contexts.length === 0) {
    return {
      answer:
        "업로드된 데이터시트에서 관련 내용을 찾지 못했습니다. 질문을 조금 더 구체적으로 입력하거나, 관련 문서를 추가로 업로드해 주세요.",
      citations: [],
    };
  }

  // 실제 LLM 호출 자리(mock):
  // const res = await fetch("/api/chat", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ question, contexts }),
  // });
  // const { answer } = await res.json();

  const bulletPoints = contexts
    .map((c, i) => `${i + 1}) [${c.docName} p.${c.page}] ${c.text.slice(0, 160).trim()}...`)
    .join("\n");

  const answer =
    `"${question}"에 대해 업로드하신 데이터시트에서 아래 근거를 찾았습니다.\n\n${bulletPoints}\n\n` +
    `위 내용을 종합하면, 관련 스펙/조건은 인용된 문단을 참고해 확인하실 수 있습니다. ` +
    `보다 정확한 수치가 필요하면 원문 페이지를 함께 확인해 주세요.`;

  const citations: Citation[] = contexts.map((c) => ({
    chunkId: c.chunkId,
    docName: c.docName,
    page: c.page,
    snippet: c.text.slice(0, 200).trim(),
    score: c.score,
  }));

  return { answer, citations };
}
