// src/components/IdTable.tsx
import type { Row } from "../types";
import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

export default function IdTable({
  rows,
  loading,
  busyId,
  onRelease,
  onExtend,
  remaining,
}: {
  rows: Row[];
  loading: boolean;
  busyId: number | null;
  onRelease: (id: number) => void;
  onExtend: (id: number, addDays: number) => void;
  remaining: (row: Row) => string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse">
            <thead className="bg-neutral-50">
              <tr className="border-b border-neutral-200">
                {["Full ID", "Status", "Username", "Password", "เริ่มใช้", "หมดอายุ", "เหลือ", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-neutral-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => {
                const showTimes = r.status === "in_use"; // แสดงเวลาเฉพาะตอน in_use
                return (
                  <tr
                    key={r.id}
                    className={[
                      "hover:bg-neutral-50",
                      idx !== rows.length - 1 ? "border-b border-neutral-200" : "",
                    ].join(" ")}
                  >
                    <td className="px-5 py-4 font-mono text-sm text-neutral-800 whitespace-nowrap">
                      {r.full_id}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">{r.username ?? "-"}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{r.password ?? "-"}</td>

                    {/* เริ่มใช้ */}
                    <td className="px-5 py-4 text-neutral-600 text-sm whitespace-nowrap">
                      {showTimes && r.claimed_at ? new Date(r.claimed_at).toLocaleString() : "-"}
                    </td>

                    {/* หมดอายุ */}
                    <td className="px-5 py-4 text-neutral-600 text-sm whitespace-nowrap">
                      {showTimes && r.lease_expires_at ? new Date(r.lease_expires_at).toLocaleString() : "-"}
                    </td>

                    {/* เหลือ */}
                    <td className="px-5 py-4 text-sm whitespace-nowrap">
                      {showTimes ? remaining(r) : "-"}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <ActionButtons
                        id={r.id}
                        status={r.status}
                        busy={busyId === r.id}
                        onRelease={onRelease}
                        onExtend={onExtend}
                      />
                    </td>
                  </tr>
                );
              })}

              {!rows.length && !loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">
                    กำลังโหลด…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
