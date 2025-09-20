import type { IdType, Status } from "../types"

const PRESETS = [7, 14, 30] as const
type Preset = typeof PRESETS[number]

export default function Controls({
  types,
  typeCode,
  setTypeCode,
  statusFilter,
  setStatusFilter,
  duration,
  setDuration,
  onClaim,
  loading,
}: {
  types: IdType[]
  typeCode: string
  setTypeCode: (c: string) => void
  statusFilter: "all" | Status
  setStatusFilter: (s: "all" | Status) => void
  duration: number
  setDuration: (d: Preset) => void
  onClaim: () => void
  loading?: boolean
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid gap-6 p-5 md:grid-cols-[1fr,1fr,auto]">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-neutral-500">ประเภทไอดี</label>
            <select
              className="w-full rounded-lg border-0 bg-neutral-200 px-3 py-2 text-[15px] outline-none"
              value={typeCode}
              onChange={(e) => setTypeCode(e.target.value)}
            >
              {types.map(t => (
                <option key={t.code} value={t.code}>
                  {t.code} — {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-neutral-500">สถานะ</label>
            <select
              className="w-full rounded-lg border-0 bg-neutral-200 px-3 py-2 text-[15px] outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="available">available</option>
              <option value="in_use">in_use</option>
              <option value="expired">expired</option>
              <option value="retired">retired</option>
            </select>
          </div>

          <div className="space-y-1 md:col-span-3">
            <label className="block text-xs font-medium text-neutral-500">เลือกจำนวนวันเช่า</label>
            <div className="flex flex-wrap items-center gap-3">
              {PRESETS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={[
                    "rounded-md border px-3 py-2 text-sm",
                    duration === d
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white hover:bg-neutral-50",
                  ].join(" ")}
                >
                  {d} วัน
                </button>
              ))}
              <div className="ml-auto">
                <button
                  onClick={onClaim}
                  disabled={loading}
                  className="h-10 w-56 rounded-md bg-black text-sm font-medium text-white shadow-sm hover:bg-black/90 disabled:opacity-60"
                >
                  {loading ? "กำลังโหลด…" : `จอง 1 อัน (${duration} วัน)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
