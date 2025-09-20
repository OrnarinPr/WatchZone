import type { Status } from "../types"

export default function ActionButtons({
  id, status, busy, onRelease, onExtend,
}: {
  id: number; status: Status; busy: boolean;
  onRelease: (id: number) => void;
  onExtend: (id: number, addDays: number) => void;
}) {
  const base = "rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-60"
  return (
    <div className="flex items-center gap-2">
      {status !== "available" && (
        <button onClick={() => onRelease(id)} className={base} disabled={busy}>ปล่อย</button>
      )}
      {status === "in_use" && (
        <>
          <button onClick={() => onExtend(id, 7)} className={base} disabled={busy}>+7</button>
          <button onClick={() => onExtend(id, 14)} className={base} disabled={busy}>+14</button>
          <button onClick={() => onExtend(id, 30)} className={base} disabled={busy}>+30</button>
        </>
      )}
    </div>
  )
}
