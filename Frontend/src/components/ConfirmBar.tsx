export default function ConfirmBar({
  label = "ยืนยันการจอง",
  onConfirm,
  disabled,
}: {
  label?: string
  onConfirm: () => void
  disabled?: boolean
}) {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={onConfirm}
        disabled={disabled}
        className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-black/90 disabled:opacity-60"
      >
        {label}
      </button>
    </div>
  )
}
