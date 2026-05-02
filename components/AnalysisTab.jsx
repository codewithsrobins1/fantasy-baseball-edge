'use client'
import { ALL_CATS, CAT_COLORS } from '../lib/constants'

export default function AnalysisTab({ analysis }) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <div className="text-5xl mb-4">📊</div>
        <div className="text-xl font-bold text-text-primary mb-2">No Analysis Yet</div>
        <div className="text-[14px] text-center max-w-[240px]">Build your roster and run analysis to see category breakdown</div>
      </div>
    )
  }

  const r   = analysis.categoryRatings || {}
  const w3  = analysis.weakest3  || []
  const s3  = analysis.strongest3 || []

  const hitCats = ALL_CATS.filter(c => c.t === 'hit')
  const pitCats = ALL_CATS.filter(c => c.t === 'pit')

  function CatBar({ cat }) {
    const val    = r[cat.k] || 5
    const isWeak = w3.includes(cat.k)
    const isStr  = s3.includes(cat.k)
    const col    = isWeak ? '#f87171' : isStr ? '#22c55e' : (CAT_COLORS[cat.k] || '#64748b')

    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-medium" style={{ color: col }}>{cat.k}</span>
            <span className="text-[12px] text-text-muted">{cat.l}</span>
            {isWeak && <span className="text-[9px] font-mono bg-accent-red/15 text-accent-red border border-accent-red/25 px-1 py-px rounded">WEAK</span>}
            {isStr  && <span className="text-[9px] font-mono bg-green-faint text-green-main border border-green-dark/40 px-1 py-px rounded">STRONG</span>}
          </div>
          <span className="font-mono text-[11px] text-text-muted">{val}/10</span>
        </div>
        <div className="h-[5px] bg-border-dim rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bar-fill"
            style={{ width: `${val * 10}%`, background: col }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="pb-4 fade-in">
      {/* Team summary */}
      {analysis.teamSummary && (
        <div className="bg-bg-panel border border-border-dim rounded-2xl p-4 mb-4">
          <div className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim mb-2">Team Summary</div>
          <p className="text-[14px] text-text-secondary leading-relaxed">{analysis.teamSummary}</p>
        </div>
      )}

      {/* Strength / Weakness cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-bg-panel border border-[#1a3320] rounded-xl p-3">
          <div className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim mb-2.5">💪 Strongest</div>
          {s3.map(k => {
            const cat = ALL_CATS.find(x => x.k === k)
            return (
              <div key={k} className="flex items-center gap-1.5 mb-2 last:mb-0">
                <span className="text-green-main text-sm">↑</span>
                <span className="font-mono text-[11px] text-green-main font-medium">{k}</span>
                <span className="text-[12px] text-text-muted truncate">{cat?.l}</span>
              </div>
            )
          })}
        </div>
        <div className="bg-bg-panel border border-[#3a1515] rounded-xl p-3">
          <div className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim mb-2.5">⚠️ Needs Work</div>
          {w3.map(k => {
            const cat = ALL_CATS.find(x => x.k === k)
            return (
              <div key={k} className="flex items-center gap-1.5 mb-2 last:mb-0">
                <span className="text-accent-red text-sm">↓</span>
                <span className="font-mono text-[11px] text-accent-red font-medium">{k}</span>
                <span className="text-[12px] text-text-muted truncate">{cat?.l}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hitting categories */}
      <div className="bg-bg-panel border border-border-dim rounded-xl p-4 mb-3">
        <div className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim mb-3">
          ⚔️ Hitting Categories
        </div>
        {hitCats.map(cat => <CatBar key={cat.k} cat={cat} />)}
      </div>

      {/* Pitching categories */}
      <div className="bg-bg-panel border border-border-dim rounded-xl p-4">
        <div className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim mb-3">
          ⚡ Pitching Categories
        </div>
        {pitCats.map(cat => <CatBar key={cat.k} cat={cat} />)}
      </div>
    </div>
  )
}
