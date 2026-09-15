// 랜딩 히어로 섹션 — iLovePDF 홈의 "제목 + 부제 + 업로드 카드" 레이아웃을 참고
import { UploadZone } from "./UploadZone";

interface HeroProps {
  onFilesSelected: (files: FileList | File[]) => void;
}

export function Hero({ onFilesSelected }: HeroProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
      <span className="mb-4 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
        RAG 기반 데이터시트 분석
      </span>
      <h1 className="text-3xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
        부품 데이터시트를 업로드하고
        <br className="hidden sm:block" />
        <span className="text-brand-500"> 바로 질문하세요</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-ink-500 sm:text-lg">
        수백 페이지짜리 PDF 데이터시트도 걱정 없어요. AI가 문서를 분석해두면,
        원하는 스펙과 조건을 자연어로 물어보고 근거 페이지까지 함께 확인할 수 있습니다.
      </p>

      <div className="mt-10">
        <UploadZone onFilesSelected={onFilesSelected} />
      </div>
    </section>
  );
}
