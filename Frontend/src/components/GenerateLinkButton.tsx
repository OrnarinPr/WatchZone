// src/components/GenerateLinkButton.tsx
import { useState } from "react"

export type CredMinimal = {
    full_id: string
    username: string | null
    password: string | null
}

export default function GenerateLinkButton({
    data,
    ttlSeconds = 600,      // อายุลิงก์ 10 นาที
    singleUse = true,       // ลิงก์ใช้ครั้งเดียว
}: {
    data: CredMinimal
    ttlSeconds?: number
    singleUse?: boolean
    label?: string
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const makeLink = async () => {
        setError(null)
        setLoading(true)
        try {
            const res = await fetch(`/cred/link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_id: data.full_id,
                    username: data.username,
                    password: data.password,
                    ttl_seconds: ttlSeconds,
                    single_use: singleUse,
                }),
            })
            const text = await res.text()
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
            const json = JSON.parse(text) as { url: string }

            // copy to clipboard
            try {
                await navigator.clipboard.writeText(json.url)
                // แจ้งแบบง่าย ๆ
                alert("คัดลอกลิงก์เรียบร้อย:\n" + json.url)
            } catch {
                // ถ้าคัดลอกไม่ได้ก็แสดงลิงก์ให้เอง
                prompt("คัดลอกลิงก์นี้:", json.url)
            }
        } catch (e: any) {
            setError(e?.message || "เจนลิงก์ไม่สำเร็จ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-start gap-1">
            <button
                onClick={makeLink}
                disabled={loading}
                className="rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-800 
             hover:bg-neutral-200 disabled:opacity-60"
            >
                {loading ? "กำลังเจน..." : "ขอลิงก์ใหม่"}
            </button>

            {error && <span className="text-[11px] text-red-600">Error: {error}</span>}
        </div>
    )
}
