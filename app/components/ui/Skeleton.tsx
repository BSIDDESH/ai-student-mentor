// Dark-canvas skeleton primitives + full per-tab skeletons.
// Every skeleton mirrors the exact card hierarchy of its real counterpart.

function Pulse({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "rgba(255,255,255,0.05)", ...style }}
      aria-hidden
    />
  );
}

// ── Full initial dashboard skeleton ────────────────────────────────────────────

export function SkeletonDashboard() {
  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ background: "var(--canvas, #05070b)" }}
      role="status"
      aria-label="Loading dashboard…"
    >
      <aside
        className="hidden md:flex flex-col w-64 min-h-screen shrink-0"
        style={{ background: "var(--surface, #0c0f14)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="px-6 py-5 space-y-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <Pulse className="w-8 h-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Pulse className="h-4 w-20" />
              <Pulse className="h-3 w-28" />
            </div>
          </div>
        </div>
        <div className="px-5 py-4 space-y-2">
          {[1, 2, 3, 4].map((i) => <Pulse key={i} className="h-10 w-full rounded-xl" />)}
        </div>
      </aside>

      <main className="flex-1 min-w-0 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          <SkeletonHero />
          <SkeletonFocusCard />
          <SkeletonSubjectCard />
        </div>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden h-16 items-center px-4 gap-2"
        style={{ background: "var(--surface, #0c0f14)", borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
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
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--surface, #0c0f14)", border: "1px solid rgba(255,255,255,0.07)" }}
      aria-hidden
    >
      <div className="px-6 py-3 flex justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Pulse className="h-3 w-36" />
        <Pulse className="h-3 w-20" />
      </div>
      <div className="flex items-center gap-6 px-6 py-5">
        <Pulse className="w-28 h-28 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Pulse className="h-10 w-40" />
          <div className="flex gap-2">
            <Pulse className="h-6 w-20 rounded-md" />
            <Pulse className="h-6 w-16 rounded-md" />
          </div>
          <Pulse className="h-px w-full" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="flex gap-4">
            <div className="space-y-1.5">
              <Pulse className="h-3 w-12" />
              <Pulse className="h-7 w-16" />
            </div>
            <div className="space-y-1.5">
              <Pulse className="h-3 w-16" />
              <Pulse className="h-7 w-12" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Pulse className="h-4 w-64" />
      </div>
    </div>
  );
}

function SkeletonFocusCard() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(255,107,107,0.04)", borderLeft: "3px solid rgba(255,107,107,0.25)", border: "1px solid rgba(255,107,107,0.12)" }}
      aria-hidden
    >
      <div className="px-5 py-3 flex justify-between" style={{ borderBottom: "1px solid rgba(255,107,107,0.12)" }}>
        <Pulse className="h-3 w-40" />
        <Pulse className="h-3 w-24" />
      </div>
      <div className="p-4 space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-lg px-4 py-4" style={{ background: "var(--surface, #0c0f14)", border: "1px solid rgba(255,107,107,0.12)" }}>
            <div className="flex items-center gap-4">
              <Pulse className="w-14 h-14 rounded-lg" />
              <div className="space-y-2"><Pulse className="h-4 w-24" /><Pulse className="h-3 w-16" /></div>
            </div>
            <Pulse className="h-8 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonSubjectCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface, #0c0f14)", border: "1px solid rgba(255,255,255,0.07)" }} aria-hidden>
      <div className="flex justify-between px-5 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3"><Pulse className="w-6 h-6 rounded-lg" /><Pulse className="h-4 w-24" /></div>
        <Pulse className="h-5 w-12" />
      </div>
      <div className="px-5 py-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex justify-between mb-2"><Pulse className="h-4 w-28" /><Pulse className="h-5 w-12" /></div>
            <Pulse className="h-1.5 w-full rounded-full" />
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
      className="flex flex-col max-w-2xl mx-auto"
      style={{ height: "calc(100dvh - 5rem)" }}
      role="status"
      aria-label="Loading mentor chat…"
    >
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: "var(--surface-2, #111520)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Pulse className="w-9 h-9 rounded-full" />
        <div className="space-y-1.5"><Pulse className="h-4 w-20" /><Pulse className="h-3 w-28" /></div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-hidden" style={{ background: "var(--canvas, #05070b)" }}>
        <div className="flex items-end gap-2">
          <Pulse className="w-7 h-7 rounded-full shrink-0" />
          <Pulse className="h-16 w-3/4 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex items-end gap-2 flex-row-reverse">
          <Pulse className="h-10 w-1/2 rounded-2xl rounded-br-sm" style={{ background: "rgba(0,212,255,0.07)" }} />
        </div>
        <div className="flex items-end gap-2">
          <Pulse className="w-7 h-7 rounded-full shrink-0" />
          <Pulse className="h-20 w-2/3 rounded-2xl rounded-bl-sm" />
        </div>
        {/* Typing dots */}
        <div className="flex items-end gap-2">
          <Pulse className="w-7 h-7 rounded-full shrink-0" />
          <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: "var(--surface, #0c0f14)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full inline-block animate-bounce" style={{ background: "#00d4ff", animationDelay: `${i * 0.15}s`, opacity: 0.5 }} />)}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3" style={{ background: "var(--surface, #0c0f14)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--surface-2, #111520)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <Pulse className="flex-1 h-8" />
          <Pulse className="w-8 h-8 rounded-lg shrink-0" style={{ background: "rgba(0,212,255,0.08)" }} />
        </div>
      </div>
    </div>
  );
}

