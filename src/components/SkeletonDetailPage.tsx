export function SkeletonDetailPage() {
  return (
    <div data-testid="skeleton-detail" className="animate-pulse space-y-6">
      <div className="h-4 w-24 rounded-lg bg-white/10" />
      <div className="space-y-2">
        <div className="h-8 w-1/2 rounded-lg bg-white/10" />
        <div className="h-4 w-1/3 rounded bg-white/8" />
        <div className="h-4 w-1/4 rounded bg-white/8" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 rounded-2xl bg-white/5" />
        <div className="h-72 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}