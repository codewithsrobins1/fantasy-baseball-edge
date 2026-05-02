export const HITTER_SLOTS = [
  { id: 'C',    lbl: 'C',    type: 'starter' },
  { id: '1B',   lbl: '1B',   type: 'starter' },
  { id: '2B',   lbl: '2B',   type: 'starter' },
  { id: '3B',   lbl: '3B',   type: 'starter' },
  { id: 'SS',   lbl: 'SS',   type: 'starter' },
  { id: 'OF1',  lbl: 'OF',   type: 'starter' },
  { id: 'OF2',  lbl: 'OF',   type: 'starter' },
  { id: 'OF3',  lbl: 'OF',   type: 'starter' },
  { id: 'UTIL', lbl: 'UTIL', type: 'starter' },
  { id: 'BH1',  lbl: 'BN',   type: 'bench'   },
  { id: 'BH2',  lbl: 'BN',   type: 'bench'   },
  { id: 'BH3',  lbl: 'BN',   type: 'bench'   },
]

export const PITCHER_SLOTS = [
  { id: 'P1',  lbl: 'P',  type: 'starter' },
  { id: 'P2',  lbl: 'P',  type: 'starter' },
  { id: 'P3',  lbl: 'P',  type: 'starter' },
  { id: 'P4',  lbl: 'P',  type: 'starter' },
  { id: 'P5',  lbl: 'P',  type: 'starter' },
  { id: 'P6',  lbl: 'P',  type: 'starter' },
  { id: 'P7',  lbl: 'P',  type: 'starter' },
  { id: 'PB1', lbl: 'BN', type: 'bench'   },
  { id: 'PB2', lbl: 'BN', type: 'bench'   },
]

export const ALL_CATS = [
  { k: 'R',    l: 'Runs',          t: 'hit' },
  { k: 'HR',   l: 'Home Runs',     t: 'hit' },
  { k: 'RBI',  l: 'RBI',           t: 'hit' },
  { k: 'SB',   l: 'Stolen Bases',  t: 'hit' },
  { k: 'AVG',  l: 'Batting Avg',   t: 'hit' },
  { k: 'OPS',  l: 'OPS',           t: 'hit' },
  { k: 'K',    l: 'Strikeouts',    t: 'pit' },
  { k: 'QS',   l: 'Qual. Starts',  t: 'pit' },
  { k: 'ERA',  l: 'ERA',           t: 'pit' },
  { k: 'WHIP', l: 'WHIP',          t: 'pit' },
  { k: 'KBB',  l: 'K/BB Ratio',    t: 'pit' },
  { k: 'SVHD', l: 'SV + Holds',    t: 'pit' },
]

export const CAT_COLORS = {
  R:    '#60a5fa',
  HR:   '#f87171',
  RBI:  '#fbbf24',
  SB:   '#34d399',
  AVG:  '#a78bfa',
  OPS:  '#f472b6',
  K:    '#60a5fa',
  QS:   '#34d399',
  ERA:  '#f87171',
  WHIP: '#fbbf24',
  KBB:  '#a78bfa',
  SVHD: '#fb923c',
}

export const MLB_API = 'https://statsapi.mlb.com/api/v1'

export const getToday = () => new Date().toISOString().split('T')[0]

export const getRecentStart = () =>
  new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0]

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

export const LS_KEYS = {
  ROSTER:        'fe_roster_v3',
  ANALYSIS:      'fe_analysis_v3',
  ANALYSIS_DATE: 'fe_analysis_date_v3',
}

export function loadLS(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

export function saveLS(key, val) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}
