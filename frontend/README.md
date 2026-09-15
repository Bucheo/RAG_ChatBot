# DataSheet AI — RAG 데이터시트 분석 & Q&A 챗봇

iLovePDF의 UI/UX(화이트 배경, 레드 포인트 컬러, 드래그앤드롭 업로드, 카드형 레이아웃)를 참고해 만든
RAG(Retrieval-Augmented Generation) 기반 데이터시트 분석 챗봇 프론트엔드입니다.

## 실행 방법

```bash
npm install
npm run dev
```

`npm run dev`는 프론트엔드(Vite, :5173)와 인증 API 서버(Express, :4000)를 동시에 실행합니다.
프론트에서 `/api/*` 요청은 Vite 프록시를 통해 API 서버로 전달되므로 브라우저에는 하나의 origin(5173)으로만 보입니다.

## 인증(로그인/회원가입/마이페이지) 구조

- `server/index.js` — 인증 API 서버. bcrypt로 비밀번호를 해싱하고, 로그인 성공 시 JWT를 httpOnly 쿠키로 발급한다.
- `server/store.js` — 사용자 데이터를 프로젝트 루트의 `.data/users.json`에 저장하는 초경량 저장소 (데모용, 실서비스에서는 실제 DB로 교체).
  - `server/` 안이 아니라 바깥에 두는 이유: `node --watch`가 `server/` 디렉터리를 재귀 감시하므로, 그 안에 데이터 파일을 두면 로그인/가입 때마다 서버가 자신이 쓴 파일을 변경 감지해 재시작을 반복하는 버그가 생긴다.
- `src/lib/auth.ts` — 위 API를 호출하는 프론트 클라이언트 (fetch 기반, 세션 쿠키 자동 포함).
- `src/hooks/useAuth.tsx` — 로그인 상태를 앱 전역에 제공하는 컨텍스트.
- `src/components/AuthModal.tsx`, `src/components/MyPage.tsx`, `src/components/Navbar.tsx` — 로그인/가입 모달, 마이페이지, 로그인 상태에 따른 내비게이션 UI.

## RAG 파이프라인 구조 (`src/lib`)

1. `pdfParser.ts` — PDF/텍스트 파일에서 페이지별 원문 추출 (pdf.js)
2. `textChunker.ts` — 원문을 오버랩이 있는 청크로 분할
3. `embeddings.ts` — 청크/질문을 벡터로 변환 (현재는 API 키 없이 동작하는 로컬 해싱 임베딩. 실제 서비스에서는 서버 경유 임베딩 API로 교체)
4. `vectorStore.ts` — 코사인 유사도 기반 상위 K개 청크 검색
5. `llmClient.ts` — 검색된 컨텍스트로 답변 생성 (현재는 mock. 실제 서비스에서는 서버 경유 Claude API 호출로 교체)
6. `ragPipeline.ts` — 위 단계를 오케스트레이션

상태 관리는 `src/hooks/useRagChat.ts`, 화면 구성은 `src/components/*`, `src/App.tsx`를 참고하세요.

## 실제 LLM/임베딩 API 연동 시 주의

- API 키는 절대 프론트엔드 번들에 포함하지 말고, 반드시 자체 백엔드 서버를 경유해 호출하세요.
- `embeddings.ts`, `llmClient.ts` 안에 연동 지점과 예시 코드가 주석으로 표시되어 있습니다.

## 프로덕션 배포 전 반드시 확인할 것 (인증)

- `JWT_SECRET` 환경변수를 충분히 긴 무작위 값으로 설정 (기본값은 개발용 더미 시크릿).
- HTTPS 환경에서는 `server/index.js`의 쿠키 옵션에 `secure: true` 추가.
- `.data/users.json` 대신 실제 DB(PostgreSQL 등)로 교체 — 파일 기반 저장은 동시 쓰기 충돌에 안전하지 않습니다.