// ── Quiz skeleton ─────────────────────────────────────────────────────────────

export function SkeletonQuiz() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6" role="status" aria-label="Loading quiz…">
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface, #0c0f14)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-5 py-3 flex justify-between" style={{ background: "var(--surface-2, #111520)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Pulse className="h-6 w-28 rounded-md" />
          <div className="flex gap-1.5">{[1,2,3,4,5].map((i) => <Pulse key={i} className="w-2 h-2 rounded-full" />)}</div>
        </div>
        <div className="p-6 space-y-3">
          <Pulse className="h-6 w-full" /><Pulse className="h-6 w-4/5" />
          <div className="space-y-2.5 pt-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "var(--surface-2, #111520)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Pulse className="w-6 h-6 rounded-md shrink-0" />
                <Pulse className={`h-4 ${i % 2 === 0 ? "w-36" : "w-48"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Wellness skeleton ─────────────────────────────────────────────────────────

export function SkeletonWellness() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4" role="status" aria-label="Loading wellness…">
      <Pulse className="h-3 w-40 rounded" />
      <div className="rounded-xl flex items-center justify-between px-5 py-4" style={{ background: "var(--surface, #0c0f14)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-4">
          <Pulse className="w-12 h-12 rounded-xl" />
          <div className="space-y-2"><Pulse className="h-3 w-28" /><Pulse className="h-7 w-20" /></div>
        </div>
        <Pulse className="h-8 w-28 rounded-lg" />
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface, #0c0f14)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-5 py-3" style={{ background: "var(--surface-2, #111520)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Pulse className="h-3 w-32" />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {Array.from({ length: 8 }).map((_, i) => <Pulse key={i} className="aspect-square rounded-xl" />)}
          </div>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface, #0c0f14)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-5 py-3" style={{ background: "var(--surface-2, #111520)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Pulse className="h-3 w-40" />
        </div>
        <div className="p-4 space-y-2">
          {[1,2,3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg" style={{ background: "var(--surface-2, #111520)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3"><Pulse className="w-10 h-10 rounded-xl" /><div className="space-y-1.5"><Pulse className="h-4 w-32" /><Pulse className="h-3 w-44" /></div></div>
              <Pulse className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
