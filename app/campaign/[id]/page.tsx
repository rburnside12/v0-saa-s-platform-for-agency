'use client'

import { useState } from 'react'
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
} from 'recharts'
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Plus,
  Sliders,
  ChevronDown,
  ExternalLink,
  Info,
  MoreHorizontal,
  Trash2,
  ArrowLeft,
  RefreshCw,
  FileSpreadsheet,
  Settings,
  Eye,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
import { Switch } from '@/components/ui/switch'
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
  '+ Add New',
]

// Pie chart colors
const PIE_COLORS = ['#FF0000', '#69C9D0', '#9146FF', '#E1306C', '#1DA1F2']

type Deliverable = typeof MOCK_DELIVERABLES[0]

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

function MetricCell({ value, suffix = '', className = '' }: { value: number | null | undefined; suffix?: string; className?: string }) {
  if (value == null) return <span className="text-muted-foreground/40">—</span>
  const formatted = value >= 1000000
    ? `${(value / 1000000).toFixed(2)}M`
    : value >= 1000
    ? `${(value / 1000).toFixed(1)}K`
    : value.toLocaleString()
  return <span className={`font-mono tabular-nums ${className}`}>{formatted}{suffix}</span>
}

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const isOver = current > target
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden min-w-[60px]">
        <div 
          className={`h-full rounded-full transition-all ${isOver ? 'bg-emerald-400' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[10px] font-mono tabular-nums ${isOver ? 'text-emerald-400' : 'text-muted-foreground'}`}>
        {pct.toFixed(0)}%
      </span>
    </div>
  )
}

function ImportArea({ onImport }: { onImport: (links: string[]) => void }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'validating' | 'done'>('idle')

  function handleValidate() {
    setStatus('validating')
    setTimeout(() => {
      const links = text.split('\n').filter(l => l.trim())
      onImport(links)
      setStatus('done')
    }, 800)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Upload size={14} className="text-primary" />
        <span className="text-sm font-medium text-foreground">Bulk Import Deliverables</span>
        <span className="text-xs text-muted-foreground">— Paste social media links, one per line</span>
      </div>
      <Textarea
        placeholder={`https://youtube.com/watch?v=...\nhttps://tiktok.com/@creator/video/...\nhttps://twitch.tv/creator`}
        value={text}
        onChange={e => setText(e.target.value)}
        className="min-h-24 text-xs bg-secondary border-border placeholder:text-muted-foreground/50 font-mono resize-none"
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleValidate}
          disabled={!text.trim() || status === 'validating'}
          className="bg-primary text-primary-foreground text-xs h-7 gap-1.5"
        >
          {status === 'validating' ? (
            <><span className="animate-spin">◌</span> Validating...</>
          ) : (
            <><CheckCircle size={12} /> Validate & Extract</>
          )}
        </Button>
        {status === 'done' && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle size={12} />
            {text.split('\n').filter(l => l.trim()).length} links detected — ready to extract
          </div>
        )}
      </div>
    </div>
  )
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

