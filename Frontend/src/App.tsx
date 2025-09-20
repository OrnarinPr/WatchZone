// src/App.tsx
import { useEffect, useMemo, useState } from "react"
import { supabase } from "./lib/supabaseClient"
import Header from "./components/Header"
import Controls from "./components/Controls"
import IdTable from "./components/IdTable"
import CredentialModal, { type CredData } from "./components/CredentialModal"
import type { IdType, Row, Status } from "./types"

export default function App() {
  const [types, setTypes] = useState<IdType[]>([])
  const [typeCode, setTypeCode] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all")
  const [duration, setDuration] = useState<number>(7) // 7 | 14 | 30
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  // modal
  const [openModal, setOpenModal] = useState(false)
  const [cred, setCred] = useState<CredData | null>(null)

  // ---------- load types ----------
  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from("id_types")
        .select("code,name")
        .order("code")
      if (!error && data) {
        setTypes(data)
        if (data.length && !typeCode) setTypeCode(data[0].code)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- fetch list ----------
  const fetchList = async () => {
    if (!typeCode) return
    setLoading(true)
    let q = supabase
      .from("v_ids_with_code")
      .select("*")
      .eq("code", typeCode)
      .order("id", { ascending: true })
    if (statusFilter !== "all") q = q.eq("status", statusFilter)
    const { data, error } = await q
    setRows(error ? [] : ((data || []) as Row[]))
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeCode, statusFilter])

  // ---------- realtime (fixed cleanup: no Promise return) ----------
  useEffect(() => {
    const channel = supabase
      .channel("ids-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ids" },
        () => fetchList()
      )
      .subscribe()

    return () => {
      // ห้ามคืน Promise ให้ React; เรียกแล้วไม่ await
      void channel.unsubscribe()
      // หรือจะใช้: void supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeCode, statusFilter])

  // header info
  const header = useMemo(() => types.find(t => t.code === typeCode), [types, typeCode])

  // ---------- actions ----------
  const releaseId = async (id: number) => {
    setBusyId(id)
    const { error } = await supabase.rpc("fn_release_rental", { p_id: id })
    if (error) alert(error.message)
    setBusyId(null)
    await fetchList()
  }

  const extendId = async (id: number, addDays: number) => {
    setBusyId(id)
    const { error } = await supabase.rpc("fn_extend_rental", { p_id: id, p_add_days: addDays })
    if (error) alert(error.message)
    setBusyId(null)
    await fetchList()
  }

  const remaining = (row: Row) => {
    if (!row.lease_expires_at) return "-"
    const end = new Date(row.lease_expires_at).getTime()
    const diffMs = end - Date.now()
    if (diffMs <= 0) return "หมดอายุแล้ว"
    const days = Math.floor(diffMs / (24 * 3600 * 1000))
    const hours = Math.floor((diffMs % (24 * 3600 * 1000)) / (3600 * 1000))
    return `${days} วัน ${hours} ชม.`
  }

  // ปุ่มยืนยันล่างขวา: จอง + popup credential
  const handleConfirm = async () => {
    if (!typeCode) return
    setLoading(true)

    // จองตัวแรกของ type (รวมตัวที่หมดเวลาแล้ว)
    const { data: reservedId, error } = await supabase.rpc("fn_claim_first_available", {
      p_code: typeCode,
      p_days: duration, // 7 | 14 | 30
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    if (!reservedId) {
      alert("ไม่มี ID ที่จองได้ใน type นี้")
      setLoading(false)
      return
    }

    // ดึง credential มาโชว์ใน popup
    const { data: detail, error: e2 } = await supabase
      .from("v_ids_with_code")
      .select("full_id,username,password")
      .eq("id", reservedId as number)
      .single()

    if (!e2 && detail) {
      setCred({
        full_id: detail.full_id,
        username: detail.username,
        password: detail.password,
      })
      setOpenModal(true)
    } else if (e2) {
      alert(e2.message)
    }

    await fetchList()
    setLoading(false)
  }

  // refresh นับถอยหลังทุก 1 นาที
  useEffect(() => {
    const t = setInterval(() => setRows(r => [...r]), 60_000)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Header subtitle={header ? `${header.name}` : "กำลังโหลดชนิด…"} />

      <Controls
        types={types}
        typeCode={typeCode}
        setTypeCode={setTypeCode}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        duration={duration}
        setDuration={setDuration as any} // 7/14/30 เท่านั้นจากปุ่ม
        onClaim={handleConfirm}
        loading={loading}
      />

      <IdTable
        rows={rows}
        loading={loading}
        busyId={busyId}
        onRelease={releaseId}
        onExtend={extendId}
        remaining={remaining}
      />

      <CredentialModal open={openModal} data={cred} onClose={() => setOpenModal(false)} />
    </main>
  )
}
