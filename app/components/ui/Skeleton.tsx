export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <SkeletonLine className="h-4 w-1/3" />
      <SkeletonLine className="h-3 w-full" />
      <SkeletonLine className="h-3 w-4/5" />
      <SkeletonLine className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Hero skeleton */}
      <div className="bg-indigo-50 rounded-2xl p-5 space-y-3">
        <SkeletonLine className="h-6 w-2/5 bg-indigo-200" />
        <SkeletonLine className="h-4 w-3/5 bg-indigo-100" />
      </div>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