function DeliverableRow({
  row,
  presentationMode,
  visibleColumns,
  onUpdate,
}: {
  row: Deliverable
  presentationMode: boolean
  visibleColumns: Record<string, boolean>
  onUpdate: (id: string, field: string, value: unknown) => void
}) {
  // Conservative 80% multiplier hardcoded
  const conservativeMultiplier = 0.8
  const rawViews = row.youtube?.avg30dLong ?? row.tiktok?.views ?? 0
  const adjViews = Math.round(rawViews * conservativeMultiplier)
  const targetViews = Math.round(rawViews) // Target is the full expected views
  const cpm = row.cpm ? `$${row.cpm.toFixed(2)}` : null
  const profit = row.clientPrice - row.internalPrice
  const costPerCCV = row.twitch ? (row.internalPrice / row.twitch.avgCCV).toFixed(2) : null

  return (
    <tr className="border-b border-border/50 hover:bg-secondary/20 transition-colors group">
      {/* Creator with Platform Icon */}
      <td className="px-3 py-2.5 sticky left-0 bg-card group-hover:bg-secondary/20 z-10 min-w-[160px]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary text-[10px] font-bold">{row.creator.avatar}</span>
          </div>
          <div>
            <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
              {row.creator.handle}
              <PlatformIcon platform={row.creator.platform} size={12} />
            </div>
          </div>
        </div>
      </td>

      {/* Content Type */}
      <td className="px-2 py-2.5 min-w-[140px]">
        <Select
          value={row.contentType}
          onValueChange={v => onUpdate(row.id, 'contentType', v)}
        >
          <SelectTrigger className="h-6 text-[11px] bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {CONTENT_TYPES.map(t => (
              <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      {/* Progress Bar */}
      <td className="px-3 py-2.5 min-w-[120px]">
        <ProgressBar current={adjViews} target={targetViews} />
      </td>

      {/* Conservative Views */}
      <td className="px-3 py-2.5 text-right text-[11px]">
        <Tooltip>
          <TooltipTrigger>
            <span className="font-mono tabular-nums text-yellow-400"><MetricCell value={adjViews} /></span>
          </TooltipTrigger>
          <TooltipContent className="text-xs bg-card border-border">
            80% conservative estimate applied
          </TooltipContent>
        </Tooltip>
      </td>

      {/* Target Views */}
      <td className="px-3 py-2.5 text-right text-[11px]">
        <span className="font-mono tabular-nums text-muted-foreground"><MetricCell value={targetViews} /></span>
      </td>

      {/* Platform-specific metrics */}
      {visibleColumns.youtube && (
        <>
          <td className="px-3 py-2.5 text-right text-xs border-l border-border/50">
            {row.youtube ? (
              <span className="text-red-400 font-mono tabular-nums text-[11px]">
                <MetricCell value={row.youtube.avg30dLong} />
              </span>
            ) : <span className="text-muted-foreground/30">—</span>}
          </td>
          <td className="px-3 py-2.5 text-right text-[11px]">
            {row.youtube ? <span className={`font-mono tabular-nums ${row.youtube.er > 5 ? 'text-emerald-400' : 'text-foreground'}`}>{row.youtube.er}%</span> : <span className="text-muted-foreground/30">—</span>}
          </td>
        </>
      )}

      {visibleColumns.tiktok && (
        <>
          <td className="px-3 py-2.5 text-right text-[11px] border-l border-border/50">
            {row.tiktok ? <span className="font-mono tabular-nums text-cyan-400"><MetricCell value={row.tiktok.views} /></span> : <span className="text-muted-foreground/30">—</span>}
          </td>
          <td className="px-3 py-2.5 text-right text-[11px]">
            {row.tiktok ? <span className={`font-mono tabular-nums ${row.tiktok.er > 5 ? 'text-emerald-400' : 'text-foreground'}`}>{row.tiktok.er}%</span> : <span className="text-muted-foreground/30">—</span>}
          </td>
        </>
      )}

      {visibleColumns.twitch && (
        <>
          <td className="px-3 py-2.5 text-right text-[11px] border-l border-border/50">
            {row.twitch ? <span className="font-mono tabular-nums text-purple-400"><MetricCell value={row.twitch.avgCCV} /></span> : <span className="text-muted-foreground/30">—</span>}
          </td>
          <td className="px-3 py-2.5 text-right text-[11px]">
            {row.twitch ? <span className="font-mono tabular-nums text-purple-300"><MetricCell value={row.twitch.peakCCV} /></span> : <span className="text-muted-foreground/30">—</span>}
          </td>
        </>
      )}

      {/* Financials */}
      {!presentationMode && visibleColumns.internalPrice && (
        <td className="px-3 py-2.5 text-right text-[11px] border-l border-border/50">
          <span className="font-mono tabular-nums text-foreground">${row.internalPrice.toLocaleString()}</span>
        </td>
      )}
      <td className="px-3 py-2.5 text-right text-[11px]">
        <span className="font-mono tabular-nums text-foreground">${row.clientPrice.toLocaleString()}</span>
      </td>
      {!presentationMode && visibleColumns.profit && (
        <td className="px-3 py-2.5 text-right text-[11px]">
          <span className="font-mono tabular-nums text-emerald-400">${profit.toLocaleString()}</span>
        </td>
      )}
      {!presentationMode && visibleColumns.margin && (
        <td className="px-3 py-2.5 text-right text-[11px]">
          <span className="font-mono tabular-nums text-emerald-400">{row.margin.toFixed(1)}%</span>
        </td>
      )}
      {visibleColumns.cpm && (
        <td className="px-3 py-2.5 text-right text-[11px]">
          {cpm ? <span className="font-mono tabular-nums text-foreground">{cpm}</span> : <span className="text-muted-foreground/30">—</span>}
        </td>
      )}
      {!presentationMode && visibleColumns.costPerCCV && row.twitch && (
        <td className="px-3 py-2.5 text-right text-[11px]">
          <span className="font-mono tabular-nums text-purple-300">${costPerCCV}</span>
        </td>
      )}
      {!presentationMode && visibleColumns.costPerCCV && !row.twitch && (
        <td className="px-3 py-2.5 text-right text-[11px]">
          <span className="text-muted-foreground/30">—</span>
        </td>
      )}

      {/* Actions */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <a href="#" className="text-muted-foreground hover:text-foreground">
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
}

export default function CampaignDashboard({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const [deliverables, setDeliverables] = useState(MOCK_DELIVERABLES)
  const [activeTab, setActiveTab] = useState<'deliverables' | 'import'>('deliverables')
  const [refreshing, setRefreshing] = useState(false)
  const [showAutoRefreshDialog, setShowAutoRefreshDialog] = useState(false)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<'daily' | '6h' | '1h' | 'off'>('off')
  const [visibleColumns, setVisibleColumns] = useState({
    youtube: true,
    tiktok: true,
    twitch: true,
    internalPrice: true,
    profit: true,
    margin: true,
    cpm: true,
    costPerCCV: true,
  })

  // Get campaign analytics
  const analytics = MOCK_CAMPAIGN_ANALYTICS[params.id] || MOCK_CAMPAIGN_ANALYTICS['epic-games-q1']

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

  function handleExportToSheets() {
    // Mock export
    alert('Exported to Google Sheets!')
  }

  const totalClientValue = deliverables.reduce((a, d) => a + d.clientPrice, 0)
  const totalInternalCost = deliverables.reduce((a, d) => a + d.internalPrice, 0)
  const totalProfit = totalClientValue - totalInternalCost
  const avgMargin = ((totalProfit / totalClientValue) * 100).toFixed(1)
  const totalViews = deliverables.reduce((a, d) => {
    if (d.youtube) return a + (d.youtube.avg30dLong ?? 0)
    if (d.tiktok) return a + (d.tiktok.views ?? 0)
    return a
  }, 0)
  const conservativeViews = Math.round(totalViews * 0.8)

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
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('import')}
                className="h-7 text-xs border-border gap-1.5"
              >
                <Upload size={12} /> Bulk Import
              </Button>
              <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground gap-1.5">
                <Plus size={12} /> Add Deliverable
              </Button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Conservative Views', value: formatM(conservativeViews), sub: '80% of projected', icon: Eye },
              { label: 'Client Total', value: `$${(totalClientValue / 1000).toFixed(0)}K`, sub: 'billed value', hidden: false, icon: TrendingUp },
              { label: 'Total Profit', value: `$${(totalProfit / 1000).toFixed(0)}K`, sub: 'agency profit', hidden: true, green: true, icon: TrendingUp },
              { label: 'Blended Margin', value: `${avgMargin}%`, sub: 'avg across campaign', hidden: true, green: true, icon: TrendingUp },
            ].map(({ label, value, sub, hidden, green, icon: Icon }) => {
              if (presentationMode && hidden) return null
              return (
                <div key={label} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                    <div className={`text-base font-semibold font-mono tabular-nums ${green ? 'text-emerald-400' : 'text-foreground'}`}>{value}</div>
                    <div className="text-[10px] text-muted-foreground">{sub}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Analytics Charts (moved from separate Analytics page) */}
          {analytics.viewsOverTime.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Views Over Time Chart */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">Total Views Growth</h3>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px]">
                    +{((analytics.viewsOverTime[analytics.viewsOverTime.length - 1]?.views / analytics.viewsOverTime[analytics.viewsOverTime.length - 1]?.target - 1) * 100).toFixed(0)}% vs target
                  </Badge>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.viewsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatM} tickLine={false} axisLine={false} />
                      <RechartsTooltip content={<CustomChartTooltip />} />
                      <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Actual" />
                      <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Target" />
                    </LineChart>
                  </ResponsiveContainer>
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
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-0.5 border-b border-border">
              {(['deliverables', 'import'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-4 py-2.5 capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'import' ? 'Bulk Import' : 'Deliverables Table'}
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

              {/* Auto-Refresh Settings */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAutoRefreshDialog(true)}
                className="h-7 text-xs border-border gap-1.5"
              >
                <Clock size={11} />
                Auto-Refresh: {autoRefreshInterval === 'off' ? 'Off' : autoRefreshInterval}
              </Button>

              {/* Export to Sheets */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToSheets}
                className="h-7 text-xs border-border gap-1.5"
              >
                <FileSpreadsheet size={11} /> Export
              </Button>

              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                    <Settings size={11} /> View Settings
                    <ChevronDown size={10} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border w-48">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">Platform Columns</div>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.youtube}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, youtube: !!c }))}
                    className="text-xs"
                  >
                    <YouTubeIcon className="w-3 h-3 text-red-500 mr-2" /> YouTube
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.tiktok}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, tiktok: !!c }))}
                    className="text-xs"
                  >
                    <TikTokIcon className="w-3 h-3 text-cyan-400 mr-2" /> TikTok
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.twitch}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, twitch: !!c }))}
                    className="text-xs"
                  >
                    <TwitchIcon className="w-3 h-3 text-purple-500 mr-2" /> Twitch
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">Financial Columns</div>
                  {!presentationMode && (
                    <>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.internalPrice}
                        onCheckedChange={c => setVisibleColumns(v => ({ ...v, internalPrice: !!c }))}
                        className="text-xs"
                      >
                        Internal Price
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.profit}
                        onCheckedChange={c => setVisibleColumns(v => ({ ...v, profit: !!c }))}
                        className="text-xs"
                      >
                        Profit
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.margin}
                        onCheckedChange={c => setVisibleColumns(v => ({ ...v, margin: !!c }))}
                        className="text-xs"
                      >
                        Margin %
                      </DropdownMenuCheckboxItem>
                    </>
                  )}
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.cpm}
                    onCheckedChange={c => setVisibleColumns(v => ({ ...v, cpm: !!c }))}
                    className="text-xs"
                  >
                    CPM
                  </DropdownMenuCheckboxItem>
                  {!presentationMode && (
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.costPerCCV}
                      onCheckedChange={c => setVisibleColumns(v => ({ ...v, costPerCCV: !!c }))}
                      className="text-xs"
                    >
                      Cost/CCV
                    </DropdownMenuCheckboxItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {activeTab === 'import' ? (
            <ImportArea onImport={(links) => console.log('Imported links:', links)} />
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="text-xs w-full min-w-[1200px]">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-secondary border-b border-border">
                      <th className="text-left text-muted-foreground font-medium px-3 py-2.5 sticky left-0 bg-secondary z-30 whitespace-nowrap">Creator</th>
                      <th className="text-left text-muted-foreground font-medium px-2 py-2.5 whitespace-nowrap">Content Type</th>
                      <th className="text-left text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Progress</th>
                      <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Cons. Views</th>
                      <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Target</th>

                      {/* YT Header */}
                      {visibleColumns.youtube && (
                        <>
                          <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap border-l border-border/50">
                            <span className="flex items-center justify-end gap-1.5">
                              <YouTubeIcon className="w-3 h-3 text-red-500" /> 30D Avg
                            </span>
                          </th>
                          <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">ER%</th>
                        </>
                      )}

                      {/* TT Header */}
                      {visibleColumns.tiktok && (
                        <>
                          <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap border-l border-border/50">
                            <span className="flex items-center justify-end gap-1.5">
                              <TikTokIcon className="w-3 h-3 text-cyan-400" /> Views
                            </span>
                          </th>
                          <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">ER%</th>
                        </>
                      )}

                      {/* Twitch Header */}
                      {visibleColumns.twitch && (
                        <>
                          <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap border-l border-border/50">
                            <span className="flex items-center justify-end gap-1.5">
                              <TwitchIcon className="w-3 h-3 text-purple-500" /> Avg CCV
                            </span>
                          </th>
                          <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Peak</th>
                        </>
                      )}

                      {/* Financials */}
                      {!presentationMode && visibleColumns.internalPrice && <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap border-l border-border/50">Internal $</th>}
                      <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Client $</th>
                      {!presentationMode && visibleColumns.profit && <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Profit</th>}
                      {!presentationMode && visibleColumns.margin && <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Margin</th>}
                      {visibleColumns.cpm && <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">CPM</th>}
                      {!presentationMode && visibleColumns.costPerCCV && <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">$/CCV</th>}
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {deliverables.map(row => (
                      <DeliverableRow
                        key={row.id}
                        row={row}
                        presentationMode={presentationMode}
                        visibleColumns={visibleColumns}
                        onUpdate={updateDeliverable}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer totals */}
              <div className="border-t border-border px-4 py-2.5 bg-secondary/50 flex items-center gap-6 text-xs">
                <span className="text-muted-foreground font-medium">{deliverables.length} Deliverables</span>
                <span className="text-muted-foreground">Conservative Views: <span className="text-yellow-400 font-mono">{formatM(conservativeViews)}</span></span>
                {!presentationMode && (
                  <>
                    <span className="text-muted-foreground">Client Total: <span className="text-foreground font-mono">${totalClientValue.toLocaleString()}</span></span>
                    <span className="text-muted-foreground">Total Profit: <span className="text-emerald-400 font-mono">${totalProfit.toLocaleString()}</span></span>
                    <span className="text-muted-foreground">Blended Margin: <span className="text-emerald-400 font-mono">{avgMargin}%</span></span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Auto-Refresh Settings Dialog */}
        <Dialog open={showAutoRefreshDialog} onOpenChange={setShowAutoRefreshDialog}>
          <DialogContent className="bg-card border-border max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm text-foreground flex items-center gap-2">
                <Clock size={15} className="text-primary" />
                Configure Auto-Refresh
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Automatically refresh deliverable stats at your chosen interval.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {[
                { value: 'off', label: 'Off — Manual refresh only' },
                { value: '1h', label: 'Every hour' },
                { value: '6h', label: 'Every 6 hours' },
                { value: 'daily', label: 'Daily (recommended)' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 p-2 rounded hover:bg-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="autoRefresh"
                    checked={autoRefreshInterval === opt.value}
                    onChange={() => setAutoRefreshInterval(opt.value as typeof autoRefreshInterval)}
                    className="accent-primary"
                  />
                  <span className="text-xs text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setShowAutoRefreshDialog(false)} className="bg-primary text-primary-foreground">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </AppShell>
  )
}
