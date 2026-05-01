interface LegendProps {
  payload?: { value: string; color: string }[];
}

export function CustomLegend({ payload }: LegendProps) {
  if (!payload) return null;
  return (
    <div className="flex justify-center gap-6 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-xs text-slate-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
