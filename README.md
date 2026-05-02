# Fantasy Edge ⚾

ESPN Fantasy Baseball Categories Analyzer — built with Next.js, deployed on Vercel.

## Features
- 📋 Full ESPN roster builder (C/1B/2B/3B/SS/OF×3/UTIL + bench, 7P + 2 bench)
- 🔍 Live MLB player search (pulls from MLB Stats API)
- 📅 Daily outlook — who's playing, your matchups
- 💡 AI waiver wire recommendations (5 hitters + 5 SPs targeted to your weak categories)
- 📊 Category strength/weakness analysis across all 12 cats
- 💾 Auto-saves your roster to localStorage
- 📱 Installable as a mobile app (PWA)

## Quick Deploy to Vercel

### 1. Get an Anthropic API key
Go to [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "init"
gh repo create fantasy-edge --public --push
# or push to existing repo
```

### 3. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Add environment variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from step 1
4. Click Deploy ✓

### 4. Install on your phone
- **iPhone (Safari):** Open your Vercel URL → Share → Add to Home Screen
- **Android (Chrome):** Open URL → tap install banner or ⋮ → Add to Home Screen

## Local Development

```bash
# Install dependencies
npm install

# Create env file
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run dev server
npm run dev
# Open http://localhost:3000
```

## How it works

1. **Roster tab** — tap any slot to search and add players. Roster auto-saves to localStorage.
2. **Analyze** — fetches real stats from MLB Stats API (season + last 14 days), then sends to Claude for analysis.
3. **Today tab** — shows which of your players have games today and key matchups.
4. **Pickups tab** — 5 hitter + 5 SP waiver wire targets, weighted toward your weak categories. SPs labeled STREAM (this week) or STASH (upside).
5. **Analysis tab** — 12-category strength/weakness breakdown with visual ratings.

## Storage
- Roster: saved to `localStorage` on your device, persists forever
- Analysis: cached daily — re-opens instantly the same day, re-runs next day
- No backend database needed
