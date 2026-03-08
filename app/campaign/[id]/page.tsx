'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_DELIVERABLES, MOCK_CAMPAIGN_ANALYTICS, MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import {
  Plus,
  ChevronDown,
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
  TrendingDown,
  MessageSquare,
  Save,
  CheckCircle,
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

// ─── Platform SVG Icons ──────────────────────────────────────────────────────

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
  YouTube: YouTubeIcon, TikTok: TikTokIcon, Twitch: TwitchIcon,
  Instagram: InstagramIcon, X: XIcon,
}
const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'text-red-500', TikTok: 'text-cyan-400',
  Twitch: 'text-purple-500', Instagram: 'text-pink-500', X: 'text-foreground',
}
// Chart fill colors per platform for stacked bars
const PLATFORM_BAR_COLORS: Record<string, string> = {
  YouTube: '#ef4444',
  Twitch: '#a855f7',
  TikTok: '#22d3ee',
  Instagram: '#ec4899',
  X: '#94a3b8',
}

const CONTENT_TYPES = [
  'Dedicated Video', 'Sponsorship', 'Dedicated Stream',
  'Integrated Mention', 'Short Form (TikTok/Reel)',
  'Live Stream Overlay', 'Twitter Thread',
]

const PIE_COLORS = ['#ef4444', '#06b6d4', '#a855f7', '#22c55e', '#f97316']

type Deliverable = typeof MOCK_DELIVERABLES[0]
type SortKey = 'creator' | 'platform' | 'contentType' | 'views' | 'likes' | 'comments' | 'shares' | 'er' | 'internalPrice' | 'clientPrice'
type SortDir = 'asc' | 'desc'
type ActiveTab = 'deliverables' | 'analytics'

const fmt = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
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
          <Icon style={{ width: size, height: size }} />
        </span>
      </TooltipTrigger>
      <TooltipContent className="text-xs">{platform}</TooltipContent>
    </Tooltip>
  )
}

function MetricCell({ value }: { value: number | null | undefined }) {
  if (value == null || value === 0) return <span className="text-muted-foreground/30">—</span>
  return <span className="font-mono tabular-nums">{value >= 1_000_000 ? `${(value/1_000_000).toFixed(2)}M` : value >= 1_000 ? `${(value/1_000).toFixed(1)}K` : value.toLocaleString()}</span>
}

function SortHeader({ label, sortKey, currentSort, currentDir, onSort, align = 'left' }: {
  label: string; sortKey: SortKey; currentSort: SortKey; currentDir: SortDir
  onSort: (k: SortKey) => void; align?: 'left' | 'right' | 'center'
}) {
  const active = currentSort === sortKey
  return (
    <button onClick={() => onSort(sortKey)} className={`flex items-center gap-1 w-full ${align === 'right' ? 'justify-end' : 'justify-start'} text-muted-foreground hover:text-foreground transition-colors`}>
      <span className={active ? 'text-primary' : ''}>{label}</span>
      {active ? (currentDir === 'asc' ? <ArrowUp size={9} className="text-primary" /> : <ArrowDown size={9} className="text-primary" />) : <ArrowUpDown size={9} className="opacity-30" />}
    </button>
  )
}

function getViews(row: Deliverable) { return row.youtube?.avg30dLong ?? row.tiktok?.views ?? row.twitch?.vodViews ?? 0 }
function getLikes(row: Deliverable) { return row.youtube?.likes ?? row.tiktok?.likes ?? 0 }
function getComments(row: Deliverable) { return row.youtube?.comments ?? row.tiktok?.comments ?? 0 }
function getShares(row: Deliverable) { return row.tiktok?.shares ?? 0 }
function getER(row: Deliverable) { return row.youtube?.er ?? row.tiktok?.er ?? 0 }

// SVG Progress Ring
function ProgressRing({ pct, size = 56, stroke = 5, color = 'hsl(var(--primary))' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  )
}

