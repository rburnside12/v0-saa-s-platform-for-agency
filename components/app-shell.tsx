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
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { useTheme } from '@/contexts/theme'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
      {/* Sidebar — Enterprise FinOps Style */}
      <aside className={cn(
        'border-r border-border bg-sidebar transition-all duration-200 flex flex-col',
        sidebarOpen ? 'w-56' : 'w-12'
      )}>
        {/* Logo & Agency Dropdown */}
        <div className={cn(
          'flex items-center border-b border-border h-12 shrink-0',
          sidebarOpen ? 'px-3 gap-2' : 'justify-center'
        )}>
          {/* Trace Geometric Icon */}
          <div className="w-6 h-6 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="#7C3AED" className="w-6 h-6">
              <polygon points="12,2 20,8 20,20 12,14 4,20 4,8" />
            </svg>
          </div>

          {sidebarOpen && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 flex items-center gap-1.5 text-left hover:opacity-70 transition-opacity">
                  <span className="font-semibold text-sm text-foreground">Trace</span>
                  <ChevronDown size={12} className="text-muted-foreground shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="ml-2 w-44">
                <DropdownMenuItem className="text-xs">
                  <span>Cherry Pick Talent</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-muted-foreground">
                  + Add workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Navigation — High Density */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs transition-colors mb-0.5',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary'
                )}
              >
                <Icon size={13} className="shrink-0" />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom User */}
        {sidebarOpen && (
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary text-[10px] font-bold">R</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate leading-none">Robert</div>
                <div className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">Cherry Pick Talent</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="border-b border-border bg-card h-11 flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <div className="flex-1" />

          {/* Presentation Mode Toggle */}
          <button
            onClick={() => setPresentationMode(!presentationMode)}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors',
              presentationMode
                ? 'bg-green-100 text-green-700'
                : 'text-muted-foreground hover:bg-secondary'
            )}
          >
            {presentationMode && <Eye size={12} />}
            {presentationMode ? 'Client View On' : 'Client View'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-0.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-[9px] font-bold">R</span>
                </div>
                <ChevronDown size={11} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="text-xs gap-2"><User size={12} /> Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2"><Settings size={12} /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs gap-2 text-destructive"><LogOut size={12} /> Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
