// src/components/DurationPicker.tsx
const DURATIONS = [7, 14, 30] as const;

export default function DurationPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (d: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {DURATIONS.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={[
            "rounded-md border px-3 py-2 text-sm",
            value === d
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white hover:bg-neutral-50",
          ].join(" ")}
        >
          {d} วัน
        </button>
      ))}
    </div>
  );
}