// KPI Card with progress ring + delta badge
function KpiCard({ label, value, sub, delta, ring, ringColor, hidden }: {
  label: string; value: string; sub?: string
  delta?: number; ring?: number; ringColor?: string; hidden?: boolean
}) {
  const positive = (delta ?? 0) >= 0
  return (
    <div className={`bg-card border border-border rounded-lg px-5 py-4 flex items-center gap-4 ${hidden ? 'blur-sm select-none pointer-events-none' : ''}`}>
      {ring != null && (
        <div className="relative shrink-0">
          <ProgressRing pct={ring} size={52} stroke={4} color={ringColor ?? 'hsl(var(--primary))'} />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold text-foreground">{ring}%</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
        <div className="text-xl font-semibold font-mono tabular-nums text-foreground leading-tight">{value}</div>
        {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      {delta != null && (
        <div className={`flex items-center gap-0.5 text-[11px] font-medium shrink-0 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {positive ? '+' : ''}{delta}%
        </div>
      )}
    </div>
  )
}

// Custom stacked bar tooltip
function StackedBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div className="bg-card border border-border rounded-md p-3 text-xs shadow-xl min-w-[160px]">
      <div className="text-muted-foreground font-medium mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-3 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}</span>
          </div>
          <span className="font-mono font-medium text-foreground">{fmt(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-border mt-2 pt-2 flex justify-between">
        <span className="text-muted-foreground">Total</span>
        <span className="font-mono font-semibold text-foreground">{fmt(total)}</span>
      </div>
    </div>
  )
}

export default function CampaignDashboard({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const [deliverables, setDeliverables] = useState(MOCK_DELIVERABLES)
  const [activeTab, setActiveTab] = useState<ActiveTab>('deliverables')
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('creator')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [visibleColumns, setVisibleColumns] = useState({
    platform: true, creator: true, contentType: true,
    views: true, likes: true, comments: true, shares: true, er: true,
    internalPrice: true, clientPrice: true, cpm: true,
  })

  const analytics = MOCK_CAMPAIGN_ANALYTICS[params.id] || MOCK_CAMPAIGN_ANALYTICS['epic-games-q1']
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === params.id) || MOCK_CAMPAIGNS[0]

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sortedDeliverables = useMemo(() => {
    return [...deliverables].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'creator': cmp = a.creator.handle.localeCompare(b.creator.handle); break
        case 'platform': cmp = a.creator.platform.localeCompare(b.creator.platform); break
        case 'contentType': cmp = a.contentType.localeCompare(b.contentType); break
        case 'views': cmp = getViews(a) - getViews(b); break
        case 'likes': cmp = getLikes(a) - getLikes(b); break
        case 'comments': cmp = getComments(a) - getComments(b); break
        case 'shares': cmp = getShares(a) - getShares(b); break
        case 'er': cmp = getER(a) - getER(b); break
        case 'internalPrice': cmp = a.internalPrice - b.internalPrice; break
        case 'clientPrice': cmp = a.clientPrice - b.clientPrice; break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [deliverables, sortKey, sortDir])

  async function handleRefresh() {
    setRefreshing(true)
    await new Promise(r => setTimeout(r, 1500))
    setRefreshing(false)
  }

  // ── Computed Totals ──────────────────────────────────────────────────────
  const totalClientValue = deliverables.reduce((a, d) => a + d.clientPrice, 0)
  const totalInternalCost = deliverables.reduce((a, d) => a + d.internalPrice, 0)
  const totalProfit = totalClientValue - totalInternalCost
  const marginPct = totalClientValue > 0 ? Math.round((totalProfit / totalClientValue) * 100) : 0
  const totalViews = deliverables.reduce((a, d) => a + getViews(d), 0)
  const targetViews = analytics.viewsOverTime.length > 0
    ? analytics.viewsOverTime[analytics.viewsOverTime.length - 1].target
    : Math.round(totalViews * 1.1)
  const progressPct = targetViews > 0 ? Math.min(Math.round((totalViews / targetViews) * 100), 100) : 0
  const isOver = totalViews > targetViews

  // Platforms in stacked data
  const stackedData = analytics.stackedByPlatform ?? []
  const stackedPlatforms = stackedData.length > 0
    ? Object.keys(stackedData[0]).filter(k => k !== 'date')
    : analytics.byPlatform.map(p => p.platform)

  // ── New Deliverable State ────────────────────────────────────────────────
  const [newDel, setNewDel] = useState({ handle: '', platform: 'YouTube', contentType: 'Dedicated Video', clientPrice: '', internalPrice: '' })

  function addDeliverable() {
    if (!newDel.handle) return
    const id = Date.now().toString()
    setDeliverables(prev => [...prev, {
      id,
      creator: { handle: newDel.handle, name: newDel.handle, avatar: newDel.handle.slice(1, 3).toUpperCase(), platform: newDel.platform },
      contentType: newDel.contentType,
      link: '',
      youtube: newDel.platform === 'YouTube' ? { avg30dLong: 0, avg30dShort: 0, liveCCV: 0, likes: 0, comments: 0, er: 0 } : null,
      tiktok: newDel.platform === 'TikTok' ? { views: 0, likes: 0, comments: 0, shares: 0, er: 0 } : null,
      instagram: null, twitter: null,
      twitch: newDel.platform === 'Twitch' ? { avgCCV: 0, peakCCV: 0, vodViews: 0 } : null,
      internalPrice: parseFloat(newDel.internalPrice) || 0,
      clientPrice: parseFloat(newDel.clientPrice) || 0,
      margin: 0, cpm: null, excludeOutlier: false, multiplier: 80, status: 'pending',
    }])
    setNewDel({ handle: '', platform: 'YouTube', contentType: 'Dedicated Video', clientPrice: '', internalPrice: '' })
    setShowAddModal(false)
  }

  return (
    <AppShell>
      <TooltipProvider delayDuration={200}>
        <div className="flex flex-col min-h-full">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="border-b border-border bg-card px-6 py-0 shrink-0">
            {/* Breadcrumb row */}
            <div className="flex items-center gap-2 pt-4 pb-1 text-xs text-muted-foreground">
              <Link href="/campaigns" className="hover:text-foreground transition-colors flex items-center gap-1">
                <ArrowLeft size={12} /> Campaigns
              </Link>
              <span>/</span>
              <span className="text-foreground truncate">{campaign.name}</span>
            </div>

            {/* Title + Action Buttons */}
            <div className="flex items-center justify-between gap-4 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <h1 className="text-sm font-semibold text-foreground truncate">{campaign.name}</h1>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px] shrink-0">
                  {campaign.status}
                </Badge>
                <Badge className="bg-secondary text-muted-foreground text-[10px] shrink-0">
                  {campaign.client}
                </Badge>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
                  {refreshing ? 'Refreshing…' : 'Refresh'}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                      <Download size={11} /> Export <ChevronDown size={9} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border w-52">
                    <DropdownMenuItem className="text-xs gap-2"><FileSpreadsheet size={12} /> Google Sheets</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="text-xs gap-2"><FileText size={12} /> Internal PDF</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs gap-2"><Eye size={12} /> External PDF <span className="text-muted-foreground ml-auto text-[10px]">Masked</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                  <MessageSquare size={11} /> Chat
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                  <Save size={11} /> Save
                </Button>
                <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground gap-1.5" onClick={() => setShowAddModal(true)}>
                  <Plus size={12} /> Add Deliverable
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-0">
              {(['deliverables', 'analytics'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-4 py-2.5 border-b-2 transition-colors -mb-px capitalize ${
                    activeTab === tab
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'analytics' ? 'Analytics' : 'Deliverables'}
                </button>
              ))}
            </div>
          </div>

          {/* ── KPI Cards ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pt-5">
            <KpiCard
              label="Accrued Client Spend"
              value={`$${(totalClientValue / 1000).toFixed(0)}K`}
              sub={`of $${(campaign.budget / 1000).toFixed(0)}K budget`}
              delta={8.4}
              ring={Math.round((totalClientValue / campaign.budget) * 100)}
            />
            <KpiCard
              label="Forecasted Views"
              value={fmt(totalViews)}
              sub={`Target: ${fmt(targetViews)}`}
              delta={isOver ? Math.round((totalViews / targetViews - 1) * 100) : undefined}
              ring={progressPct}
              ringColor={isOver ? '#34d399' : 'hsl(var(--primary))'}
            />
            <KpiCard
              label="Agency Profit"
              value={`$${(totalProfit / 1000).toFixed(0)}K`}
              sub={`${marginPct}% blended margin`}
              delta={3.1}
              ring={marginPct}
              ringColor="#34d399"
              hidden={presentationMode}
            />
          </div>

          {/* ── Tab Content ─────────────────────────────────────────────── */}
          <div className="flex-1 px-6 pb-6 pt-5 space-y-5">

            {activeTab === 'analytics' ? (
              /* ── ANALYTICS TAB ─────────────────────────────────────── */
              <div className="space-y-5">
                {stackedData.length > 0 || analytics.viewsOverTime.length > 0 ? (
                  <>
                    {/* Stacked Bar Chart */}
                    <div className="bg-card border border-border rounded-lg p-5">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Views by Platform Over Time</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Stacked by platform — cumulative views per period</p>
                        </div>
                        <Badge className={`text-[10px] ${isOver ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'}`}>
                          {isOver ? '+' : ''}{Math.round((totalViews / targetViews - 1) * 100)}% vs target
                        </Badge>
                      </div>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stackedData.length > 0 ? stackedData : analytics.viewsOverTime} barSize={28} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={fmt} tickLine={false} axisLine={false} width={40} />
                            <RechartsTooltip content={<StackedBarTooltip />} cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.5 }} />
                            <Legend
                              iconType="square" iconSize={8}
                              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                            />
                            {stackedData.length > 0
                              ? stackedPlatforms.map(p => (
                                  <Bar key={p} dataKey={p} stackId="a" fill={PLATFORM_BAR_COLORS[p] ?? '#94a3b8'} radius={p === stackedPlatforms[stackedPlatforms.length - 1] ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
                                ))
                              : <Bar dataKey="views" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name="Views" />
                            }
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Efficiency & Margin Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* AI Optimization Rate */}
                      <div className="bg-card border border-border rounded-lg p-5">
                        <div className="text-xs font-semibold text-foreground mb-1">AI Optimization Rate</div>
                        <div className="text-[11px] text-muted-foreground mb-4">Views delivered vs predicted</div>
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            <ProgressRing pct={42} size={64} stroke={6} color="#a855f7" />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-foreground">42%</span>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Campaign efficiency</div>
                            <div className="text-sm font-semibold text-foreground mt-0.5">Above average</div>
                          </div>
                        </div>
                      </div>

                      {/* Max Efficiency */}
                      <div className="bg-card border border-border rounded-lg p-5">
                        <div className="text-xs font-semibold text-foreground mb-1">Max Efficiency Potential</div>
                        <div className="text-[11px] text-muted-foreground mb-4">Gain possible with optimal allocation</div>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold font-mono text-emerald-400">+5.4%</div>
                          <div className="text-xs text-muted-foreground">additional views with rebalanced spend across platforms</div>
                        </div>
                      </div>

                      {/* Margin Protection */}
                      <div className={`bg-card border border-border rounded-lg p-5 ${presentationMode ? 'blur-sm select-none pointer-events-none' : ''}`}>
                        <div className="text-xs font-semibold text-foreground mb-1">Margin Protection</div>
                        <div className="text-[11px] text-muted-foreground mb-4">Internal cost vs client price</div>
                        <div className="h-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[{ name: 'Internal', value: totalInternalCost }, { name: 'Client', value: totalClientValue }]} barSize={14}>
                              <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tickLine={false} axisLine={false} />
                              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} width={48} />
                              <RechartsTooltip formatter={(v: number) => `$${(v/1000).toFixed(0)}K`} contentStyle={{ fontSize: 11, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
                              <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                                <Cell fill="#3b82f6" />
                                <Cell fill="#22c55e" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Platform & Content Type Breakdown */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-card border border-border rounded-lg p-5">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Views by Platform</h3>
                        <div className="flex items-center gap-4 h-40">
                          <div className="flex-1 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={analytics.byPlatform} dataKey="views" nameKey="platform" cx="50%" cy="50%" outerRadius={60} innerRadius={32}>
                                  {analytics.byPlatform.map(e => <Cell key={e.platform} fill={PLATFORM_BAR_COLORS[e.platform] ?? e.color} />)}
                                </Pie>
                                <RechartsTooltip content={({ active, payload }) => {
                                  if (!active || !payload?.length) return null
                                  const d = payload[0].payload
                                  return <div className="bg-card border border-border rounded p-2 text-xs"><div className="font-medium">{d.platform}</div><div className="text-muted-foreground">{fmt(d.views)}</div></div>
                                }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="space-y-2 min-w-[120px]">
                            {analytics.byPlatform.map(p => (
                              <div key={p.platform} className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: PLATFORM_BAR_COLORS[p.platform] ?? p.color }} />
                                <span className="text-muted-foreground flex-1">{p.platform}</span>
                                <span className="font-mono text-foreground">{fmt(p.views)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-5">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Views by Content Type</h3>
                        <div className="flex items-center gap-4 h-40">
                          <div className="flex-1 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={analytics.byContentType} dataKey="views" nameKey="type" cx="50%" cy="50%" outerRadius={60} innerRadius={32}>
                                  {analytics.byContentType.map((e, i) => <Cell key={e.type} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip content={({ active, payload }) => {
                                  if (!active || !payload?.length) return null
                                  const d = payload[0].payload
                                  return <div className="bg-card border border-border rounded p-2 text-xs"><div className="font-medium">{d.type}</div><div className="text-muted-foreground">{fmt(d.views)}</div></div>
                                }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="space-y-2 min-w-[120px]">
                            {analytics.byContentType.map((ct, i) => (
                              <div key={ct.type} className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                <span className="text-muted-foreground flex-1 truncate">{ct.type}</span>
                                <span className="font-mono text-foreground">{fmt(ct.views)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Performers */}
                    {analytics.topPerformers.length > 0 && (
                      <div className="bg-card border border-border rounded-lg p-5">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Top Performers</h3>
                        <div className="space-y-2">
                          {analytics.topPerformers.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors">
                              <span className="text-xs font-mono text-muted-foreground w-4 shrink-0">{i + 1}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                  {p.creator} <PlatformIcon platform={p.platform} size={11} />
                                </div>
                                <div className="text-[10px] text-muted-foreground">{p.badge}</div>
                              </div>
                              <div className="text-right">
                                {p.ccv ? <div className="text-xs font-mono text-purple-400">{fmt(p.ccv)} CCV</div> : <div className="text-xs font-mono text-foreground">{fmt(p.views)} views</div>}
                                {p.er > 0 && <div className="text-[10px] text-emerald-400">{p.er}% ER</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-16 text-center">
                    <div className="text-muted-foreground text-sm">No analytics data yet.</div>
                    <p className="text-xs text-muted-foreground/60 mt-1">Analytics populate once deliverables go live.</p>
                  </div>
                )}
              </div>

            ) : (
              /* ── DELIVERABLES TAB ──────────────────────────────────── */
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Column Visibility */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                        <Settings size={11} /> Columns <ChevronDown size={9} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border w-44">
                      <div className="px-2 py-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Metrics</div>
                      {([
                        { key: 'views', label: 'Views' }, { key: 'likes', label: 'Likes' },
                        { key: 'comments', label: 'Comments' }, { key: 'shares', label: 'Shares' },
                        { key: 'er', label: 'ER%' },
                      ] as { key: keyof typeof visibleColumns; label: string }[]).map(col => (
                        <DropdownMenuCheckboxItem key={col.key} checked={visibleColumns[col.key]} onCheckedChange={c => setVisibleColumns(v => ({ ...v, [col.key]: !!c }))} className="text-xs">
                          {col.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator className="bg-border" />
                      <div className="px-2 py-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Financial</div>
                      {!presentationMode && (
                        <DropdownMenuCheckboxItem checked={visibleColumns.internalPrice} onCheckedChange={c => setVisibleColumns(v => ({ ...v, internalPrice: !!c }))} className="text-xs">
                          Internal Price
                        </DropdownMenuCheckboxItem>
                      )}
                      <DropdownMenuCheckboxItem checked={visibleColumns.clientPrice} onCheckedChange={c => setVisibleColumns(v => ({ ...v, clientPrice: !!c }))} className="text-xs">
                        Client Price
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.cpm} onCheckedChange={c => setVisibleColumns(v => ({ ...v, cpm: !!c }))} className="text-xs">
                        CPM
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <span className="text-xs text-muted-foreground">{deliverables.length} deliverables</span>
                </div>

                {/* Borderless Table */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="text-xs w-full min-w-[880px]">
                      <thead>
                        <tr className="border-b border-border/70 bg-secondary/40">
                          <th className="text-center px-5 py-3 w-10">
                            <SortHeader label="" sortKey="platform" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="center" />
                          </th>
                          <th className="text-left px-5 py-3 min-w-[140px]">
                            <SortHeader label="Creator" sortKey="creator" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                          </th>
                          <th className="text-left px-5 py-3 min-w-[140px]">
                            <SortHeader label="Type" sortKey="contentType" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                          </th>
                          {visibleColumns.views && <th className="text-right px-5 py-3"><SortHeader label="Views" sortKey="views" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" /></th>}
                          {visibleColumns.likes && <th className="text-right px-5 py-3"><SortHeader label="Likes" sortKey="likes" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" /></th>}
                          {visibleColumns.comments && <th className="text-right px-5 py-3"><SortHeader label="Comments" sortKey="comments" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" /></th>}
                          {visibleColumns.shares && <th className="text-right px-5 py-3"><SortHeader label="Shares" sortKey="shares" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" /></th>}
                          {visibleColumns.er && <th className="text-right px-5 py-3"><SortHeader label="ER%" sortKey="er" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" /></th>}
                          {!presentationMode && visibleColumns.internalPrice && (
                            <th className="text-right px-5 py-3 border-l border-border/40">
                              <SortHeader label="Internal $" sortKey="internalPrice" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" />
                            </th>
                          )}
                          {visibleColumns.clientPrice && <th className="text-right px-5 py-3"><SortHeader label="Client $" sortKey="clientPrice" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} align="right" /></th>}
                          {visibleColumns.cpm && <th className="text-right px-5 py-3 text-muted-foreground font-medium">CPM</th>}
                          <th className="w-8" />
                        </tr>
                      </thead>
                      <tbody>
                        {sortedDeliverables.map((row, idx) => {
                          const views = getViews(row)
                          const likes = getLikes(row)
                          const comments = getComments(row)
                          const shares = getShares(row)
                          const er = getER(row)
                          const isCCV = !!row.twitch

                          return (
                            <tr key={row.id} className={`border-b border-border/40 hover:bg-secondary/20 transition-colors group ${idx === sortedDeliverables.length - 1 ? 'border-b-0' : ''}`}>
                              {/* Platform */}
                              <td className="px-5 py-3 text-center">
                                <PlatformIcon platform={row.creator.platform} size={15} />
                              </td>
                              {/* Creator */}
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0">
                                    {row.creator.avatar}
                                  </div>
                                  <div>
                                    <div className="font-medium text-foreground">{row.creator.handle}</div>
                                    <div className="text-[10px] text-muted-foreground">{row.creator.name}</div>
                                  </div>
                                </div>
                              </td>
                              {/* Type */}
                              <td className="px-5 py-3">
                                <span className="inline-flex items-center gap-1 text-muted-foreground">
                                  {row.contentType}
                                </span>
                              </td>
                              {/* Views */}
                              {visibleColumns.views && (
                                <td className="px-5 py-3 text-right text-foreground">
                                  {isCCV ? (
                                    <div>
                                      <div className="font-mono tabular-nums">{fmt(row.twitch!.avgCCV)} CCV</div>
                                      <div className="text-[10px] text-muted-foreground">pk {fmt(row.twitch!.peakCCV)}</div>
                                    </div>
                                  ) : <MetricCell value={views} />}
                                </td>
                              )}
                              {visibleColumns.likes && <td className="px-5 py-3 text-right text-foreground"><MetricCell value={likes} /></td>}
                              {visibleColumns.comments && <td className="px-5 py-3 text-right text-foreground"><MetricCell value={comments} /></td>}
                              {visibleColumns.shares && <td className="px-5 py-3 text-right text-foreground"><MetricCell value={shares} /></td>}
                              {visibleColumns.er && (
                                <td className="px-5 py-3 text-right">
                                  {er > 0 ? <span className="font-mono tabular-nums text-emerald-400">{er.toFixed(1)}%</span> : <span className="text-muted-foreground/30">—</span>}
                                </td>
                              )}
                              {/* Financial — blur in presentation mode */}
                              {!presentationMode && visibleColumns.internalPrice && (
                                <td className="px-5 py-3 text-right border-l border-border/30 font-mono tabular-nums text-muted-foreground">
                                  ${(row.internalPrice / 1000).toFixed(0)}K
                                </td>
                              )}
                              {visibleColumns.clientPrice && (
                                <td className="px-5 py-3 text-right font-mono tabular-nums text-foreground">
                                  ${(row.clientPrice / 1000).toFixed(0)}K
                                </td>
                              )}
                              {visibleColumns.cpm && (
                                <td className="px-5 py-3 text-right font-mono tabular-nums text-muted-foreground">
                                  {row.cpm ? `$${row.cpm.toFixed(2)}` : isCCV && row.costPerCCV ? `$${(row.costPerCCV as number).toFixed(2)}/CCV` : <span className="opacity-30">—</span>}
                                </td>
                              )}
                              {/* Row actions */}
                              <td className="pr-3 py-3">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreHorizontal size={13} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-card border-border w-36">
                                    <DropdownMenuItem className="text-xs gap-2">
                                      <CheckCircle size={11} /> Mark Live
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem
                                      className="text-xs gap-2 text-destructive"
                                      onClick={() => setDeliverables(prev => prev.filter(d => d.id !== row.id))}
                                    >
                                      <Trash2 size={11} /> Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      {/* Summary Footer */}
                      <tfoot>
                        <tr className="border-t border-border bg-secondary/30">
                          <td className="px-5 py-2.5" colSpan={3}>
                            <span className="text-xs text-muted-foreground font-medium">{deliverables.length} Deliverables</span>
                          </td>
                          {visibleColumns.views && <td className="px-5 py-2.5 text-right font-mono tabular-nums text-xs text-foreground font-medium">{fmt(totalViews)}</td>}
                          {visibleColumns.likes && <td />}
                          {visibleColumns.comments && <td />}
                          {visibleColumns.shares && <td />}
                          {visibleColumns.er && <td />}
                          {!presentationMode && visibleColumns.internalPrice && (
                            <td className="px-5 py-2.5 text-right font-mono tabular-nums text-xs text-muted-foreground border-l border-border/30">
                              ${(totalInternalCost / 1000).toFixed(0)}K
                            </td>
                          )}
                          {visibleColumns.clientPrice && (
                            <td className="px-5 py-2.5 text-right font-mono tabular-nums text-xs text-foreground font-medium">
                              ${(totalClientValue / 1000).toFixed(0)}K
                            </td>
                          )}
                          {visibleColumns.cpm && <td />}
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Add Deliverable Modal ──────────────────────────────────────── */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="bg-card border-border max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm text-foreground">Add Deliverable</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add a new creator deliverable to this campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Creator Handle</label>
                <Input value={newDel.handle} onChange={e => setNewDel(p => ({ ...p, handle: e.target.value }))} placeholder="@username" className="h-8 text-xs bg-input border-border" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Platform</label>
                  <Select value={newDel.platform} onValueChange={v => setNewDel(p => ({ ...p, platform: v }))}>
                    <SelectTrigger className="h-8 text-xs bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {['YouTube', 'TikTok', 'Twitch', 'Instagram', 'X'].map(pl => (
                        <SelectItem key={pl} value={pl} className="text-xs">{pl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Content Type</label>
                  <Select value={newDel.contentType} onValueChange={v => setNewDel(p => ({ ...p, contentType: v }))}>
                    <SelectTrigger className="h-8 text-xs bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {CONTENT_TYPES.map(ct => (
                        <SelectItem key={ct} value={ct} className="text-xs">{ct}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Client Price ($)</label>
                  <Input value={newDel.clientPrice} onChange={e => setNewDel(p => ({ ...p, clientPrice: e.target.value }))} placeholder="0" type="number" className="h-8 text-xs bg-input border-border" />
                </div>
                {!presentationMode && (
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Internal Price ($)</label>
                    <Input value={newDel.internalPrice} onChange={e => setNewDel(p => ({ ...p, internalPrice: e.target.value }))} placeholder="0" type="number" className="h-8 text-xs bg-input border-border" />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)} className="text-xs h-7 border-border">Cancel</Button>
              <Button size="sm" onClick={addDeliverable} className="text-xs h-7 bg-primary text-primary-foreground">Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </TooltipProvider>
    </AppShell>
  )
}
