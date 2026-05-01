interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
}

export function StatCard({
  label,
  value,
  icon,
  accent = "text-blue-400",
}: StatCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/8 bg-white/5 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <span className={`${accent} opacity-70`}>{icon}</span>
      </div>
      <span className={`mt-3 text-3xl font-bold ${accent}`}>{value}</span>
    </div>
  );
}