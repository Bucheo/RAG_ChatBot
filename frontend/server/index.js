// 인증 전용 백엔드 API 서버
// 비밀번호 해싱(bcrypt)과 세션 발급(JWT, httpOnly 쿠키)을 실제로 수행한다.
// 프론트엔드(src/lib/auth.ts)는 이 API를 호출만 하고, 비밀번호나 토큰 서명은 절대 브라우저에서 다루지 않는다.
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readUsers, writeUsers } from "./store.js";

const app = express();
const PORT = process.env.AUTH_API_PORT || 4000;

// ⚠️ 데모용 기본값. 실제 배포 시 반드시 환경변수로 충분히 긴 무작위 시크릿을 주입해야 한다.
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-insecure-secret-change-me";
const SESSION_COOKIE = "session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7일
const BCRYPT_ROUNDS = 10;

app.use(express.json());
app.use(cookieParser());

function toPublicUser(user) {
  const { id, email, nickname, createdAt } = user;
  return { id, email, nickname, createdAt };
}

function issueSession(res, userId) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true, // 브라우저 JS에서 접근 불가 -> XSS로 인한 토큰 탈취 방지
    sameSite: "lax",
    // secure: true, // 실제 배포(HTTPS) 시 반드시 활성화
    maxAge: SESSION_MAX_AGE_MS,
  });
}

/** 세션 쿠키(JWT)를 검증해 req.userId를 채워주는 인증 미들웨어 */
function requireAuth(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: "세션이 만료되었습니다. 다시 로그인해 주세요." });
  }
}

app.post("/api/auth/signup", async (req, res) => {
  const { email, password, nickname } = req.body ?? {};
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const trimmedNickname = String(nickname ?? "").trim();

  if (!normalizedEmail || !password || !trimmedNickname) {
    return res.status(400).json({ message: "이메일, 비밀번호, 닉네임을 모두 입력해 주세요." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "비밀번호는 6자 이상이어야 합니다." });
  }

  const users = readUsers();
  if (users.some((u) => u.email === normalizedEmail)) {
    return res.status(409).json({ message: "이미 가입된 이메일입니다." });
  }

  // 비밀번호는 평문으로 저장하지 않고 bcrypt로 단방향 해싱한다 (salt는 bcrypt가 자동 생성/내장).
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: normalizedEmail,
    nickname: trimmedNickname,
    passwordHash,
    createdAt: Date.now(),
  };

  writeUsers([...users, newUser]);
  issueSession(res, newUser.id);
  res.status(201).json({ user: toPublicUser(newUser) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const normalizedEmail = String(email ?? "").trim().toLowerCase();

  const users = readUsers();
  const found = users.find((u) => u.email === normalizedEmail);

  // 사용자 존재 여부와 무관하게 같은 오류 메시지를 반환해 이메일 등록 여부 추측(계정 열거 공격)을 막는다.
  const isMatch = found ? await bcrypt.compare(String(password ?? ""), found.passwordHash) : false;
  if (!found || !isMatch) {
    return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }

  issueSession(res, found.id);
  res.json({ user: toPublicUser(found) });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.status(204).end();
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const found = readUsers().find((u) => u.id === req.userId);
  if (!found) return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
  res.json({ user: toPublicUser(found) });
});

app.patch("/api/auth/me", requireAuth, (req, res) => {
  const nickname = String(req.body?.nickname ?? "").trim();
  if (!nickname) return res.status(400).json({ message: "닉네임을 입력해 주세요." });

  const users = readUsers();
  const idx = users.findIndex((u) => u.id === req.userId);
  if (idx === -1) return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });

  users[idx] = { ...users[idx], nickname };
  writeUsers(users);
  res.json({ user: toPublicUser(users[idx]) });
});

app.listen(PORT, () => {
  console.log(`[auth-api] listening on http://localhost:${PORT}`);
});
