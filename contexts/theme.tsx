'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start as null so we never render with a mismatched theme during hydration.
  // The blocking inline script in layout.tsx has already set the correct class on
  // <html> before any paint, so the page looks right while React catches up.
  const [theme, setThemeState] = useState<Theme | null>(null)

  // On first client render, read the class the inline script already applied so
  // React state is always in sync with the DOM — no mismatch, no flicker.
  useEffect(() => {
    const stored = localStorage.getItem('cp-theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved: Theme = stored ?? (prefersDark ? 'dark' : 'light')
    setThemeState(resolved)
  }, [])

  // Keep DOM class in sync on subsequent theme changes (not the initial mount,
  // which is already handled by the inline script).
  useEffect(() => {
    if (theme === null) return
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [theme])

  function setTheme(t: Theme) {
    localStorage.setItem('cp-theme', t)
    setThemeState(t)
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Provide a stable fallback so consumers never receive null.
  // The real value is determined client-side in the effect above.
  const resolvedTheme: Theme = theme ?? 'light'

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
