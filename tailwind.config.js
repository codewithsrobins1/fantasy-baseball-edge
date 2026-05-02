/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:    '#070b14',
          panel:   '#0f1629',
          card:    '#09101f',
          header:  '#080d1e',
        },
        border: {
          dim:     '#1e2d4f',
          mid:     '#2d4a6b',
          bright:  '#3d6a9b',
        },
        green: {
          main:    '#22c55e',
          dark:    '#16532d',
          faint:   '#051a0d',
        },
        text: {
          primary:   '#f1f5f9',
          secondary: '#94a3b8',
          muted:     '#64748b',
          dim:       '#475569',
          ghost:     '#2d3f5a',
        },
        accent: {
          blue:   '#60a5fa',
          red:    '#f87171',
          amber:  '#fbbf24',
          teal:   '#34d399',
          purple: '#a78bfa',
          pink:   '#f472b6',
          orange: '#fb923c',
        },
      },
      fontFamily: {
        condensed: ['Barlow Condensed', 'sans-serif'],
        mono:      ['JetBrains Mono', 'monospace'],
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
}
