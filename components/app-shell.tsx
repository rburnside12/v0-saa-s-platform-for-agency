'use client'

import { useState, useEffect, useCallback } from 'react'
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
  LogOut,
  User,
  ChevronDown,
  Search,
  AlertCircle,
  BookOpen,
  Bell,
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
import { Input } from '@/components/ui/input'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useRouter } from 'next/navigation'
import { MOCK_CAMPAIGNS, MOCK_CREATORS } from '@/lib/mock-data'

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/creators', label: 'Creator Library', icon: User },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/prospecting', label: 'List Builder', icon: List },
  { href: '/anomalies', label: 'Anomalies', icon: AlertCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const pinnedItems = [
  { label: 'Notifications', icon: Bell, badge: 3 },
  { label: 'Documentation', icon: BookOpen, badge: 0 },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { presentationMode, setPresentationMode } = usePresentationMode()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [commandOpen, setCommandOpen] = useState(false)

  // Command-K keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = useCallback((command: () => void) => {
    setCommandOpen(false)
    command()
  }, [])

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

        {/* Search - Command-K Trigger */}
        {sidebarOpen && (
          <div className="px-2 py-2 border-b border-border">
            <button
              onClick={() => setCommandOpen(true)}
              className="w-full h-8 px-2.5 rounded-md bg-secondary/60 border border-border/50 text-xs text-muted-foreground/60 flex items-center gap-2 hover:bg-secondary/80 hover:border-border transition-colors"
            >
              <Search size={12} />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
        )}

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

          {/* Pinned Section */}
          {sidebarOpen && (
            <div className="mt-4 pt-3 border-t border-border space-y-1">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground/60 px-2.5 mb-2">Pinned</p>
              {pinnedItems.map(({ label, icon: Icon, badge }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  <Icon size={13} className="shrink-0" />
                  <span className="truncate flex-1">{label}</span>
                  {badge > 0 && (
                    <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold shrink-0">
                      {badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
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

      {/* Command-K Search Dialog */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search creators, campaigns, or pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Pages">
            {navItems.map(({ href, label, icon: Icon }) => (
              <CommandItem
                key={href}
                onSelect={() => runCommand(() => router.push(href))}
                className="gap-2"
              >
                <Icon size={14} className="text-muted-foreground" />
                <span>{label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Creators">
            {MOCK_CREATORS.slice(0, 5).map((creator) => (
              <CommandItem
                key={creator.id}
                onSelect={() => runCommand(() => router.push(`/creators/${creator.id}`))}
                className="gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-primary text-[8px] font-bold">{creator.avatar}</span>
                </div>
                <span className="flex-1">{creator.handle}</span>
                <span className="text-[10px] text-muted-foreground">{creator.platform}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Campaigns">
            {MOCK_CAMPAIGNS.slice(0, 4).map((campaign) => (
              <CommandItem
                key={campaign.id}
                onSelect={() => runCommand(() => router.push(`/campaign/${campaign.id}`))}
                className="gap-2"
              >
                <Megaphone size={14} className="text-muted-foreground" />
                <span className="flex-1 truncate">{campaign.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  campaign.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                  campaign.status === 'completed' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {campaign.status}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
