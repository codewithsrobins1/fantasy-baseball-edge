'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import RosterTab   from '../components/RosterTab'
import TodayTab    from '../components/TodayTab'
import PickupsTab  from '../components/PickupsTab'
import AnalysisTab from '../components/AnalysisTab'
import { MLB_API, getToday, getRecentStart, formatDate, LS_KEYS, loadLS, saveLS } from '../lib/constants'

const TABS = [
  { id: 'today',    icon: '📅', label: 'Today'    },
  { id: 'roster',   icon: '📋', label: 'Roster'   },
  { id: 'pickups',  icon: '💡', label: 'Pickups'  },
  { id: 'analysis', icon: '📊', label: 'Analysis' },
]

export default function Page() {
  const today      = getToday()
  const todayLabel = formatDate(today)

  const [tab,        setTab]        = useState('roster')
  const [players,    setPlayers]    = useState([])
  const [pLoad,      setPLoad]      = useState(true)
  const [roster,     setRoster]     = useState({})
  const [analysis,   setAnalysis]   = useState(null)
  const [analyzing,  setAnalyzing]  = useState(false)
  const [error,      setError]      = useState(null)
  const [saveState,  setSaveState]  = useState('idle')  // idle | saving | saved
  const [isOnline,   setIsOnline]   = useState(true)
  const saveTimer = useRef(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedRoster = loadLS(LS_KEYS.ROSTER, {})
    setRoster(savedRoster)

    const savedAnalysis = loadLS(LS_KEYS.ANALYSIS, null)
    const savedDate     = loadLS(LS_KEYS.ANALYSIS_DATE, null)
    if (savedAnalysis && savedDate === today) {
      setAnalysis(savedAnalysis)
    }
  }, [today])

  // Online/offline
  useEffect(() => {
    setIsOnline(navigator.onLine)
    const up = () => setIsOnline(true)
    const dn = () => setIsOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', dn)
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', dn) }
  }, [])

  // Auto-save roster to localStorage
  useEffect(() => {
    setSaveState('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveLS(LS_KEYS.ROSTER, roster)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    }, 700)
    return () => clearTimeout(saveTimer.current)
  }, [roster])

  // Load MLB players
  useEffect(() => {
    fetch(`${MLB_API}/sports/1/players?season=2026&gameType=R`)
      .then(r => r.json())
      .then(d => setPlayers(
        (d.people || []).map(p => ({
          id:     p.id,
          name:   p.fullName,
          pos:    p.primaryPosition?.abbreviation || '?',
          team:   p.currentTeam?.name || 'FA',
          abbrev: p.currentTeam?.abbreviation || 'FA',
          teamId: p.currentTeam?.id,
        }))
      ))
      .catch(() => setError('Could not load player database — check connection.'))
      .finally(() => setPLoad(false))
  }, [])

  const addPlayer = useCallback((slotId, player) => {
    setRoster(prev => ({ ...prev, [slotId]: player }))
  }, [])

  const removePlayer = useCallback((slotId) => {
    setRoster(prev => { const n = { ...prev }; delete n[slotId]; return n })
  }, [])

  const analyzeTeam = async () => {
    const pp = Object.values(roster).filter(Boolean)
    if (pp.length < 3) { setError('Add at least 3 players first!'); return }
    if (!isOnline)     { setError('You need internet to analyze.');  return }

    setAnalyzing(true)
    setError(null)

    try {
      const recentStart = getRecentStart()

      // Fetch player stats from MLB API
      const statMap = {}
      await Promise.all(pp.map(async p => {
        const isPit = ['SP', 'RP', 'P'].includes(p.pos)
        const grp   = isPit ? 'pitching' : 'hitting'
        try {
          const [sr, rr] = await Promise.all([
            fetch(`${MLB_API}/people/${p.id}/stats?stats=season&season=2026&group=${grp}&gameType=R`),
            fetch(`${MLB_API}/people/${p.id}/stats?stats=byDateRange&startDate=${recentStart}&endDate=${today}&group=${grp}&season=2026`),
          ])
          const [sd, rd] = await Promise.all([sr.json(), rr.json()])
          statMap[p.id] = {
            season: sd.stats?.[0]?.splits?.[0]?.stat || {},
            recent: rd.stats?.[0]?.splits?.[0]?.stat || {},
            isPit,
          }
        } catch {
          statMap[p.id] = { season: {}, recent: {}, isPit }
        }
      }))

      // Fetch today's schedule
      let games = []
      try {
        const gr = await fetch(`${MLB_API}/schedule?sportId=1&date=${today}&hydrate=team`)
        const gd = await gr.json()
        games = (gd.dates?.[0]?.games || []).map(g => ({
          away:   g.teams?.away?.team?.name,
          home:   g.teams?.home?.team?.name,
          awayId: g.teams?.away?.team?.id,
          homeId: g.teams?.home?.team?.id,
        }))
      } catch {}

      const teamIds       = [...new Set(pp.map(p => p.teamId).filter(Boolean))]
      const todayMatchups = games.filter(g => teamIds.includes(g.homeId) || teamIds.includes(g.awayId))
      const playingToday  = pp.filter(p => todayMatchups.some(g => g.homeId === p.teamId || g.awayId === p.teamId))

      const rosterInfo = Object.entries(roster).map(([slot, p]) => ({
        slot,
        name:   p.name,
        team:   p.abbrev,
        pos:    p.pos,
        teamId: p.teamId,
        season: statMap[p.id]?.season || {},
        last14: statMap[p.id]?.recent || {},
        isPit:  statMap[p.id]?.isPit  || false,
      }))

      // Call our Next.js API route (server-side Anthropic call)
      const res  = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rosterInfo,
          todayMatchups,
          playingToday: playingToday.map(p => p.name),
          today,
          todayDisplay: todayLabel,
        }),
      })

      const data = await res.json()
      if (!data.ok) throw new Error(data.error)

      const finalResult = { ...data.result, todayMatchups, playingPlayers: playingToday }
      setAnalysis(finalResult)
      saveLS(LS_KEYS.ANALYSIS, finalResult)
      saveLS(LS_KEYS.ANALYSIS_DATE, today)
      setTab('today')
    } catch (e) {
      console.error(e)
      setError('Analysis failed — please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const rosterCount = Object.values(roster).filter(Boolean).length

  return (
    <div className="flex flex-col min-h-dvh bg-bg-base">
      {/* Analyzing overlay */}
      {analyzing && (
        <div className="fixed inset-0 bg-bg-base/95 flex flex-col items-center justify-center z-50">
          <div className="w-12 h-12 rounded-full border-[3px] border-border-dim border-t-green-main spin mb-5 pulse-green" />
          <div className="text-[20px] font-black text-text-primary tracking-wide mb-2">ANALYZING YOUR TEAM</div>
          <div className="font-mono text-[11px] text-text-dim text-center px-8 leading-relaxed">
            Fetching stats from MLB API<br/>Reading matchups · Finding pickups
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header-safe bg-bg-header border-b border-border-dim px-4 pb-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⚾</span>
          <div>
            <div className="text-[20px] font-black text-text-primary leading-none tracking-tight">
              FANTASY <span className="text-green-main">EDGE</span>
            </div>
            <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-dim mt-0.5">
              ESPN Categories
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="font-mono text-[10px] text-text-dim leading-none">
            {today}
          </div>
          <div className="flex items-center gap-1.5">
            {analysis && (
              <button
                onClick={analyzeTeam}
                disabled={analyzing}
                className="font-mono text-[10px] text-accent-amber border border-accent-amber/30 px-2 py-0.5 rounded bg-[#1a1200] active:opacity-70"
              >
                ↻ Re-analyze
              </button>
            )}
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-main' : 'bg-accent-red'}`} />
              <span className={`font-mono text-[9px] ${isOnline ? 'text-green-main' : 'text-accent-red'}`}>
                {isOnline ? 'live' : 'offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Save indicator bar */}
      {saveState !== 'idle' && (
        <div className={`h-[2px] ${saveState === 'saving' ? 'bg-accent-amber/60' : 'bg-green-main/60'} transition-colors duration-300`} />
      )}

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto content-scroll">
        <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
          {tab === 'roster' && (
            <RosterTab
              roster={roster}
              onAdd={addPlayer}
              onRemove={removePlayer}
              allPlayers={players}
              pLoad={pLoad}
              onAnalyze={analyzeTeam}
              analyzing={analyzing}
              error={error}
            />
          )}
          {tab === 'today'    && <TodayTab    analysis={analysis} today={today} />}
          {tab === 'pickups'  && <PickupsTab  analysis={analysis} />}
          {tab === 'analysis' && <AnalysisTab analysis={analysis} />}
        </div>
      </main>

      {/* Bottom nav bar - mobile native pattern */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-bg-header border-t border-border-dim z-30">
        <div className="flex max-w-2xl mx-auto">
          {TABS.map(t => {
            const isActive = tab === t.id
            const hasBadge = (t.id === 'today' || t.id === 'pickups' || t.id === 'analysis') && analysis
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors relative',
                  isActive ? 'text-green-main' : 'text-text-dim active:text-text-secondary',
                ].join(' ')}
              >
                {/* Badge dot when analysis available */}
                {hasBadge && !isActive && (
                  <div className="absolute top-1.5 right-[calc(50%-14px)] w-1.5 h-1.5 rounded-full bg-green-main" />
                )}
                <span className="text-[18px] leading-none">{t.icon}</span>
                <span className={`font-mono text-[10px] font-medium tracking-wide ${isActive ? 'text-green-main' : 'text-text-dim'}`}>
                  {t.label}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-green-main rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Roster count floating badge on roster tab icon */}
      {rosterCount > 0 && tab !== 'roster' && (
        <div className="fixed bottom-[62px] right-4 bg-green-main text-black text-[10px] font-black font-mono px-2 py-0.5 rounded-full z-40">
          {rosterCount}/21
        </div>
      )}
    </div>
  )
}
