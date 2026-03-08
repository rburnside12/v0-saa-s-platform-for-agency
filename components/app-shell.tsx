'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Megaphone,
  List,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Eye,
  EyeOff,
  LogOut,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { useTheme } from '@/contexts/theme'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/prospecting', label: 'List Builder', icon: List },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { presentationMode, setPresentationMode } = usePresentationMode()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={cn(
        'border-r border-border bg-sidebar transition-all duration-200 flex flex-col',
        sidebarOpen ? 'w-56' : 'w-12'
      )}>
        {/* Logo */}
        <div className={cn(
          'flex items-center border-b border-border h-12 shrink-0',
          sidebarOpen ? 'px-3 gap-2' : 'justify-center'
        )}>
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-xs">T</span>
          </div>
          {sidebarOpen && <span className="font-semibold text-sm text-foreground">Trace</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-2 py-2 text-xs transition-colors mb-1',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary/50'
                )}
              >
                <Icon size={14} className="shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom User */}
        {sidebarOpen && (
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary text-[9px] font-bold">R</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">Robert</div>
                <div className="text-[10px] text-muted-foreground truncate">Cherry Pick Talent</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="border-b border-border bg-card h-11 flex items-center px-4 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <div className="flex-1" />

          {/* Presentation Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPresentationMode(!presentationMode)}
              className={cn(
                'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors',
                presentationMode
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary'
              )}
            >
              {presentationMode ? <Eye size={13} /> : <EyeOff size={13} />}
              {presentationMode && <span>Client View</span>}
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <User size={13} className="text-muted-foreground" />
            <span className="text-xs text-foreground hidden sm:block">Robert</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
