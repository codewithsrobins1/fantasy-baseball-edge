'use client'
import { formatDate } from '../lib/constants'

export default function TodayTab({ analysis, today }) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <div className="text-5xl mb-4">📅</div>
        <div className="text-xl font-bold text-text-primary mb-2">No Analysis Yet</div>
        <div className="text-[14px] text-center max-w-[240px]">Build your roster on the Roster tab and tap Analyze</div>
      </div>
    )
  }

  const playingList = analysis.playingTodayList || []
  const matchups    = analysis.todayMatchups    || []

  return (
    <div className="pb-4 fade-in">
      {/* Date hero card */}
      <div className="bg-bg-panel border border-border-dim rounded-2xl p-4 mb-4">
        <div className="flex gap-3 items-start">
          <div className="text-3xl mt-0.5">📅</div>
          <div className="flex-1">
            <div className="text-[11px] font-mono font-bold tracking-[2px] uppercase text-text-dim mb-1">Today</div>
            <div className="text-[20px] font-black text-text-primary leading-tight">{formatDate(today)}</div>
            <div className="font-mono text-[11px] text-green-main mt-1.5">
              {playingList.length} of your players have games today
            </div>
          </div>
        </div>
        {analysis.todaySummary && (
          <p className="mt-3 text-[14px] text-text-secondary leading-relaxed border-t border-border-dim pt-3">
            {analysis.todaySummary}
          </p>
        )}
      </div>

      {/* Playing today */}
      {playingList.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim mb-2.5">
            🔥 Playing Today
          </div>
          <div className="flex flex-wrap gap-2">
            {playingList.map((name, i) => (
              <div key={i} className="flex items-center gap-2 bg-green-faint border border-green-dark rounded-lg px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-main shrink-0" />
                <span className="text-[14px] font-bold text-text-primary">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matchups */}
      {matchups.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-mono font-bold tracking-[2px] uppercase text-text-dim mb-2.5">
            🏟️ Your Teams' Matchups
          </div>
          <div className="flex flex-wrap gap-2">
            {matchups.map((g, i) => (
              <div key={i} className="bg-bg-panel border border-border-dim rounded-lg px-3 py-1.5 font-mono text-[11px] text-text-secondary">
                {g.away} @ {g.home}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rest day notice */}
      {playingList.length === 0 && (
        <div className="bg-bg-panel border border-border-dim rounded-xl px-4 py-6 text-center">
          <div className="text-3xl mb-2">😴</div>
          <div className="text-[15px] font-bold text-text-primary mb-1">Off Day</div>
          <div className="text-[13px] text-text-muted">None of your players have games scheduled today.</div>
        </div>
      )}
    </div>
  )
}
