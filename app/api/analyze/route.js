export const maxDuration = 60;

export async function POST(req) {
  try {
    const { rosterInfo, todayMatchups, playingToday, today, todayDisplay } =
      await req.json();

    const prompt = `You are a top ESPN fantasy baseball analyst for a categories league.

CATEGORIES: Hitting: R, HR, RBI, SB, AVG, OPS | Pitching: K, QS, ERA, WHIP, K/BB (key=KBB), SV+HD (key=SVHD)

TODAY: ${today} (${todayDisplay})

USER'S ROSTER WITH REAL STATS (season + last 14 days):
${JSON.stringify(rosterInfo, null, 2)}

PLAYERS PLAYING TODAY: ${playingToday.join(', ') || 'None detected'}
TODAY'S MATCHUPS: ${todayMatchups.map((g) => `${g.away} @ ${g.home}`).join(' | ') || 'None detected'}

Reply ONLY with valid JSON (no markdown, no preamble):
{
  "categoryRatings": {"R":7,"HR":6,"RBI":6,"SB":3,"AVG":7,"OPS":8,"K":5,"QS":4,"ERA":6,"WHIP":6,"KBB":5,"SVHD":2},
  "weakest3": ["SB","SVHD","QS"],
  "strongest3": ["OPS","AVG","R"],
  "teamSummary": "Honest 2-sentence team assessment with specific player strengths and category weaknesses",
  "todaySummary": "Exciting 1-2 sentence preview mentioning real player names and key matchups",
  "playingTodayList": ["Name1","Name2"],
  "hitterPickups": [
    {"name":"Player Name","team":"ABV","pos":"3B","why":"Specific recent stats and why it helps weak cats","cats":["SB","R"],"hot":true,"ownPct":"18%"}
  ],
  "spPickups": [
    {"name":"Pitcher Name","team":"ABV","why":"ERA/K rate detail and matchup context","cats":["K","QS","ERA"],"nextStart":"vs. OPP","favorable":true,"ownPct":"25%","type":"stream"}
  ]
}
Rules:
- Exactly 5 hitterPickups targeting the weakest categories
- Exactly 5 spPickups: 3 type=stream (great matchup this week) + 2 type=stash (high ceiling/upside)
- Use REAL 2026 MLB players NOT already on user roster
- hot:true only if genuinely on a tear in last 14 days
- ownPct realistic 5-45% range (these are waiver wire guys)
- "why" must mention specific stats or matchup details`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return Response.json(
        { ok: false, error: `Anthropic ${response.status}: ${errText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || '{}';
    const result = JSON.parse(raw.replace(/```json|```/g, '').trim());
    return Response.json({ ok: true, result });
  } catch (err) {
    console.error('Analyze error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
