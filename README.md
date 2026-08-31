# RAG 기반 데이터시트 챗봇 (RAG ChatBot)

영문 하드웨어 데이터시트(PDF)를 분석하여 임베디드 개발자가 질의했을 때 한국어로 정확한 스펙과 출처 페이지를 실시간으로 답변하는 RAG(검색 증강 생성) 기반 AI 어시스턴트 프로젝트입니다.

---

## 1. 프로젝트 소개
* **진행 기간:** 2026.08 ~ 진행 중
* **개발 배경 및 목적:**
  * MCU, 센서, RTC 모듈 등의 영문 하드웨어 데이터시트는 수십~수백 페이지에 달해 원하는 전기적 특성(전압, 전류, 동작 온도 등)을 빠르게 탐색하기 어렵습니다.
  * 일반적인 LLM을 그대로 사용할 경우 잘못된 스펙을 지어내어(Hallucination) 실제 하드웨어 보드가 소손되는 치명적인 위험이 발생할 수 있습니다.
  * 이에 따라 100% 무료 비용 제약 내에서 최신 경량 LLM과 벡터 데이터베이스(Chroma DB)를 결합하여, 철저하게 문서 내 근거에 기반한 정확한 스펙과 출처 페이지를 한국어로 제공하는 신뢰성 높은 RAG 시스템을 구축하고자 시작되었습니다
 
---

## 2. 기술 스택
* **개발 언어**: Python (3.10 이상 권장)
* **LLM Engine**: Google Gemini API (genimi-3.1-flash-lite)
* **운영체제 환경**: Windows 10 / 11
* **개발 도구(IDE)**: IntelliJ IDEA Ultimate
* **핵심 라이브러리 및 프레임워크**:
  * AI & 데이터 검증: google-genai, pydantic, python-dotenv
  * DB & 문서 처리: chromadb, langchain, pypdf
  * Web & Backend: FastAPI, Streamlit

---

## 3. 시작 가이드 및 실행 방법
### 빌드 및 구동 환경
* Python 3.10 이상 및 가상환경이 필요합니다.
* Google AI Studio에서 발급받은 Gemini API Key가 필요합니다.

### 실행 방법

#### 1) 저장소를 Clone하거나 소스코드를 다운로드합니다.

#### 2) 프로젝트 루트 경로에 .env 파일을 생성하고 발급받은 API 키를 등록합니다.
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 3) 패지키 관리 도구를 통해 의존성을 설치합니다.
```bash
#uv 사용 시
uv pip install -r req.txt

#일반 pip 사용 시
python -m pip install -r req.txt
```

#### 4) AI 엔진 독립 단위 테스트를 실행하려면 `ai.py`를 직접 실행합니다.

#### 5) 전체 연동 시 Streamlit 또는 `app.py`를 실행합니다.

---

