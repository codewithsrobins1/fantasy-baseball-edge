'use client'
import { useState, useRef, useEffect } from 'react'

export default function PlayerSlot({ slot, player, onAdd, onRemove, allPlayers }) {
  const [open, setOpen] = useState(false)
  const [q, setQ]       = useState('')
  const inputRef        = useRef(null)
  const containerRef    = useRef(null)

  const isBench = slot.lbl === 'BN'

  const filtered = q.length >= 2
    ? allPlayers.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 7)
    : []

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40)
  }, [open])

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setQ('')
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  const handleSelect = (p) => {
    onAdd(slot.id, p)
    setOpen(false)
    setQ('')
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove(slot.id)
  }

  return (
    <div ref={containerRef} className="mb-1.5">
      {/* Slot row */}
      <div
        onClick={() => { if (!player) setOpen(true) }}
        className={[
          'flex items-center gap-2 px-3 py-2.5 rounded-lg border min-h-[46px] transition-all duration-150',
          player
            ? 'border-border-dim bg-bg-card cursor-default'
            : open
            ? 'border-green-main bg-green-faint cursor-text'
            : 'border-border-dim bg-bg-card cursor-pointer active:border-border-mid',
        ].join(' ')}
      >
        {/* Position badge */}
        <span className={[
          'font-mono text-[10px] font-medium w-8 text-center py-[3px] rounded-[3px] shrink-0',
          isBench
            ? 'bg-[#1a2235] text-text-dim'
            : 'bg-[#0d2137] text-accent-blue',
        ].join(' ')}>
          {slot.lbl}
        </span>

        {player ? (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-bold text-text-primary truncate leading-tight">
                {player.name}
              </div>
              <div className="font-mono text-[10px] text-text-muted mt-0.5">
                {player.pos} · {player.abbrev}
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="text-text-dim hover:text-accent-red text-xl leading-none px-1 shrink-0 transition-colors"
              aria-label="Remove player"
            >
              ×
            </button>
          </>
        ) : open ? (
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder="Search player name..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] font-semibold text-text-primary placeholder:text-text-ghost"
          />
        ) : (
          <span className="text-[14px] text-text-ghost">+ Add Player</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="dropdown-scroll rounded-lg border border-green-main bg-[#0c1525] mb-1 overflow-hidden fade-in">
          {filtered.length > 0 ? filtered.map(p => (
            <button
              key={p.id}
              onMouseDown={e => { e.preventDefault(); handleSelect(p) }}
              onTouchEnd={e => { e.preventDefault(); handleSelect(p) }}
              className="w-full flex justify-between items-center px-3 py-2.5 border-b border-border-dim last:border-0 text-left active:bg-border-dim transition-colors"
            >
              <span className="text-[15px] font-bold text-text-primary">{p.name}</span>
              <span className="font-mono text-[11px] text-text-muted ml-2 shrink-0">{p.pos} · {p.abbrev}</span>
            </button>
          )) : (
            <div className="px-3 py-2.5 font-mono text-[12px] text-text-muted">
              {q.length >= 2 ? 'No players found' : 'Type at least 2 characters...'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
