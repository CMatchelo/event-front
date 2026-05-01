export function CheckinBar({
  checkin,
  expected,
}: {
  checkin: number;
  expected: number;
}) {
  const pct = expected > 0 ? Math.min((checkin / expected) * 100, 100) : 0;
  return (
    <div className="mt-1 h-1.5 w-full rounded-full bg-white/5">
      <div
        className="h-1.5 rounded-full bg-blue-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
