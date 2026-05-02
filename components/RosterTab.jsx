'use client'
import PlayerSlot from './PlayerSlot'
import { HITTER_SLOTS, PITCHER_SLOTS } from '../lib/constants'

export default function RosterTab({ roster, onAdd, onRemove, allPlayers, pLoad, onAnalyze, analyzing, error }) {
  const count = Object.values(roster).filter(Boolean).length

  return (
    <div className="pb-4">
      {/* Hitters */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim">⚔️ Hitters</span>
          <span className="text-[10px] font-mono text-text-ghost">9 active · 3 bench</span>
        </div>
        <div className="bg-bg-panel rounded-xl border border-border-dim p-3">
          {HITTER_SLOTS.map(s => (
            <PlayerSlot key={s.id} slot={s} player={roster[s.id]} onAdd={onAdd} onRemove={onRemove} allPlayers={allPlayers} />
          ))}
        </div>
      </div>

      {/* Pitchers */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim">⚡ Pitchers</span>
          <span className="text-[10px] font-mono text-text-ghost">7 active · 2 bench</span>
        </div>
        <div className="bg-bg-panel rounded-xl border border-border-dim p-3">
          {PITCHER_SLOTS.map(s => (
            <PlayerSlot key={s.id} slot={s} player={roster[s.id]} onAdd={onAdd} onRemove={onRemove} allPlayers={allPlayers} />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-[#1a0909] border border-accent-red/25 rounded-xl text-accent-red text-[14px]">
          {error}
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={onAnalyze}
        disabled={analyzing || pLoad}
        className={[
          'w-full py-4 rounded-xl font-bold text-[18px] tracking-wide uppercase transition-all pressable',
          analyzing || pLoad
            ? 'bg-border-dim text-text-dim cursor-not-allowed'
            : 'bg-green-main text-black active:scale-[0.98]',
        ].join(' ')}
      >
        {analyzing ? '⏳ Analyzing...' : '🔍 Analyze My Team →'}
      </button>

      <div className="mt-3 text-center font-mono text-[11px] text-text-dim">
        {pLoad
          ? '⏳ Loading MLB player database...'
          : `${allPlayers.length.toLocaleString()} players loaded · ${count} on your roster`}
      </div>
    </div>
  )
}
