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

## 2) Install & Run (Frontend)
```bash
cd Frontend
pnpm install
pnpm run dev
```
เปิด: http://localhost:5173

---

## 3) Database (apply once)
เข้า **Supabase → SQL Editor** แล้วรันไฟล์ `db/schema.sql` จากโปรเจกต์นี้  
สคริปต์จะสร้าง:
- ตาราง, View, RPC, Triggers
- Mock data
- ระบบ `full_id` แยกตาม type (เช่น `A-0001`, `B-0001` …)
- (ถ้าตั้งค่าไว้) RLS Policies

> ถ้าเปิด RLS แล้วอ่าน/เขียนไม่ได้ ให้ตรวจ roles/policies ของตารางที่เกี่ยวข้อง

---

## Project Structure
```
Frontend/
  public/
    WZ.png                 # โลโก้ app
  src/
    components/
      Header.tsx           # Header + Logo + Title
      Controls.tsx         # ตัวเลือก type, filter, ปุ่ม 7/14/30, ปุ่ม confirm
      IdTable.tsx          # ตารางหลัก แสดงสถานะ, เวลา, ปุ่ม action
      StatusBadge.tsx      # Badge แสดงสถานะสีต่างๆ
      ActionButtons.tsx    # ปุ่ม release / extend (+7/+14/+30)
      ConfirmBar.tsx       # ปุ่มยืนยันลอยล่างขวา
      CredentialModal.tsx  # Popup แสดง username/password หลังจอง
    lib/
      supabaseClient.ts    # Supabase client (อ่านค่า .env)
    types.ts               # TypeScript types (Row, Status, IdType)
    App.tsx                # Logic หลัก: load, filter, RPC, realtime
    main.tsx               # React entry
    index.css              # Tailwind import
  vite.config.ts           # Vite + React + Tailwind config
db/
  schema.sql               # DB schema: tables/view/RPC/triggers/mock/RLS
```

---

## Scripts
```bash
pnpm run dev       # เริ่ม dev server (hot reload)
pnpm run build     # สร้าง production build (ออกที่ dist/)
pnpm run preview   # เสิร์ฟไฟล์จาก dist/ เพื่อตรวจ build
```

> สำหรับ deploy จริง แนะนำให้เสิร์ฟ `dist/` ผ่าน nginx / static host และตั้งค่า `VITE_*` ให้ถูก environment

---

## Quick Start (คลีนๆ ภายใน 3 คำสั่ง)
```bash
# 1) ติดตั้ง
cd Frontend && pnpm install

# 2) ตั้งค่า env
cp .env.example .env   # ถ้ามีไฟล์ตัวอย่าง
# แล้วเติมค่า VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY

# 3) รัน
pnpm run dev
```

---

## Troubleshooting สั้นๆ
- **ขึ้น 401/403 จาก Supabase** → ตรวจค่า `VITE_SUPABASE_*` และ RLS/Policies
- **Realtime ไม่เด้ง** → เปิด Realtime สำหรับตารางที่ใช้ และเช็ค key/URL ให้ถูกต้อง
- **CORS/Network** → ตรวจ origin ใน Supabase (Auth → URL Config) ให้รวม `http://localhost:5173`
