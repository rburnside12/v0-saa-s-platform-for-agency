import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PresentationModeProvider } from '@/contexts/presentation-mode'
import { ThemeProvider } from '@/contexts/theme'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'CherryPick Talent — Agency Portal',
  description: 'Enterprise SaaS platform for social media campaign management, influencer analytics, and reporting.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <PresentationModeProvider>
            {children}
          </PresentationModeProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
