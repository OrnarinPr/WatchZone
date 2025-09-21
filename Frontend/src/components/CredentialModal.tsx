import { useEffect, useMemo, useState } from "react"

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
  const [linkUrl, setLinkUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const BACKEND_URL = useMemo(() => {
    const v = import.meta?.env?.VITE_WZ_BACKEND_URL as string | undefined
    return (v && v.replace(/\/+$/,"")) || window.location.origin
  }, [])

  // สร้างลิงก์ทันทีเมื่อเปิด modal
  useEffect(() => {
    async function createLink() {
      if (!open || !data) return
      setErr(null)
      setLinkUrl(null)
      setLoading(true)
      try {
        const res = await fetch(`${BACKEND_URL}/cred/link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_id: data.full_id,
            username: data.username,
            password: data.password,
            ttl_seconds: 600,  // อายุลิงก์ 10 นาที
            single_use: true,  // ใช้ได้ครั้งเดียว
          }),
        })
        if (!res.ok) {
          const t = await res.text().catch(() => "")
          throw new Error(t || `Request failed (${res.status})`)
        }
        const json = await res.json() as { url: string }
        setLinkUrl(json.url)
      } catch (e: any) {
        setErr(e?.message || "สร้างลิงก์ไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }
    createLink()
  }, [open, data, BACKEND_URL])

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
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-xl"
           onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="px-5 py-4 border-b">
          <h3 className="text-base font-semibold tracking-[-0.01em]">
            จองสำเร็จ • {data.full_id}
          </h3>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="text-sm text-neutral-600">
            คัดลอกลิงก์เพื่อเปิดดูข้อมูลของไอดีนี้
          </div>

          <div className="flex items-center gap-2">
            <input
              readOnly
              value={linkUrl ?? (loading ? "กำลังสร้างลิงก์..." : (err ? "สร้างลิงก์ไม่สำเร็จ" : ""))}
              className="w-full rounded-md border bg-neutral-50 px-2 py-2 text-[13px]"
            />
            <button
              onClick={() => copy(linkUrl)}
              disabled={!linkUrl || loading}
              className="rounded-md border px-3 py-2 text-xs hover:bg-neutral-50 disabled:opacity-50"
              title="คัดลอกลิงก์"
            >
              Copy
            </button>
          </div>

          {err && <p className="text-[12px] text-red-600">Error: {err}</p>}
          {linkUrl && (
            <p className="text-[12px] text-neutral-500">
              *ลิงก์เป็นแบบใช้ครั้งเดียวและหมดอายุอัตโนมัติ
            </p>
          )}
        </div>

        <div className="px-5 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}
