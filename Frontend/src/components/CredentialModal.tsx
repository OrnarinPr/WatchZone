import { useEffect } from "react"

export type CredData = {
  full_id: string
  username: string | null
  password: string | null
}

export default function CredentialModal({
  open,
  data,
  onClose,
}: {
  open: boolean
  data?: CredData | null
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose() }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const copy = async (text?: string | null) => {
    if (!text) return
    try { await navigator.clipboard.writeText(text) } catch {}
  }

  if (!open || !data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="px-5 py-4 border-b">
          <h3 className="text-base font-semibold tracking-[-0.01em]">จองสำเร็จ • {data.full_id}</h3>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="text-sm">
            <div className="text-neutral-500">Username</div>
            <div className="mt-1 flex items-center gap-2">
              <code className="rounded-md border bg-neutral-50 px-2 py-1 text-[13px]">{data.username ?? "-"}</code>
              <button onClick={() => copy(data.username)} className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-50">Copy</button>
            </div>
          </div>

          <div className="text-sm">
            <div className="text-neutral-500">Password</div>
            <div className="mt-1 flex items-center gap-2">
              <code className="rounded-md border bg-neutral-50 px-2 py-1 text-[13px]">{data.password ?? "-"}</code>
              <button onClick={() => copy(data.password)} className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-50">Copy</button>
            </div>
          </div>

          <p className="text-[12px] text-neutral-500">*อย่าลืมบันทึกข้อมูลนี้ไว้ใช้งานนะคะ</p>
        </div>

        <div className="px-5 py-3 border-t flex justify-end">
          <button onClick={onClose} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90">ปิด</button>
        </div>
      </div>
    </div>
  )
}
