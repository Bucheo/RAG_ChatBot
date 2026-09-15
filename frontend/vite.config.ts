import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 상위 디렉터리(C:/Users/Park)에 있는 손상된 package.json 때문에
  // postcss-load-config가 파일 시스템을 거슬러 올라가며 탐색하다 실패하는 것을 막기 위해
  // 빈 인라인 PostCSS 설정을 명시(@tailwindcss/vite 플러그인이 자체적으로 CSS를 처리하므로 불필요한 탐색 차단)
  css: { postcss: {} },
  server: {
    // /api 요청을 인증 백엔드(server/index.js, 4000번 포트)로 프록시.
    // 브라우저 입장에서는 같은 출처(5173)로만 보이므로 CORS 설정과 세션 쿠키 SameSite 이슈를 피할 수 있다.
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
})
