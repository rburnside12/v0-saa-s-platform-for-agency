'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_DELIVERABLES, MOCK_CAMPAIGN_ANALYTICS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import {
  CheckCircle,
  Plus,
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  ArrowLeft,
  RefreshCw,
  FileSpreadsheet,
  Settings,
  Eye,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// Platform icons as simple SVGs
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  YouTube: YouTubeIcon,
  TikTok: TikTokIcon,
  Twitch: TwitchIcon,
  Instagram: InstagramIcon,
  X: XIcon,
}

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'text-red-500',
  TikTok: 'text-cyan-400',
  Twitch: 'text-purple-500',
  Instagram: 'text-pink-500',
  X: 'text-foreground',
}

const CONTENT_TYPES = [
  'Dedicated Video',
  'Sponsorship',
  'Dedicated Stream',
  'Integrated Mention',
  'Short Form (TikTok/Reel)',
  'Live Stream Overlay',
  'Twitter Thread',
]

// Pie chart colors - distinct colors
const PIE_COLORS = ['#ef4444', '#06b6d4', '#a855f7', '#22c55e', '#f97316']

type Deliverable = typeof MOCK_DELIVERABLES[0]
type SortKey = 'creator' | 'platform' | 'contentType' | 'views' | 'likes' | 'comments' | 'shares' | 'er' | 'internalPrice' | 'clientPrice'
type SortDir = 'asc' | 'desc'

const formatM = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
  return v.toString()
}

function PlatformIcon({ platform, size = 14 }: { platform: string; size?: number }) {
  const Icon = PLATFORM_ICONS[platform]
  const colorClass = PLATFORM_COLORS[platform] || 'text-muted-foreground'
  if (!Icon) return <span className="text-muted-foreground text-[10px]">{platform}</span>
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex ${colorClass}`}>
          <Icon className={`w-[${size}px] h-[${size}px]`} style={{ width: size, height: size }} />
        </span>
      </TooltipTrigger>
      <TooltipContent className="text-xs bg-card border-border">{platform}</TooltipContent>
    </Tooltip>
  )
}

function MetricCell({ value, className = '' }: { value: number | null | undefined; className?: string }) {
  if (value == null || value === 0) return <span className="text-muted-foreground/40">—</span>
  const formatted = value >= 1000000
    ? `${(value / 1000000).toFixed(2)}M`
    : value >= 1000
    ? `${(value / 1000).toFixed(1)}K`
    : value.toLocaleString()
  return <span className={`font-mono tabular-nums ${className}`}>{formatted}</span>
}

// Custom tooltip for charts
function CustomChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-md p-2.5 text-xs shadow-lg">
      <div className="text-muted-foreground mb-1.5 font-medium">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-medium text-foreground">{formatM(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// Sort header component
function SortHeader({ 
  label, 
  sortKey, 
  currentSort, 
  currentDir, 
  onSort,
  align = 'left' 
}: { 
  label: string
  sortKey: SortKey
  currentSort: SortKey
  currentDir: SortDir
  onSort: (key: SortKey) => void
  align?: 'left' | 'right' | 'center'
}) {
  const isActive = currentSort === sortKey
  const justifyClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
  
  return (
    <button 
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 ${justifyClass} w-full text-muted-foreground hover:text-foreground transition-colors`}
    >
      <span className={isActive ? 'text-primary' : ''}>{label}</span>
      {isActive ? (
        currentDir === 'asc' ? <ArrowUp size={10} className="text-primary" /> : <ArrowDown size={10} className="text-primary" />
      ) : (
        <ArrowUpDown size={10} className="opacity-40" />
      )}
    </button>
  )
}

// Extract views based on platform
function getViews(row: Deliverable): number {
  if (row.youtube) return row.youtube.avg30dLong ?? 0
  if (row.tiktok) return row.tiktok.views ?? 0
  if (row.twitch) return row.twitch.vodViews ?? 0
  return 0
}

