# WatchZone — Install & Structure

---

## Installation

### Prerequisites
- Node 18+ และ pnpm
- Supabase project (Project URL + anon key)

### 1) Environment
สร้างไฟล์ `Frontend/.env`:
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY ```

### 2) Install & Run Frontend
cd Frontend
pnpm install
pnpm run dev


เปิด: http://localhost:5173
 
### 3) Database (apply once)

เข้า Supabase → SQL Editor → รัน db/schema.sql
จะสร้างตาราง, view, RPC, triggers, mock data และ full_id แบบรันแยกตาม type (A-0001, B-0001 …)

Project Structure
Frontend/
  public/
    WZ.png                # โลโก้ app
  src/
    components/
      Header.tsx          # Header + Logo + Title
      Controls.tsx        # ตัวเลือก type, filter, ปุ่ม 7/14/30, ปุ่ม confirm
      IdTable.tsx         # ตารางหลัก แสดงสถานะ, เวลา, ปุ่ม action
      StatusBadge.tsx     # Badge แสดงสถานะสีต่างๆ
      ActionButtons.tsx   # ปุ่ม release / extend (+7/+14/+30)
      ConfirmBar.tsx      # ปุ่มยืนยันลอยล่างขวา
      CredentialModal.tsx # Popup แสดง username/password หลังจอง
    lib/
      supabaseClient.ts   # Supabase client (อ่านค่า .env)
    types.ts              # TypeScript types (Row, Status, IdType)
    App.tsx               # Logic หลัก: load, filter, RPC, realtime
    main.tsx              # Entry ของ React
    index.css             # Tailwind import
  vite.config.ts          # Config Vite + React + Tailwind
db/
  schema.sql              # DB schema: tables/view/RPC/triggers/mock/RLS

### Scripts
``` 
pnpm run dev     # dev server
pnpm run build   # production build
pnpm run preview # preview build
```




