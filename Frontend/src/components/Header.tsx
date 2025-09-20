interface Props {
  title?: string
  subtitle?: string // ← จะส่ง name ของ Type มา เช่น "Type M"
}

export default function Header({
  title = "WatchZone",
  subtitle,
}: Props) {
  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <img
            src="/WZ.png"
            alt="WatchZone Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-sm font-medium text-neutral-700">{title}</span>
        </div>

        {/* Subtitle = Type Name */}
        {subtitle && (
          <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.01em]">
            {subtitle}
          </h2>
        )}
      </div>
    </header>
  )
}
