# WatchZone Backend — Credential Link API (no /api prefix)

บริการ FastAPI สำหรับสร้างลิงก์แบบ token เพื่อเปิดดู **username/password** ของไอดีที่จอง โดย **ไม่ฝังข้อมูลจริงใน URL**  
> เส้นทางถูกย่อให้สั้น: ใช้ `/cred/link` และ `/cred/{token}` (ไม่มี `/api`)

## ฟีเจอร์
- `POST /cred/link` สร้าง token + TTL + เลือก single-use ได้
- `GET /cred/{token}` ดึง credential (หมดอายุ → 410, ใช้ไปแล้ว/ไม่ถูกต้อง → 404)
- In-memory store + background cleanup (demo/POC)
- CORS พร้อมเชื่อมกับ Frontend

> Production: ควรเก็บใน DB/Redis + ใส่ auth/การเข้ารหัสตามนโยบายองค์กร

## ติดตั้งและรัน
```bash
cd Backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

python -m uvicorn main:app --host 0.0.0.0 --port 8201 --reload
```
ตรวจ:
- http://localhost:8201/healthz
- http://localhost:8201/docs

## .env
```env
PUBLIC_BASE_URL=http://localhost:8201
CORS_ORIGINS=http://localhost:5173
```

## API
### 1) POST /cred/link
Body:
```json
{
  "full_id": "A-0001",
  "username": "userA",
  "password": "passA",
  "ttl_seconds": 600,
  "single_use": true
}
```
Response:
```json
{
  "token": "1c8d...",
  "url": "http://localhost:8201/cred/1c8d...",
  "expires_at": "2025-09-21T02:00:00Z"
}
```

### 2) GET /cred/{token}
Response:
```json
{
  "full_id": "A-0001",
  "username": "userA",
  "password": "passA",
  "expires_at": "2025-09-21T02:00:00Z"
}
```
- 404: token ไม่ถูกต้อง/ถูกใช้ไปแล้ว (เมื่อ single_use=true)
- 410: token หมดอายุ

### 3) DELETE /cred/{token}
เพิกถอน token

## Frontend Integration (React)
```ts
const res = await fetch("http://localhost:8201/cred/link", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    full_id: data.full_id,
    username: data.username,
    password: data.password,
    ttl_seconds: 600,
    single_use: true,
  }),
});
const json = await res.json(); // { url, token, expires_at }
window.open(json.url, "_blank");
```
