// 사용자 데이터를 로컬 JSON 파일에 저장/조회하는 초경량 저장소
// ⚠️ 데모/개발용 구현이다. 실제 서비스에서는 PostgreSQL/MySQL 등 트랜잭션을 지원하는 DB로 교체해야 한다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// server/ 바깥(프로젝트 루트의 .data/)에 둔다: node --watch가 server/ 디렉터리를 재귀 감시하기 때문에
// 데이터 파일을 그 안에 두면 서버가 로그인/가입 때마다 자신이 쓴 파일을 감지해 재시작을 반복하게 된다.
const DB_PATH = path.join(__dirname, "..", ".data", "users.json");

function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]", "utf8");
}

export function readUsers() {
  ensureDbFile();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

export function writeUsers(users) {
  ensureDbFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf8");
}
