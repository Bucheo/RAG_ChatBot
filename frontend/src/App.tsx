// 앱 루트 컴포넌트
// - viewMode가 "mypage"면 마이페이지를, 아니면 문서 업로드 여부에 따라 랜딩/작업 화면을 보여준다.
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FeatureGrid } from "./components/FeatureGrid";
import { Footer } from "./components/Footer";
import { WorkspaceLayout } from "./components/WorkspaceLayout";
import { MyPage } from "./components/MyPage";
import { AuthModal, type AuthMode } from "./components/AuthModal";
import { useRagChat } from "./hooks/useRagChat";
import { useAuth } from "./hooks/useAuth";

type ViewMode = "app" | "mypage";

function App() {
  const { user, isAuthLoading } = useAuth();
  const { documents, messages, isAnswering, hasReadyDocument, addFiles, removeDocument, sendMessage } =
    useRagChat();

  const [viewMode, setViewMode] = useState<ViewMode>("app");
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const hasDocuments = documents.length > 0;

  // 세션 쿠키 유효성을 서버에 확인하는 동안, 로그아웃 상태 UI가 먼저 번쩍이는 것을 방지
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        onGoHome={() => setViewMode("app")}
        onOpenAuth={(mode) => setAuthMode(mode)}
        onGoMyPage={() => (user ? setViewMode("mypage") : setAuthMode("login"))}
      />

      {viewMode === "mypage" && user ? (
        <main className="flex-1 bg-ink-50">
          <MyPage
            user={user}
            documentCount={documents.length}
            messageCount={messages.length}
            onBack={() => setViewMode("app")}
          />
        </main>
      ) : hasDocuments ? (
        <main className="flex flex-1 flex-col bg-ink-50 py-4 sm:py-6">
          <WorkspaceLayout
            documents={documents}
            messages={messages}
            isAnswering={isAnswering}
            hasReadyDocument={hasReadyDocument}
            onAddFiles={addFiles}
            onRemoveDocument={removeDocument}
            onSend={sendMessage}
          />
        </main>
      ) : (
        <main className="flex-1">
          <Hero onFilesSelected={addFiles} />
          <FeatureGrid />
        </main>
      )}

      <Footer />

      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
          onSuccess={() => setAuthMode(null)}
        />
      )}
    </div>
  );
}

export default App;
