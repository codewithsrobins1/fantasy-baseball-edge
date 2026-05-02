'use client'
import { CAT_COLORS } from '../lib/constants'

function PickupCard({ p, isSP }) {
  const cats = p.cats || []
  return (
    <div className={[
      'bg-bg-panel border border-border-dim rounded-xl p-4 mb-3',
      isSP ? 'border-l-[3px] border-l-accent-amber' : 'border-l-[3px] border-l-green-main',
    ].join(' ')}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 mr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[17px] font-black text-text-primary">{p.name}</span>
            {p.hot && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold font-mono bg-[#431407] text-[#fb923c]">
                🔥 HOT
              </span>
            )}
            {isSP && p.type && (
              <span className={[
                'text-[10px] px-1.5 py-0.5 rounded font-bold font-mono',
                p.type === 'stream'
                  ? 'bg-[#0c1f3a] text-accent-blue'
                  : 'bg-[#1a0d37] text-accent-purple',
              ].join(' ')}>
                {p.type === 'stream' ? '⚡ STREAM' : '📦 STASH'}
              </span>
            )}
          </div>
          <div className="font-mono text-[11px] text-text-muted mt-0.5">
            {isSP ? 'SP' : p.pos} · {p.team}{p.ownPct ? ` · ${p.ownPct} owned` : ''}
          </div>
        </div>
        {/* Cat tags */}
        <div className="flex flex-wrap gap-1 justify-end max-w-[90px]">
          {cats.map(c => (
            <span
              key={c}
              className="text-[10px] px-1.5 py-0.5 rounded font-bold font-mono border"
              style={{
                background: `${CAT_COLORS[c] || '#888'}18`,
                color: CAT_COLORS[c] || '#888',
                borderColor: `${CAT_COLORS[c] || '#888'}35`,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Why */}
      <p className="text-[13px] text-text-secondary leading-relaxed">{p.why}</p>

      {/* Next start (SP only) */}
      {isSP && p.nextStart && (
        <div className="mt-2.5 flex items-center gap-2 bg-bg-card rounded-lg px-3 py-2 font-mono text-[11px] text-text-muted">
          <span>📅</span>
          <span>Next: {p.nextStart}</span>
          {p.favorable && (
            <span className="ml-auto text-green-main font-bold">✓ Favorable</span>
          )}
        </div>
      )}
    </div>
  )
}

export default function PickupsTab({ analysis }) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <div className="text-5xl mb-4">💡</div>
        <div className="text-xl font-bold text-text-primary mb-2">No Recommendations Yet</div>
        <div className="text-[14px] text-center max-w-[240px]">Analyze your roster to see targeted waiver wire pickups</div>
      </div>
    )
  }

  return (
    <div className="pb-4 fade-in">
      {/* Hitter pickups */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim">⚔️ Hitter Pickups</span>
          <span className="text-[10px] font-mono bg-green-faint text-green-main border border-green-dark px-1.5 py-0.5 rounded">
            {(analysis.hitterPickups || []).length} targets
          </span>
        </div>
        {(analysis.hitterPickups || []).map((p, i) => (
          <PickupCard key={i} p={p} isSP={false} />
        ))}
      </div>

      {/* SP pickups */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim">⭐ SP Pickups</span>
          <span className="text-[10px] font-mono bg-[#1a1200] text-accent-amber border border-accent-amber/30 px-1.5 py-0.5 rounded font-bold">
            PRIORITY
          </span>
        </div>
        {(analysis.spPickups || []).map((p, i) => (
          <PickupCard key={i} p={p} isSP={true} />
        ))}
      </div>
    </div>
  )
}
