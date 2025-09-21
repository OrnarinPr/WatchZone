# WatchZone — Install & Project Structure (Revised)

## ✅ Prerequisites
- Node.js 18+ และ `pnpm`
- โปรเจกต์ **Supabase** (Project URL + anon key)
- (แนะนำ) เปิดใช้ Realtime Database ใน Supabase

---

## 1) Environment
สร้างไฟล์ `Frontend/.env`:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

> ถ้าใช้หลาย environment ให้สร้าง `.env.development` / `.env.production` ตามเหมาะสม

---

## 2) Install & Run 
### (Frontend)
```bash
cd Frontend
pnpm install
pnpm run dev
```
เปิด: http://localhost:5173
### (Backend)
```bash
cd Backend
uvicorn main:app --host 0.0.0.0 --port 8201 --reload
```


## Project Structure
```
Frontend/
  public/
    WZ.png                   # โลโก้ app
  src/
    components/
      Header.tsx             # Header + Logo + Title
      Controls.tsx           # ตัวเลือก type, filter, ปุ่ม 7/14/30, ปุ่ม confirm
      IdTable.tsx            # ตารางหลัก แสดงสถานะ, เวลา, ปุ่ม action (+ ปุ่มขอลิงก์ใหม่)
      StatusBadge.tsx        # Badge แสดงสถานะสีต่างๆ
      ActionButtons.tsx      # ปุ่ม release / extend (+7/+14/+30)
      ConfirmBar.tsx         # ปุ่มยืนยันลอยล่างขวา
      CredentialModal.tsx    # Popup แสดง username/password หลังจอง
      GenerateLinkButton.tsx # ปุ่ม "ขอลิงก์ใหม่" ต่อท้ายคอลัมน์ Actions
    lib/
      supabaseClient.ts      # Supabase client (อ่านค่า .env)
    types.ts                 # TypeScript types (Row, Status, IdType)
    App.tsx                  # Logic หลัก: load, filter, RPC, realtime
    main.tsx                 # React entry
    index.css                # Tailwind import
  vite.config.ts             # Vite + React + Tailwind config
db/
  schema.sql                 # DB schema: tables/view/RPC/triggers/mock/RLS

Backend/
  main.py                    # FastAPI app: /cred/link, /cred/{token}, /healthz
  requirements.txt           # dependencies (FastAPI, uvicorn, python-dotenv)
  .env.example               # ตัวอย่าง ENV (PUBLIC_BASE_URL, CORS_ORIGINS)
  README.md                  # คู่มือใช้งาน Backend

```

---

## Scripts
```bash
pnpm run dev       # เริ่ม dev server (hot reload)
pnpm run build     # สร้าง production build (ออกที่ dist/)
pnpm run preview   # เสิร์ฟไฟล์จาก dist/ เพื่อตรวจ build
```


---

## Quick Start 
```bash
# ติดตั้ง
cd Frontend && pnpm install

# ตั้งค่า env
cp .env.example .env   # ถ้ามีไฟล์ตัวอย่าง
# แล้วเติมค่า VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY  นะ

# รัน
pnpm run dev

cd ..

cd Backend 

python -m venv .venv
.venv\Scripts\activate

# ติดตั้ง
pip install -r requirements.txt
# รัน
uvicorn main:app --host 0.0.0.0 --port 8201 --reload

```

---

## Troubleshooting สั้นๆ
- **ขึ้น 401/403 จาก Supabase** → ตรวจค่า `VITE_SUPABASE_*` และ RLS/Policies
- **Realtime ไม่เด้ง** → เปิด Realtime สำหรับตารางที่ใช้ และเช็ค key/URL ให้ถูกต้อง
- **CORS/Network** → ตรวจ origin ใน Supabase (Auth → URL Config) ให้รวม `http://localhost:5173`
