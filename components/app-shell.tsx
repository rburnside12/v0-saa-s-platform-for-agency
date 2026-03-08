'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart3,
  List,
  Search,
  Bell,
  ChevronDown,
  Eye,
  EyeOff,
  Menu,
  X,
  ChevronRight,
  Settings,
  LogOut,
  User,
  Zap,
  Sun,
  Moon,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { useTheme } from '@/contexts/theme'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navItems = [
  { href: '/', label: 'Agency Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/prospecting', label: 'List Builder', icon: List },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { presentationMode, setPresentationMode } = usePresentationMode()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showWarning, setShowWarning] = useState(false)
  const [pendingMode, setPendingMode] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  function handlePresentationToggle(checked: boolean) {
    if (checked) {
      setPendingMode(true)
      setShowWarning(true)
    } else {
      setPresentationMode(false)
    }
  }

  function confirmPresentationMode() {
    setPresentationMode(pendingMode)
    setShowWarning(false)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'flex flex-col border-r border-border bg-sidebar transition-all duration-200 shrink-0',
            sidebarOpen ? 'w-56' : 'w-14'
          )}
        >
          {/* Logo */}
          <Link href="/landing">
            <div className="flex items-center gap-2.5 px-3 h-12 border-b border-border hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-bold text-xs">V</span>
              </div>
              {sidebarOpen && (
                <span className="font-semibold text-sm text-foreground truncate">Vantage</span>
              )}
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded text-sm transition-colors',
                        active
                          ? 'bg-primary/15 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      )}
                    >
                      <Icon size={15} className="shrink-0" />
                      {sidebarOpen && <span className="truncate">{label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right">{label}</TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </nav>

          {/* Bottom */}
          {sidebarOpen && (
            <div className="p-3 border-t border-border space-y-1.5">
              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground font-medium">User</div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-primary text-[9px] font-bold">R</span>
                  </div>
                  <span className="text-xs text-foreground truncate font-medium">Robert</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground font-medium">Agency</div>
                <div className="text-xs text-foreground truncate">Cherry Pick Talent</div>
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-12 border-b border-border bg-sidebar flex items-center px-4 gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              aria-label="Toggle sidebar"
            >
              <Menu size={16} />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns, clients, influencers..."
                  className="h-7 pl-8 text-xs bg-secondary border-border text-muted-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex-1" />

            {/* Presentation Mode Toggle */}
            <div className="flex items-center gap-2">
              {presentationMode ? (
                <Badge variant="outline" className="text-[10px] border-primary/40 text-primary bg-primary/10 gap-1">
                  <Eye size={10} />
                  Client View
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground hidden sm:block">Presentation Mode</span>
              )}
              <Switch
                checked={presentationMode}
                onCheckedChange={handlePresentationToggle}
                className="data-[state=checked]:bg-primary scale-75"
              />
            </div>

            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </TooltipContent>
            </Tooltip>

            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
              <Bell size={15} />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-[10px] font-bold">R</span>
                  </div>
                  <ChevronDown size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
                <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                  robert@cherrypicktalent.com
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-xs gap-2">
                  <User size={13} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs gap-2">
                  <Settings size={13} /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-xs gap-2 text-destructive-foreground">
                  <LogOut size={13} /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Presentation Mode Banner */}
          {presentationMode && (
            <div className="bg-primary/10 border-b border-primary/20 px-4 py-1.5 flex items-center gap-2">
              <Eye size={12} className="text-primary" />
              <span className="text-xs text-primary font-medium">Presentation Mode Active — Internal pricing and agency margins are hidden</span>
              <button
                onClick={() => setPresentationMode(false)}
                className="ml-auto text-primary/70 hover:text-primary"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>

        {/* Presentation Mode Warning Dialog */}
        <Dialog open={showWarning} onOpenChange={setShowWarning}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <Eye size={18} className="text-primary" />
                External-Facing Mode
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                You are now in <strong className="text-foreground">External-Facing mode</strong>. Pricing has been masked.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <div className="bg-primary/10 border border-primary/20 rounded p-3 text-xs text-primary font-medium">
                All Internal Price, Profit, and Agency Margin data will be hidden across the entire platform.
              </div>
              <div className="text-xs text-muted-foreground">
                This is safe to share on client calls. Toggle off to return to internal view.
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowWarning(false)} className="border-border text-muted-foreground">
                Cancel
              </Button>
              <Button size="sm" onClick={confirmPresentationMode} className="bg-primary text-primary-foreground">
                <Eye size={13} className="mr-1.5" /> Enter External Mode
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
