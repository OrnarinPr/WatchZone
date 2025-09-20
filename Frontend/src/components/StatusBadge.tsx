import type { Status } from "../types"

const tone: Record<Status, string> = {
  available: "bg-emerald-100 text-emerald-800",
  in_use: "bg-blue-100 text-blue-800",
  expired: "bg-rose-100 text-rose-800",
  retired: "bg-neutral-200 text-neutral-700",
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tone[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
