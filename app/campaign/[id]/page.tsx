'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_DELIVERABLES } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
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
  Eye,
  EyeOff,
  ArrowLeft,
  BarChart2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
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
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

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

const PLATFORM_COLORS = {
  YouTube: 'text-red-400',
  TikTok: 'text-cyan-400',
  Twitch: 'text-purple-400',
  Instagram: 'text-pink-400',
  X: 'text-slate-300',
}

type Deliverable = typeof MOCK_DELIVERABLES[0]

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    YouTube: 'bg-red-500/15 text-red-400 border-red-500/20',
    TikTok: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    Twitch: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    Instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    X: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  }
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${colors[platform] ?? 'bg-secondary text-muted-foreground'}`}>
      {platform}
    </span>
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

function ImportArea({ onImport }: { onImport: (links: string[]) => void }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'validating' | 'done'>('idle')

  function handleValidate() {
    setStatus('validating')
    setTimeout(() => {
      const links = text.split('\n').filter(l => l.trim())
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

function DeliverableRow({
  row,
  presentationMode,
  onUpdate,
}: {
  row: Deliverable
  presentationMode: boolean
  onUpdate: (id: string, field: string, value: unknown) => void
}) {
  const margin = presentationMode ? null : row.margin
  const cpm = row.cpm ? `$${row.cpm.toFixed(2)}` : null
  const adjViews = row.youtube
    ? Math.round((row.youtube.avg30dLong ?? 0) * (row.multiplier / 100))
    : row.tiktok
    ? Math.round((row.tiktok.views ?? 0) * (row.multiplier / 100))
    : null

  return (
    <tr className="border-b border-border/50 hover:bg-secondary/20 transition-colors group">
      {/* Creator */}
      <td className="px-3 py-2.5 sticky left-0 bg-card group-hover:bg-secondary/20 z-10 min-w-[160px]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary text-[10px] font-bold">{row.creator.avatar}</span>
          </div>
          <div>
            <div className="text-xs font-medium text-foreground">{row.creator.handle}</div>
            <PlatformBadge platform={row.creator.platform} />
          </div>
        </div>
      </td>

      {/* Content Type */}
      <td className="px-2 py-2.5 min-w-[160px]">
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

      {/* YouTube Metrics */}
      <td className="px-3 py-2.5 text-right text-xs">
        {row.youtube ? (
          <div className="space-y-0.5">
            <div className="text-red-400 font-mono tabular-nums text-[11px]">
              <MetricCell value={row.youtube.avg30dLong} />
            </div>
            <div className="text-muted-foreground font-mono tabular-nums text-[10px]">
              S: <MetricCell value={row.youtube.avg30dShort} />
            </div>
          </div>
        ) : <span className="text-muted-foreground/30">—</span>}
      </td>
      <td className="px-3 py-2.5 text-right text-[11px]">
        <MetricCell value={row.youtube?.likes} />
      </td>
      <td className="px-3 py-2.5 text-right text-[11px]">
        {row.youtube ? <span className={`font-mono tabular-nums ${row.youtube.er > 5 ? 'text-emerald-400' : 'text-foreground'}`}>{row.youtube.er}%</span> : <span className="text-muted-foreground/30">—</span>}
      </td>

      {/* TikTok Metrics */}
      <td className="px-3 py-2.5 text-right text-[11px]">
        {row.tiktok ? <span className="font-mono tabular-nums text-cyan-400"><MetricCell value={row.tiktok.views} /></span> : <span className="text-muted-foreground/30">—</span>}
      </td>
      <td className="px-3 py-2.5 text-right text-[11px]">
        <MetricCell value={row.tiktok?.likes} />
      </td>
      <td className="px-3 py-2.5 text-right text-[11px]">
        {row.tiktok ? <span className={`font-mono tabular-nums ${row.tiktok.er > 5 ? 'text-emerald-400' : 'text-foreground'}`}>{row.tiktok.er}%</span> : <span className="text-muted-foreground/30">—</span>}
      </td>

      {/* Twitch Metrics */}
      <td className="px-3 py-2.5 text-right text-[11px]">
        {row.twitch ? <span className="font-mono tabular-nums text-purple-400"><MetricCell value={row.twitch.avgCCV} /></span> : <span className="text-muted-foreground/30">—</span>}
      </td>
      <td className="px-3 py-2.5 text-right text-[11px]">
        {row.twitch ? <span className="font-mono tabular-nums text-purple-300"><MetricCell value={row.twitch.peakCCV} /></span> : <span className="text-muted-foreground/30">—</span>}
      </td>

      {/* Adj. Views */}
      <td className="px-3 py-2.5 text-right text-[11px]">
        {adjViews != null ? (
          <Tooltip>
            <TooltipTrigger>
              <span className="font-mono tabular-nums text-yellow-400"><MetricCell value={adjViews} /></span>
            </TooltipTrigger>
            <TooltipContent className="text-xs bg-card border-border">
              {row.multiplier}% conservative multiplier applied
            </TooltipContent>
          </Tooltip>
        ) : <span className="text-muted-foreground/30">—</span>}
      </td>

      {/* Logic Controls */}
      <td className="px-3 py-2.5 text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Switch
                checked={row.excludeOutlier}
                onCheckedChange={v => onUpdate(row.id, 'excludeOutlier', v)}
                className="scale-75 data-[state=checked]:bg-yellow-500"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="text-xs bg-card border-border max-w-48">
            Outliers defined as {'>'} 2.5x the median view count for this creator
          </TooltipContent>
        </Tooltip>
      </td>

      {/* Multiplier */}
      <td className="px-3 py-2.5 min-w-[120px]">
        <div className="flex items-center gap-2">
          <Slider
            value={[row.multiplier]}
            min={50}
            max={100}
            step={5}
            onValueChange={([v]) => onUpdate(row.id, 'multiplier', v)}
            className="w-16"
          />
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground w-8">{row.multiplier}%</span>
        </div>
      </td>

      {/* Financials */}
      {!presentationMode && (
        <td className="px-3 py-2.5 min-w-[100px]">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[11px]">$</span>
            <Input
              value={row.internalPrice.toLocaleString()}
              onChange={() => {}}
              className="h-6 pl-5 text-[11px] bg-secondary border-border font-mono w-24"
            />
          </div>
        </td>
      )}
      <td className="px-3 py-2.5 min-w-[100px]">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[11px]">$</span>
          <Input
            value={row.clientPrice.toLocaleString()}
            onChange={() => {}}
            className="h-6 pl-5 text-[11px] bg-secondary border-border font-mono w-24"
          />
        </div>
      </td>
      {!presentationMode && (
        <td className="px-3 py-2.5 text-right text-[11px]">
          <span className="font-mono tabular-nums text-emerald-400">{row.margin.toFixed(1)}%</span>
        </td>
      )}
      <td className="px-3 py-2.5 text-right text-[11px]">
        {cpm ? <span className="font-mono tabular-nums text-foreground">{cpm}</span> : <span className="text-muted-foreground/30">—</span>}
      </td>
      {!presentationMode && (
        <td className="px-3 py-2.5 text-right text-[11px]">
          {row.costPerCCV ? <span className="font-mono tabular-nums text-purple-300">${row.costPerCCV.toFixed(2)}</span> : <span className="text-muted-foreground/30">—</span>}
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

  function updateDeliverable(id: string, field: string, value: unknown) {
    setDeliverables(prev =>
      prev.map(d => d.id === id ? { ...d, [field]: value } : d)
    )
  }

  const totalClientValue = deliverables.reduce((a, d) => a + d.clientPrice, 0)
  const totalInternalCost = deliverables.reduce((a, d) => a + d.internalPrice, 0)
  const avgMargin = ((totalClientValue - totalInternalCost) / totalClientValue * 100).toFixed(1)
  const totalViews = deliverables.reduce((a, d) => {
    if (d.youtube) return a + (d.youtube.avg30dLong ?? 0)
    if (d.tiktok) return a + (d.tiktok.views ?? 0)
    return a
  }, 0)

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
              <p className="text-xs text-muted-foreground mt-0.5">Jan 15 – Mar 31, 2025 · 24 Deliverables · Managed by Sarah K.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/analytics?campaigns=${params.id}`}>
                <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                  <BarChart2 size={12} /> Analytics
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                <Sliders size={12} /> Configure
              </Button>
              <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground gap-1.5">
                <Plus size={12} /> Add Deliverable
              </Button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Projected Views', value: `${(totalViews / 1000000).toFixed(1)}M`, sub: 'across all platforms' },
              { label: 'Client Total', value: `$${(totalClientValue / 1000).toFixed(0)}K`, sub: 'billed value', hidden: false },
              { label: 'Internal Cost', value: `$${(totalInternalCost / 1000).toFixed(0)}K`, sub: 'agency cost', hidden: true },
              { label: 'Blended Margin', value: `${avgMargin}%`, sub: 'avg across campaign', hidden: true, green: true },
            ].map(({ label, value, sub, hidden, green }) => {
              if (presentationMode && hidden) return null
              return (
                <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
                  <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
                  <div className={`text-base font-semibold font-mono tabular-nums ${green ? 'text-emerald-400' : 'text-foreground'}`}>{value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
                </div>
              )
            })}
          </div>

          {/* Tabs */}
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

          {activeTab === 'import' ? (
            <ImportArea onImport={(links) => console.log('[v0] Imported links:', links)} />
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="text-xs w-full min-w-[1400px]">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-secondary border-b border-border">
                      <th className="text-left text-muted-foreground font-medium px-3 py-2.5 sticky left-0 bg-secondary z-30 whitespace-nowrap">Creator</th>
                      <th className="text-left text-muted-foreground font-medium px-2 py-2.5 whitespace-nowrap">Content Type</th>

                      {/* YT Header */}
                      <th colSpan={3} className="text-center border-l border-border/50">
                        <span className="text-[10px] font-semibold text-red-400 px-2">YouTube</span>
                      </th>

                      {/* TT Header */}
                      <th colSpan={3} className="text-center border-l border-border/50">
                        <span className="text-[10px] font-semibold text-cyan-400 px-2">TikTok</span>
                      </th>

                      {/* Twitch Header */}
                      <th colSpan={2} className="text-center border-l border-border/50">
                        <span className="text-[10px] font-semibold text-purple-400 px-2">Twitch</span>
                      </th>

                      <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap border-l border-border/50">Adj. Views</th>
                      <th className="text-center text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          Excl. Outlier
                          <Tooltip>
                            <TooltipTrigger><Info size={10} /></TooltipTrigger>
                            <TooltipContent className="text-xs bg-card border-border max-w-48">Outliers defined as {'>'} 2.5x the median</TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                      <th className="text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Multiplier</th>

                      {/* Financials */}
                      {!presentationMode && <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap border-l border-border/50">Internal $</th>}
                      <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Client $</th>
                      {!presentationMode && <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Margin</th>}
                      <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">CPM</th>
                      {!presentationMode && <th className="text-right text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">$/CCV</th>}
                      <th className="w-8" />
                    </tr>
                    {/* Sub-headers */}
                    <tr className="bg-secondary/70 border-b border-border text-[10px] text-muted-foreground">
                      <th className="sticky left-0 bg-secondary/70 z-30" />
                      <th />
                      <th className="text-right px-3 py-1 border-l border-border/50 whitespace-nowrap">30D Avg (L/S)</th>
                      <th className="text-right px-3 py-1 whitespace-nowrap">Likes</th>
                      <th className="text-right px-3 py-1 whitespace-nowrap">ER%</th>
                      <th className="text-right px-3 py-1 border-l border-border/50 whitespace-nowrap">Views</th>
                      <th className="text-right px-3 py-1 whitespace-nowrap">Likes</th>
                      <th className="text-right px-3 py-1 whitespace-nowrap">ER%</th>
                      <th className="text-right px-3 py-1 border-l border-border/50 whitespace-nowrap">Avg CCV</th>
                      <th className="text-right px-3 py-1 whitespace-nowrap">Peak CCV</th>
                      <th colSpan={3} />
                      {!presentationMode && <th className="border-l border-border/50" />}
                      <th colSpan={presentationMode ? 2 : 4} />
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {deliverables.map(row => (
                      <DeliverableRow
                        key={row.id}
                        row={row}
                        presentationMode={presentationMode}
                        onUpdate={updateDeliverable}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer totals */}
              <div className="border-t border-border px-4 py-2.5 bg-secondary/50 flex items-center gap-6 text-xs">
                <span className="text-muted-foreground font-medium">{deliverables.length} Deliverables</span>
                <span className="text-muted-foreground">Total Adj. Views: <span className="text-yellow-400 font-mono">{(totalViews * 0.8 / 1000000).toFixed(1)}M</span></span>
                {!presentationMode && (
                  <>
                    <span className="text-muted-foreground">Client Total: <span className="text-foreground font-mono">${totalClientValue.toLocaleString()}</span></span>
                    <span className="text-muted-foreground">Blended Margin: <span className="text-emerald-400 font-mono">{avgMargin}%</span></span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    </AppShell>
  )
}
