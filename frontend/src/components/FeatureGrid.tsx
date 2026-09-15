// 이용 절차 카드 그리드 — iLovePDF의 "도구 카드 그리드" 톤을 워크플로 설명용으로 재구성
import { FileUp, ScanSearch, MessagesSquare } from "lucide-react";

const STEPS = [
  {
    icon: FileUp,
    title: "1. 데이터시트 업로드",
    desc: "PDF, TXT, CSV 형식의 부품 데이터시트를 업로드하면 자동으로 원문을 추출합니다.",
  },
  {
    icon: ScanSearch,
    title: "2. 자동 분석 및 인덱싱",
    desc: "문서를 의미 단위로 분할하고 벡터로 변환해, 질문과 관련된 부분을 빠르게 찾을 수 있도록 준비합니다.",
  },
  {
    icon: MessagesSquare,
    title: "3. 자연어로 질문",
    desc: "궁금한 스펙, 동작 조건, 핀 배치 등을 채팅으로 물어보면 근거 페이지와 함께 답변을 받습니다.",
  },
];

export function FeatureGrid() {
  return (
    <section id="workflow" className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="grid gap-5 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <Icon size={22} />
            </span>
            <h3 className="mb-1.5 text-base font-semibold text-ink-900">{title}</h3>
            <p className="text-sm leading-relaxed text-ink-500">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
