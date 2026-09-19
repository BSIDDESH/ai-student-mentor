// components/ui/Skeleton.tsx
// Skeleton loading screens for every major tab.
// Each skeleton precisely mirrors the real component's layout so the
// transition between loading and rendered is visually seamless.

function Pulse({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse bg-stone-200 rounded-xl ${className}`}
      style={style}
      aria-hidden
    />
  );
}

// ── Full dashboard skeleton (initial app load) ─────────────────────────────────

export function SkeletonDashboard() {
  return (
    <div
      className="min-h-screen flex flex-col md:flex-row bg-[#faf9f7]"
      role="status"
      aria-label="Loading your dashboard…"
    >
      {/* Sidebar stub */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-screen shrink-0 border-r bg-white"
        style={{ borderColor: "#e7e5e4" }}
      >
        <div className="px-6 py-6 border-b border-stone-100 flex items-center gap-3">
          <Pulse className="w-9 h-9 rounded-xl" />
          <div className="space-y-1.5">
            <Pulse className="h-4 w-20" />
            <Pulse className="h-3 w-28" />
          </div>
        </div>
        <div className="px-4 py-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Pulse key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </aside>

      {/* Main content stub */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          <SkeletonHero />
          <SkeletonFocusCard />
          <SkeletonSubjectCard />
          <SkeletonGoals />
        </div>
      </main>

      {/* Mobile bottom bar stub */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex md:hidden h-16 items-center px-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <Pulse className="w-5 h-5 rounded-lg" />
            <Pulse className="h-2.5 w-10 rounded" />
          </div>
        ))}
      </nav>
    </div>
  );
}

// ── Hero skeleton (DayArcHero) ─────────────────────────────────────────────────

export function SkeletonHero() {
  return (
    <div
      className="rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-50 p-6 overflow-hidden"
      aria-hidden
    >
      {/* Top row */}
      <div className="flex justify-between items-start mb-6">
        <Pulse className="h-4 w-32" />
        <Pulse className="h-16 w-16 rounded-2xl" />
      </div>

      {/* Name block */}
      <div className="space-y-3 mb-6">
        <Pulse className="h-4 w-24" />
        <Pulse className="h-10 w-48" />
        <Pulse className="h-6 w-20 rounded-full" />
      </div>

      {/* XP bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Pulse className="h-4 w-28" />
          <Pulse className="h-4 w-20" />
        </div>
        <Pulse className="h-2.5 w-full rounded-full" />
      </div>
    </div>
  );
}

// ── Focus card skeleton (WeakTopicFlags) ───────────────────────────────────────

function SkeletonFocusCard() {
  return (
    <div
      className="rounded-xl bg-rose-50 border border-rose-200 overflow-hidden"
      aria-hidden
    >
      <div className="h-1.5 bg-rose-200 w-full" />
      <div className="px-6 py-5">
        <div className="flex justify-between mb-4">
          <Pulse className="h-5 w-24 bg-rose-200" />
          <Pulse className="h-4 w-36 bg-rose-200" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-rose-100 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Pulse className="w-14 h-14 rounded-xl bg-rose-100" />
                <div className="space-y-1.5">
                  <Pulse className="h-4 w-24" />
                  <Pulse className="h-3 w-16" />
                </div>
              </div>
              <Pulse className="h-8 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Subject progress card skeleton ─────────────────────────────────────────────

function SkeletonSubjectCard() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden" aria-hidden>
      <div className="flex justify-between px-6 py-4 bg-stone-50 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <Pulse className="w-7 h-7 rounded-lg" />
          <Pulse className="h-5 w-28" />
        </div>
        <Pulse className="h-5 w-14" />
      </div>
      <div className="px-6 py-4 space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <Pulse className="h-4 w-24" />
              <Pulse className="h-5 w-12" />
            </div>
            <Pulse className="h-2.5 w-full rounded-full" />
            <Pulse className="h-3 w-16 mt-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Daily goals skeleton ───────────────────────────────────────────────────────

function SkeletonGoals() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6" aria-hidden>
      <div className="flex justify-between mb-4">
        <Pulse className="h-5 w-28" />
        <Pulse className="h-6 w-14 rounded-full" />
      </div>
      <Pulse className="h-2 w-full rounded-full mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Pulse className="w-6 h-6 rounded-full shrink-0" />
            <Pulse className={`h-4 ${i % 2 === 0 ? "w-48" : "w-56"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chat skeleton ─────────────────────────────────────────────────────────────

export function SkeletonChat() {
  return (
    <div
      className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-1.5rem)] max-w-2xl mx-auto"
      role="status"
      aria-label="Loading mentor chat…"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-100 bg-white flex items-center gap-3">
        <Pulse className="w-9 h-9 rounded-full" />
        <div className="space-y-1.5">
          <Pulse className="h-4 w-20" />
          <Pulse className="h-3 w-12" />
        </div>
      </div>

      {/* Bubbles */}
      <div className="flex-1 overflow-hidden px-4 py-4 space-y-4 bg-slate-50">
        {/* Mentor bubble */}
        <div className="flex items-end gap-2">
          <Pulse className="w-7 h-7 rounded-full shrink-0" />
          <Pulse className="h-16 w-3/4 rounded-2xl rounded-bl-sm" />
        </div>
        {/* User bubble */}
        <div className="flex items-end gap-2 flex-row-reverse">
          <Pulse className="h-10 w-1/2 rounded-2xl rounded-br-sm bg-indigo-100" />
        </div>
        {/* Mentor bubble */}
        <div className="flex items-end gap-2">
          <Pulse className="w-7 h-7 rounded-full shrink-0" />
          <Pulse className="h-20 w-2/3 rounded-2xl rounded-bl-sm" />
        </div>
        {/* Typing indicator */}
        <div className="flex items-end gap-2">
          <Pulse className="w-7 h-7 rounded-full shrink-0" />
          <div className="bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-300 inline-block animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input area stub */}
      <div className="px-4 py-3 bg-white border-t border-stone-100">
        <div className="flex items-center gap-2 bg-stone-50 rounded-2xl border border-stone-200 px-3 py-2">
          <Pulse className="flex-1 h-8" />
          <Pulse className="w-8 h-8 rounded-xl shrink-0 bg-indigo-100" />
        </div>
      </div>
    </div>
  );
}

// ── Quiz skeleton ─────────────────────────────────────────────────────────────

export function SkeletonQuiz() {
  return (
    <div
      className="max-w-2xl mx-auto px-4 py-6"
      role="status"
      aria-label="Loading quiz…"
    >
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        {/* Progress row */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
          <div className="space-y-2">
            <Pulse className="h-6 w-24 rounded-full" />
            <Pulse className="h-4 w-28" />
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Pulse key={i} className="w-3 h-3 rounded-full" />
            ))}
          </div>
        </div>

        {/* Question text */}
        <div className="space-y-2 mb-6">
          <Pulse className="h-6 w-full" />
          <Pulse className="h-6 w-4/5" />
        </div>

        {/* 4 option buttons */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-stone-100"
            >
              <Pulse className="w-7 h-7 rounded-lg shrink-0" />
              <Pulse className={`h-4 ${i % 2 === 0 ? "w-32" : "w-44"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Wellness skeleton ─────────────────────────────────────────────────────────

export function SkeletonWellness() {
  return (
    <div
      className="max-w-2xl mx-auto px-4 py-6 space-y-6"
      role="status"
      aria-label="Loading wellness panel…"
    >
      {/* Timer card */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Pulse className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Pulse className="h-3 w-32" />
            <Pulse className="h-7 w-24" />
          </div>
        </div>
        <Pulse className="h-8 w-36 rounded-full" />
      </div>

      {/* Hydration card */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Pulse className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Pulse className="h-4 w-32" />
              <Pulse className="h-3 w-44" />
            </div>
          </div>
          <Pulse className="h-7 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 my-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Pulse key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Activities card */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Pulse className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Pulse className="h-4 w-40" />
            <Pulse className="h-3 w-56" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-stone-100 bg-stone-50">
              <div className="flex items-center gap-3.5">
                <Pulse className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5">
                  <Pulse className="h-4 w-36" />
                  <Pulse className="h-3 w-52" />
                </div>
              </div>
              <Pulse className="h-9 w-28 rounded-xl shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
