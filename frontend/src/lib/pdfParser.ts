// PDF 파일에서 페이지별 원문 텍스트를 추출하는 모듈 (pdf.js 사용)
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// pdf.js는 백그라운드 파싱을 위해 별도의 Web Worker를 필요로 한다.
// Vite의 ?url 임포트로 워커 번들 경로를 얻어 명시적으로 등록한다.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ParsedPage {
  page: number;
  text: string;
}

export interface ParsedDocument {
  pageCount: number;
  pages: ParsedPage[];
}

/** PDF 파일을 페이지 단위 텍스트 배열로 변환한다 */
export async function parsePdf(file: File): Promise<ParsedDocument> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const pages: ParsedPage[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push({ page: pageNum, text });
  }

  return { pageCount: pdf.numPages, pages };
}

/** 일반 텍스트/CSV 파일은 파싱 없이 그대로 단일 페이지로 취급한다 */
export async function parsePlainText(file: File): Promise<ParsedDocument> {
  const text = await file.text();
  return { pageCount: 1, pages: [{ page: 1, text }] };
}

export async function parseDocument(file: File): Promise<ParsedDocument> {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return parsePdf(file);
  }
  return parsePlainText(file);
}
