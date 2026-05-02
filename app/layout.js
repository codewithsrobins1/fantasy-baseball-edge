import './globals.css'

export const metadata = {
  title: 'Fantasy Edge',
  description: 'ESPN Fantasy Baseball Categories Analyzer',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fantasy Edge',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#22c55e',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" href="/icons/icon-192.png" />
      </head>
      <body className="bg-bg-base text-text-primary font-condensed antialiased">
        {children}
      </body>
    </html>
  )
}