function getLikes(row: Deliverable): number {
  if (row.youtube) return row.youtube.likes ?? 0
  if (row.tiktok) return row.tiktok.likes ?? 0
  return 0
}

function getComments(row: Deliverable): number {
  if (row.youtube) return row.youtube.comments ?? 0
  if (row.tiktok) return row.tiktok.comments ?? 0
  return 0
}

function getShares(row: Deliverable): number {
  if (row.tiktok) return row.tiktok.shares ?? 0
  return 0
}

function getER(row: Deliverable): number {
  if (row.youtube) return row.youtube.er ?? 0
  if (row.tiktok) return row.tiktok.er ?? 0
  return 0
}

export default function CampaignDashboard({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const [deliverables, setDeliverables] = useState(MOCK_DELIVERABLES)
  const [activeTab, setActiveTab] = useState<'deliverables' | 'analytics'>('deliverables')
  const [refreshing, setRefreshing] = useState(false)
  const [showAddDeliverableModal, setShowAddDeliverableModal] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('creator')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [visibleColumns, setVisibleColumns] = useState({
    platform: true,
    creator: true,
    contentType: true,
    views: true,
    likes: true,
    comments: true,
    shares: true,
    er: true,
    internalPrice: true,
    clientPrice: true,
    cpm: true,
  })

  // Get campaign analytics
  const analytics = MOCK_CAMPAIGN_ANALYTICS[params.id] || MOCK_CAMPAIGN_ANALYTICS['epic-games-q1']

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  // Sort deliverables
  const sortedDeliverables = useMemo(() => {
    return [...deliverables].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'creator':
          cmp = a.creator.handle.localeCompare(b.creator.handle)
          break
        case 'platform':
          cmp = a.creator.platform.localeCompare(b.creator.platform)
          break
        case 'contentType':
          cmp = a.contentType.localeCompare(b.contentType)
          break
        case 'views':
          cmp = getViews(a) - getViews(b)
          break
        case 'likes':
          cmp = getLikes(a) - getLikes(b)
          break
        case 'comments':
          cmp = getComments(a) - getComments(b)
          break
        case 'shares':
          cmp = getShares(a) - getShares(b)
          break
        case 'er':
          cmp = getER(a) - getER(b)
          break
        case 'internalPrice':
          cmp = a.internalPrice - b.internalPrice
          break
        case 'clientPrice':
          cmp = a.clientPrice - b.clientPrice
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [deliverables, sortKey, sortDir])

  function updateDeliverable(id: string, field: string, value: unknown) {
    setDeliverables(prev =>
      prev.map(d => d.id === id ? { ...d, [field]: value } : d)
    )
  }

  async function handleRefreshStats() {
    setRefreshing(true)
    await new Promise(r => setTimeout(r, 1500))
    setRefreshing(false)
  }

  // Calculate totals
  const totalClientValue = deliverables.reduce((a, d) => a + d.clientPrice, 0)
  const totalInternalCost = deliverables.reduce((a, d) => a + d.internalPrice, 0)
  const totalProfit = totalClientValue - totalInternalCost
  const avgMargin = ((totalProfit / totalClientValue) * 100).toFixed(1)
  const totalViews = deliverables.reduce((a, d) => a + getViews(d), 0)
  
  // Target views (from analytics if available)
  const targetViews = analytics.viewsOverTime.length > 0 
    ? analytics.viewsOverTime[analytics.viewsOverTime.length - 1].target 
    : Math.round(totalViews * 1.1)
  
  const progressPct = targetViews > 0 ? Math.min((totalViews / targetViews) * 100, 100) : 0
  const isOverTarget = totalViews > targetViews

  // Cost per CCV for Twitch deliverables
  const twitchDeliverables = deliverables.filter(d => d.twitch)
  const totalTwitchCost = twitchDeliverables.reduce((a, d) => a + d.internalPrice, 0)
  const totalCCV = twitchDeliverables.reduce((a, d) => a + (d.twitch?.avgCCV ?? 0), 0)
  const avgCostPerCCV = totalCCV > 0 ? (totalTwitchCost / totalCCV).toFixed(2) : null

  return (
    <AppShell>
      <TooltipProvider delayDuration={200}>
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/campaigns" className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={14} />
                </Link>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px]">Active</Badge>
                <Badge className="bg-secondary text-muted-foreground text-[10px]">Epic Games</Badge>
              </div>
              <h1 className="text-base font-semibold text-foreground">Fortnite Chapter 5 Season 2 — Q1 Launch</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Jan 15 – Mar 31, 2025 · {deliverables.length} Deliverables · Managed by Sarah K.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => setShowAddDeliverableModal(true)}
                className="h-7 text-xs bg-primary text-primary-foreground gap-1.5"
              >
                <Plus size={12} /> Add Deliverable
              </Button>
            </div>
          </div>

          {/* Overall Campaign Progress Bar */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Overall Campaign Progress</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">
                  Actual: <span className={`font-mono font-semibold ${isOverTarget ? 'text-emerald-400' : 'text-foreground'}`}>{formatM(totalViews)}</span>
                </span>
                <span className="text-muted-foreground">
                  Target: <span className="font-mono font-semibold text-foreground">{formatM(targetViews)}</span>
                </span>
                <Badge className={`text-[10px] ${isOverTarget ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'}`}>
                  {progressPct.toFixed(0)}% {isOverTarget ? 'Exceeded' : 'Complete'}
                </Badge>
              </div>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${isOverTarget ? 'bg-emerald-400' : 'bg-primary'}`}
                style={{ width: `${Math.min(progressPct, 100)}%` }}
              />
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Views', value: formatM(totalViews), icon: Eye },
              { label: 'Client Total', value: `$${(totalClientValue / 1000).toFixed(0)}K`, icon: TrendingUp },
              { label: 'Total Profit', value: `$${(totalProfit / 1000).toFixed(0)}K`, hidden: true, green: true, icon: TrendingUp },
              { label: 'Blended Margin', value: `${avgMargin}%`, hidden: true, green: true, icon: TrendingUp },
              { label: 'Avg Cost/CCV', value: avgCostPerCCV ? `$${avgCostPerCCV}` : '—', hidden: true, icon: TrendingUp },
            ].map(({ label, value, hidden, green, icon: Icon }) => {
              if (presentationMode && hidden) return null
              return (
                <div key={label} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                    <div className={`text-sm font-semibold font-mono tabular-nums ${green ? 'text-emerald-400' : 'text-foreground'}`}>{value}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-0.5 border-b border-border">
              {(['deliverables', 'analytics'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-4 py-2.5 capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'analytics' ? 'Detailed Analytics' : 'Deliverables'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh Stats */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStats}
                disabled={refreshing}
                className="h-7 text-xs border-border gap-1.5"
              >
                <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh Stats'}
              </Button>

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                    <Download size={11} /> Export
                    <ChevronDown size={10} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border w-52">
                  <DropdownMenuItem className="text-xs gap-2">
                    <FileSpreadsheet size={12} /> Export to Google Sheets
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="text-xs gap-2">
                    <FileText size={12} /> Download Internal PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2">
                    <Eye size={12} /> Download External PDF
                    <span className="text-muted-foreground ml-auto text-[10px]">Pricing masked</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                    <Settings size={11} /> View Settings
                    <ChevronDown size={10} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border w-48">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">Visible Columns</div>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.platform}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, platform: !!c }))}
                    className="text-xs"
                  >
                    Platform
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.creator}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, creator: !!c }))}
                    className="text-xs"
                  >
                    Creator
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.contentType}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, contentType: !!c }))}
                    className="text-xs"
                  >
                    Deliverable Type
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">Metrics</div>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.views}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, views: !!c }))}
                    className="text-xs"
                  >
                    Views
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.likes}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, likes: !!c }))}
                    className="text-xs"
                  >
                    Likes
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.comments}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, comments: !!c }))}
                    className="text-xs"
                  >
                    Comments
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.shares}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, shares: !!c }))}
                    className="text-xs"
                  >
                    Shares/Reposts
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.er}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, er: !!c }))}
                    className="text-xs"
                  >
                    ER%
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">Financial</div>
                  {!presentationMode && (
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.internalPrice}
                      onCheckedChange={c => setVisibleColumns(v => ({ ...v, internalPrice: !!c }))}
                      className="text-xs"
                    >
                      Internal Price
                    </DropdownMenuCheckboxItem>
                  )}
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.clientPrice}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, clientPrice: !!c }))}
                    className="text-xs"
                  >
                    Client Price
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.cpm}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, cpm: !!c }))}
                    className="text-xs"
                  >
                    CPM
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {activeTab === 'analytics' ? (
            /* Detailed Analytics Tab */
            <div className="space-y-4">
              {analytics.viewsOverTime.length > 0 ? (
                <>
                  {/* Views Over Time Chart */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-foreground">Total Views Over Time</h3>
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px]">
                        +{((analytics.viewsOverTime[analytics.viewsOverTime.length - 1]?.views / analytics.viewsOverTime[analytics.viewsOverTime.length - 1]?.target - 1) * 100).toFixed(0)}% vs target
                      </Badge>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.viewsOverTime}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatM} tickLine={false} axisLine={false} />
                          <RechartsTooltip content={<CustomChartTooltip />} />
                          <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 3 }} name="Actual" />
                          <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Target" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Views by Platform Pie Chart */}
                    <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-foreground mb-4">Views by Platform</h3>
                      <div className="h-48 flex items-center">
                        <div className="w-1/2 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.byPlatform}
                                dataKey="views"
                                nameKey="platform"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                innerRadius={40}
                              >
                                {analytics.byPlatform.map((entry) => (
                                  <Cell key={entry.platform} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                content={({ active, payload }) => {
                                  if (!active || !payload?.length) return null
                                  const data = payload[0].payload
                                  return (
                                    <div className="bg-card border border-border rounded-md p-2 text-xs shadow-lg">
                                      <div className="font-medium text-foreground">{data.platform}</div>
                                      <div className="text-muted-foreground">{formatM(data.views)} views</div>
                                    </div>
                                  )
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-2">
                          {analytics.byPlatform.map((p) => (
                            <div key={p.platform} className="flex items-center gap-2 text-xs">
                              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                              <span className="text-muted-foreground truncate flex-1">{p.platform}</span>
                              <span className="font-mono tabular-nums text-foreground">{formatM(p.views)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Views by Content Type Pie Chart */}
                    <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-foreground mb-4">Views by Content Type</h3>
                      <div className="h-48 flex items-center">
                        <div className="w-1/2 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.byContentType}
                                dataKey="views"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                innerRadius={40}
                              >
                                {analytics.byContentType.map((entry, index) => (
                                  <Cell key={entry.type} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                content={({ active, payload }) => {
                                  if (!active || !payload?.length) return null
                                  const data = payload[0].payload
                                  return (
                                    <div className="bg-card border border-border rounded-md p-2 text-xs shadow-lg">
                                      <div className="font-medium text-foreground">{data.type}</div>
                                      <div className="text-muted-foreground">{formatM(data.views)} views</div>
                                    </div>
                                  )
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-2">
                          {analytics.byContentType.map((ct, i) => (
                            <div key={ct.type} className="flex items-center gap-2 text-xs">
                              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                              <span className="text-muted-foreground truncate flex-1">{ct.type}</span>
                              <span className="font-mono tabular-nums text-foreground">{formatM(ct.views)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Performers */}
                  {analytics.topPerformers.length > 0 && (
                    <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-foreground mb-4">Top Performers</h3>
                      <div className="space-y-2">
                        {analytics.topPerformers.map((p, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded bg-secondary/50">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <span className="text-primary text-[10px] font-bold">{i + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                {p.creator}
                                <PlatformIcon platform={p.platform} size={12} />
                              </div>
                              <div className="text-[10px] text-muted-foreground">{p.badge}</div>
                            </div>
                            <div className="text-right">
                              {p.ccv ? (
                                <div className="text-xs font-mono text-purple-400">{formatM(p.ccv)} CCV</div>
                              ) : (
                                <div className="text-xs font-mono text-foreground">{formatM(p.views)} views</div>
                              )}
                              {p.er > 0 && <div className="text-[10px] text-emerald-400">{p.er}% ER</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <div className="text-muted-foreground text-sm">No analytics data available yet.</div>
                  <p className="text-xs text-muted-foreground/60 mt-1">Analytics will appear once deliverables go live.</p>
                </div>
              )}
            </div>
          ) : (
            /* Deliverables Table */
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="text-xs w-full min-w-[900px]">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-secondary border-b border-border">
                      {visibleColumns.platform && (
                        <th className="text-center text-muted-foreground font-medium px-3 py-2.5 w-12">
                          <SortHeader label="" sortKey="platform" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="center" />
                        </th>
                      )}
                      {visibleColumns.creator && (
                        <th className="text-left text-muted-foreground font-medium px-3 py-2.5 min-w-[140px]">
                          <SortHeader label="Creator" sortKey="creator" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        </th>
                      )}
                      {visibleColumns.contentType && (
                        <th className="text-left text-muted-foreground font-medium px-3 py-2.5 min-w-[140px]">
                          <SortHeader label="Deliverable Type" sortKey="contentType" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        </th>
                      )}
                      {visibleColumns.views && (
                        <th className="text-right text-muted-foreground font-medium px-3 py-2.5">
                          <SortHeader label="Views" sortKey="views" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                        </th>
                      )}
                      {visibleColumns.likes && (
                        <th className="text-right text-muted-foreground font-medium px-3 py-2.5">
                          <SortHeader label="Likes" sortKey="likes" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                        </th>
                      )}
                      {visibleColumns.comments && (
                        <th className="text-right text-muted-foreground font-medium px-3 py-2.5">
                          <SortHeader label="Comments" sortKey="comments" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                        </th>
                      )}
                      {visibleColumns.shares && (
                        <th className="text-right text-muted-foreground font-medium px-3 py-2.5">
                          <SortHeader label="Shares" sortKey="shares" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                        </th>
                      )}
                      {visibleColumns.er && (
                        <th className="text-right text-muted-foreground font-medium px-3 py-2.5">
                          <SortHeader label="ER%" sortKey="er" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                        </th>
                      )}
                      {!presentationMode && visibleColumns.internalPrice && (
                        <th className="text-right text-muted-foreground font-medium px-3 py-2.5 border-l border-border/50">
                          <SortHeader label="Internal $" sortKey="internalPrice" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                        </th>
                      )}
                      {visibleColumns.clientPrice && (
                        <th className="text-right text-muted-foreground font-medium px-3 py-2.5">
                          <SortHeader label="Client $" sortKey="clientPrice" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                        </th>
                      )}
                      {visibleColumns.cpm && (
                        <th className="text-right text-muted-foreground font-medium px-3 py-2.5">CPM</th>
                      )}
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDeliverables.map(row => {
                      const views = getViews(row)
                      const likes = getLikes(row)
                      const comments = getComments(row)
                      const shares = getShares(row)
                      const er = getER(row)
                      const cpm = row.cpm ? `$${row.cpm.toFixed(2)}` : null

                      return (
                        <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors group">
                          {visibleColumns.platform && (
                            <td className="px-3 py-2.5 text-center">
                              <PlatformIcon platform={row.creator.platform} size={16} />
                            </td>
                          )}
                          {visibleColumns.creator && (
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                  <span className="text-primary text-[10px] font-bold">{row.creator.avatar}</span>
                                </div>
                                <span className="text-foreground font-medium">{row.creator.handle}</span>
                              </div>
                            </td>
                          )}
                          {visibleColumns.contentType && (
                            <td className="px-3 py-2.5">
                              <Select
                                value={row.contentType}
                                onValueChange={v => updateDeliverable(row.id, 'contentType', v)}
                              >
                                <SelectTrigger className="h-6 text-[11px] bg-secondary border-border w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                  {CONTENT_TYPES.map(t => (
                                    <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          )}
                          {visibleColumns.views && (
                            <td className="px-3 py-2.5 text-right">
                              <MetricCell value={views} className="text-foreground" />
                            </td>
                          )}
                          {visibleColumns.likes && (
                            <td className="px-3 py-2.5 text-right">
                              <MetricCell value={likes} />
                            </td>
                          )}
                          {visibleColumns.comments && (
                            <td className="px-3 py-2.5 text-right">
                              <MetricCell value={comments} />
                            </td>
                          )}
                          {visibleColumns.shares && (
                            <td className="px-3 py-2.5 text-right">
                              <MetricCell value={shares} />
                            </td>
                          )}
                          {visibleColumns.er && (
                            <td className="px-3 py-2.5 text-right">
                              {er > 0 ? (
                                <span className={`font-mono tabular-nums ${er > 5 ? 'text-emerald-400' : 'text-foreground'}`}>{er}%</span>
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )}
                            </td>
                          )}
                          {!presentationMode && visibleColumns.internalPrice && (
                            <td className="px-3 py-2.5 text-right border-l border-border/50">
                              <span className="font-mono tabular-nums text-foreground">${row.internalPrice.toLocaleString()}</span>
                            </td>
                          )}
                          {visibleColumns.clientPrice && (
                            <td className="px-3 py-2.5 text-right">
                              <span className="font-mono tabular-nums text-foreground">${row.clientPrice.toLocaleString()}</span>
                            </td>
                          )}
                          {visibleColumns.cpm && (
                            <td className="px-3 py-2.5 text-right">
                              {cpm ? <span className="font-mono tabular-nums text-foreground">{cpm}</span> : <span className="text-muted-foreground/40">—</span>}
                            </td>
                          )}
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a href={row.link} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                <ExternalLink size={12} />
                              </a>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal size={12} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border-border w-32">
                                  <DropdownMenuItem className="text-xs gap-2 text-destructive-foreground">
                                    <Trash2 size={11} /> Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer totals */}
              <div className="border-t border-border px-4 py-2.5 bg-secondary/50 flex items-center gap-6 text-xs">
                <span className="text-muted-foreground font-medium">{deliverables.length} Deliverables</span>
                <span className="text-muted-foreground">Total Views: <span className="text-foreground font-mono">{formatM(totalViews)}</span></span>
                {!presentationMode && (
                  <>
                    <span className="text-muted-foreground">Client Total: <span className="text-foreground font-mono">${totalClientValue.toLocaleString()}</span></span>
                    <span className="text-muted-foreground">Total Profit: <span className="text-emerald-400 font-mono">${totalProfit.toLocaleString()}</span></span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add Deliverable Modal */}
        <Dialog open={showAddDeliverableModal} onOpenChange={setShowAddDeliverableModal}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm text-foreground flex items-center gap-2">
                <Plus size={15} className="text-primary" />
                Add Deliverable
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add a new deliverable to this campaign by pasting a social media link.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Social Media Link</label>
                <Input 
                  placeholder="https://youtube.com/watch?v=... or https://tiktok.com/@creator/video/..."
                  className="h-9 text-xs bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Content Type</label>
                <Select defaultValue="Dedicated Video">
                  <SelectTrigger className="h-9 text-xs bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {CONTENT_TYPES.map(t => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Internal Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                    <Input placeholder="0" className="h-9 pl-6 text-xs bg-secondary border-border font-mono" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Client Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                    <Input placeholder="0" className="h-9 pl-6 text-xs bg-secondary border-border font-mono" />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddDeliverableModal(false)} className="border-border text-muted-foreground">
                Cancel
              </Button>
              <Button size="sm" onClick={() => setShowAddDeliverableModal(false)} className="bg-primary text-primary-foreground">
                <CheckCircle size={12} className="mr-1.5" /> Add Deliverable
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </AppShell>
  )
}
