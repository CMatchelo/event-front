export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/8 bg-white/5 p-5">
      <div className="flex justify-between gap-3">
        <div className="h-4 w-2/3 rounded-lg bg-white/10" />
        <div className="h-5 w-16 rounded-full bg-white/10" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/2 rounded bg-white/8" />
        <div className="h-3 w-2/5 rounded bg-white/8" />
      </div>
      <div className="my-4 h-px bg-white/5" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded bg-white/8" />
          <div className="h-3 w-10 rounded bg-white/8" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded bg-white/8" />
          <div className="h-3 w-10 rounded bg-white/8" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/8" />
      </div>
      <div className="mt-5 h-8 w-full rounded-xl bg-white/8" />
    </div>
  );
}