'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { MOCK_CAMPAIGNS, MOCK_CAMPAIGN_ANALYTICS } from '@/lib/mock-data'
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
  FileText,
  Download,
  TrendingUp,
  Eye,
  Share2,
  BarChart2,
  Clock,
  ChevronDown,
  Search,
  CheckSquare,
  Square,
  X,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const formatM = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
  return v.toString()
}

const ALL_CLIENTS = ['Epic Games', 'Riot Games', 'Nike', 'AMD']

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
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

function ReportPreview({ open, onClose, campaigns }: { open: boolean; onClose: () => void; campaigns: typeof MOCK_CAMPAIGNS }) {
  const totalViews = campaigns.reduce((a, c) => a + c.totalViews, 0)
  const avgEr = campaigns.length > 0 ? (campaigns.reduce((a, c) => a + c.avgEngagementRate, 0) / campaigns.length).toFixed(1) : '0'
  const totalDeliverables = campaigns.reduce((a, c) => a + c.deliverables, 0)

  // Aggregate platform data
  const platformMap = new Map<string, number>()
  campaigns.forEach(c => {
    const analytics = MOCK_CAMPAIGN_ANALYTICS[c.id]
    if (analytics?.byPlatform) {
      analytics.byPlatform.forEach(p => {
        platformMap.set(p.platform, (platformMap.get(p.platform) || 0) + p.views)
      })
    }
  })
  const platformData = Array.from(platformMap.entries())
    .map(([platform, views]) => ({ platform, views, color: platform === 'YouTube' ? '#FF0000' : platform === 'Twitch' ? '#9146FF' : platform === 'TikTok' ? '#69C9D0' : platform === 'Instagram' ? '#E1306C' : '#FFFFFF' }))
    .sort((a, b) => b.views - a.views)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm text-foreground flex items-center gap-2">
            <FileText size={15} className="text-primary" />
            Shareable Campaign Report
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            External-facing summary — all internal agency pricing is stripped.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-background border border-border/50 rounded-lg p-6 space-y-5">
          <div className="flex items-start justify-between border-b border-border/50 pb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">CAMPAIGN PERFORMANCE REPORT</div>
              <h2 className="text-base font-semibold text-foreground">
                {campaigns.length === 1 ? campaigns[0].name : `${campaigns.length} Campaigns Combined`}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {campaigns.map(c => c.client).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground">Prepared by</div>
              <div className="text-xs font-medium text-foreground">CherryPick Talent</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Views', value: formatM(totalViews), sub: 'across all platforms' },
              { label: 'Avg. Engagement', value: `${avgEr}%`, sub: 'above industry avg.' },
              { label: 'Deliverables', value: totalDeliverables.toString(), sub: 'completed on schedule' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-secondary rounded p-3 text-center">
                <div className="text-xl font-bold font-mono tabular-nums text-foreground">{value}</div>
                <div className="text-[10px] text-foreground font-medium mt-0.5">{label}</div>
                <div className="text-[10px] text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>

          {platformData.length > 0 && (
            <div>
              <div className="text-xs font-medium text-foreground mb-3">Performance by Platform</div>
              <div className="space-y-2">
                {platformData.map(p => (
                  <div key={p.platform} className="flex items-center gap-3">
                    <div className="w-20 text-[11px] text-muted-foreground shrink-0">{p.platform}</div>
                    <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(p.views / platformData[0].views) * 100}%`,
                          background: p.color,
                        }}
                      />
                    </div>
                    <div className="w-16 text-right text-[11px] font-mono tabular-nums text-foreground">{formatM(p.views)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/50">
            Prepared by CherryPick Talent — Confidential — for client use only
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 h-8 text-xs bg-primary text-primary-foreground gap-1.5">
            <Download size={12} /> Download PDF
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs border-border gap-1.5">
            <Share2 size={12} /> Share Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AnalyticsPageContent() {
  const searchParams = useSearchParams()
  const { presentationMode } = usePresentationMode()
  const [showReport, setShowReport] = useState(false)
  const [activeMetric, setActiveMetric] = useState<'views' | 'target'>('views')
  const [search, setSearch] = useState('')
  const [selectedClients, setSelectedClients] = useState<string[]>([])

  // Initialize selected campaigns from URL params
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>(() => {
    const urlCampaigns = searchParams.get('campaigns')
    return urlCampaigns ? urlCampaigns.split(',') : []
  })

  // Update selected campaigns when URL changes
  useEffect(() => {
    const urlCampaigns = searchParams.get('campaigns')
    if (urlCampaigns) {
      setSelectedCampaignIds(urlCampaigns.split(','))
    }
  }, [searchParams])

  // Filter campaigns by search and client
  const filteredCampaigns = MOCK_CAMPAIGNS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase())
    const matchClient = selectedClients.length === 0 || selectedClients.includes(c.client)
    return matchSearch && matchClient
  })

  // Selected campaign objects
  const selectedCampaigns = MOCK_CAMPAIGNS.filter(c => selectedCampaignIds.includes(c.id))

  // Aggregate analytics for selected campaigns
  const aggregatedAnalytics = useMemo(() => {
    if (selectedCampaigns.length === 0) return null

    // Aggregate views over time (simplified: use first campaign's timeline)
    const viewsOverTime = selectedCampaigns.length === 1
      ? MOCK_CAMPAIGN_ANALYTICS[selectedCampaigns[0].id]?.viewsOverTime || []
      : selectedCampaigns[0] ? (MOCK_CAMPAIGN_ANALYTICS[selectedCampaigns[0].id]?.viewsOverTime || []).map((point, i) => {
          const totalViews = selectedCampaigns.reduce((sum, camp) => {
            const campAnalytics = MOCK_CAMPAIGN_ANALYTICS[camp.id]
            return sum + (campAnalytics?.viewsOverTime?.[i]?.views || 0)
          }, 0)
          const totalTarget = selectedCampaigns.reduce((sum, camp) => {
            const campAnalytics = MOCK_CAMPAIGN_ANALYTICS[camp.id]
            return sum + (campAnalytics?.viewsOverTime?.[i]?.target || 0)
          }, 0)
          return { date: point.date, views: totalViews, target: totalTarget }
        }) : []

    // Aggregate by platform
    const platformMap = new Map<string, { views: number; color: string }>()
    selectedCampaigns.forEach(c => {
      const analytics = MOCK_CAMPAIGN_ANALYTICS[c.id]
      analytics?.byPlatform?.forEach(p => {
        const existing = platformMap.get(p.platform)
        platformMap.set(p.platform, {
          views: (existing?.views || 0) + p.views,
          color: p.color,
        })
      })
    })
    const byPlatform = Array.from(platformMap.entries())
      .map(([platform, data]) => ({ platform, ...data }))
      .sort((a, b) => b.views - a.views)

    // Aggregate by content type
    const contentMap = new Map<string, { views: number; color: string }>()
    selectedCampaigns.forEach(c => {
      const analytics = MOCK_CAMPAIGN_ANALYTICS[c.id]
      analytics?.byContentType?.forEach(ct => {
        const existing = contentMap.get(ct.type)
        contentMap.set(ct.type, {
          views: (existing?.views || 0) + ct.views,
          color: ct.color,
        })
      })
    })
    const byContentType = Array.from(contentMap.entries())
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.views - a.views)

    // Aggregate top performers
    const allPerformers = selectedCampaigns.flatMap(c =>
      (MOCK_CAMPAIGN_ANALYTICS[c.id]?.topPerformers || []).map(p => ({ ...p, campaignId: c.id }))
    )
    const topPerformers = allPerformers
      .sort((a, b) => (b.ccv || b.views) - (a.ccv || a.views))
      .slice(0, 5)

    return { viewsOverTime, byPlatform, byContentType, topPerformers }
  }, [selectedCampaigns])

  const totalViews = selectedCampaigns.reduce((a, c) => a + c.totalViews, 0)
  const targetViews = aggregatedAnalytics?.viewsOverTime.reduce((a, p) => Math.max(a, p.target), 0) || 0
  const viewsVsTarget = targetViews > 0 ? (((totalViews - targetViews) / targetViews) * 100).toFixed(1) : '0'
  const avgEr = selectedCampaigns.length > 0 
    ? (selectedCampaigns.reduce((a, c) => a + c.avgEngagementRate, 0) / selectedCampaigns.length).toFixed(1) 
    : '0'

  function toggleCampaign(id: string) {
    setSelectedCampaignIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function toggleClient(client: string) {
    setSelectedClients(prev => 
      prev.includes(client) ? prev.filter(x => x !== client) : [...prev, client]
    )
  }

  function clearAllSelections() {
    setSelectedCampaignIds([])
  }

  return (
    <AppShell>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Analytics & Reporting</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedCampaigns.length === 0
                ? 'Select campaigns to view analytics'
                : selectedCampaigns.length === 1
                ? selectedCampaigns[0].name
                : `${selectedCampaigns.length} campaigns selected`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCampaigns.length > 0 && (
              <Button
                size="sm"
                className="h-7 text-xs bg-primary text-primary-foreground gap-1.5"
                onClick={() => setShowReport(true)}
              >
                <FileText size={12} /> Generate Shareable Report
              </Button>
            )}
          </div>
        </div>

        {/* Campaign Selection */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <BarChart2 size={13} className="text-primary" />
              Campaign Selection
            </div>
            {selectedCampaignIds.length > 0 && (
              <button
                className="text-xs text-muted-foreground hover:text-foreground underline"
                onClick={clearAllSelections}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-7 pl-7 text-xs bg-secondary border-border w-48"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs border-border bg-secondary gap-1.5">
                  <Filter size={11} /> Client {selectedClients.length > 0 && `(${selectedClients.length})`}
                  <ChevronDown size={10} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border w-40">
                {ALL_CLIENTS.map(c => (
                  <DropdownMenuItem key={c} className="text-xs gap-2 cursor-pointer" onClick={() => toggleClient(c)}>
                    {selectedClients.includes(c) ? <CheckSquare size={11} className="text-primary" /> : <Square size={11} />}
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedClients.length > 0 && (
              <button
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedClients([])}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Campaign chips / selection */}
          <div className="flex flex-wrap gap-2">
            {filteredCampaigns.map(c => {
              const isSelected = selectedCampaignIds.includes(c.id)
              const hasData = MOCK_CAMPAIGN_ANALYTICS[c.id]?.viewsOverTime?.length > 0
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCampaign(c.id)}
                  disabled={!hasData && !isSelected}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs transition-all ${
                    isSelected
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : hasData
                      ? 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                      : 'bg-secondary/50 border-border/50 text-muted-foreground/50 cursor-not-allowed'
                  }`}
                >
                  {isSelected ? <CheckSquare size={11} /> : <Square size={11} />}
                  <span className="font-medium">{c.name}</span>
                  <span className="text-[10px] opacity-70">{c.client}</span>
                  {!hasData && <span className="text-[10px] text-yellow-500">No data</span>}
                </button>
              )
            })}
          </div>

          {/* Selected campaigns summary */}
          {selectedCampaigns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
              {selectedCampaigns.map(c => (
                <Badge
                  key={c.id}
                  className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1 pr-1"
                >
                  {c.name}
                  <button
                    onClick={() => toggleCampaign(c.id)}
                    className="ml-1 hover:bg-primary/20 rounded p-0.5"
                  >
                    <X size={10} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Analytics Content */}
        {selectedCampaigns.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <BarChart2 size={32} className="mx-auto mb-3 text-muted-foreground/40" />
            <div className="text-sm text-muted-foreground">Select one or more campaigns above to view analytics</div>
            <div className="text-xs text-muted-foreground/60 mt-1">You can compare multiple campaigns side-by-side</div>
          </div>
        ) : (
          <>
            {/* Stat Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Views', value: formatM(totalViews), icon: Eye, green: false },
                { label: 'Views vs Target', value: `${Number(viewsVsTarget) > 0 ? '+' : ''}${viewsVsTarget}%`, icon: TrendingUp, green: Number(viewsVsTarget) > 0 },
                { label: 'Avg ER%', value: `${avgEr}%`, icon: BarChart2, green: false },
                { label: 'Campaigns', value: selectedCampaigns.length.toString(), icon: Clock, green: false },
              ].map(({ label, value, icon: Icon, green }) => (
                <div key={label} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                    <div className={`text-sm font-semibold font-mono tabular-nums ${green ? 'text-emerald-400' : 'text-foreground'}`}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Line Chart */}
              <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-medium text-foreground">Viewership Over Time</h2>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Cumulative views vs target</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['views', 'target'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setActiveMetric(m)}
                        className={`text-[10px] px-2.5 py-1 rounded transition-colors ${
                          activeMetric === m ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {m === 'views' ? 'Actual' : 'Target'}
                      </button>
                    ))}
                  </div>
                </div>
                {aggregatedAnalytics?.viewsOverTime && aggregatedAnalytics.viewsOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={aggregatedAnalytics.viewsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: 'oklch(0.55 0 0)' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: 'oklch(0.55 0 0)' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={formatM}
                        width={40}
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="views"
                        name="Actual Views"
                        stroke="oklch(0.60 0.22 25)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: 'oklch(0.60 0.22 25)', strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Target"
                        stroke="oklch(0.55 0 0)"
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground text-xs">
                    No timeline data available
                  </div>
                )}
              </div>

              {/* Pie: By Platform */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-sm font-medium text-foreground mb-1">Views by Platform</h2>
                <p className="text-[10px] text-muted-foreground mb-3">Share of total {formatM(totalViews)} views</p>
                {aggregatedAnalytics?.byPlatform && aggregatedAnalytics.byPlatform.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={aggregatedAnalytics.byPlatform}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="views"
                        >
                          {aggregatedAnalytics.byPlatform.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number) => [formatM(value), '']}
                          contentStyle={{ background: 'oklch(0.13 0 0)', border: '1px solid oklch(0.22 0 0)', borderRadius: '6px', fontSize: '11px' }}
                          labelStyle={{ color: 'oklch(0.55 0 0)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                      {aggregatedAnalytics.byPlatform.map(p => (
                        <div key={p.platform} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                            <span className="text-muted-foreground">{p.platform}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono tabular-nums text-foreground">{formatM(p.views)}</span>
                            <span className="text-muted-foreground w-10 text-right">{((p.views / totalViews) * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[260px] flex items-center justify-center text-muted-foreground text-xs">
                    No platform data available
                  </div>
                )}
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Bar: By Content Type */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-sm font-medium text-foreground mb-1">Views by Content Type</h2>
                <p className="text-[10px] text-muted-foreground mb-3">Breakdown across campaign formats</p>
                {aggregatedAnalytics?.byContentType && aggregatedAnalytics.byContentType.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={aggregatedAnalytics.byContentType}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={72}
                          paddingAngle={2}
                          dataKey="views"
                        >
                          {aggregatedAnalytics.byContentType.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number) => [formatM(value), '']}
                          contentStyle={{ background: 'oklch(0.13 0 0)', border: '1px solid oklch(0.22 0 0)', borderRadius: '6px', fontSize: '11px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {aggregatedAnalytics.byContentType.map(ct => (
                        <div key={ct.type} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ct.color }} />
                            <span className="text-muted-foreground">{ct.type}</span>
                          </div>
                          <span className="font-mono tabular-nums text-foreground">{formatM(ct.views)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[160px] flex items-center justify-center text-muted-foreground text-xs">
                    No content type data available
                  </div>
                )}
              </div>

              {/* Top Performers */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-sm font-medium text-foreground mb-3">Top Performing Deliverables</h2>
                {aggregatedAnalytics?.topPerformers && aggregatedAnalytics.topPerformers.length > 0 ? (
                  <div className="space-y-2">
                    {aggregatedAnalytics.topPerformers.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                        <div className="text-xs font-mono text-muted-foreground w-4 shrink-0">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground">{item.creator}</span>
                            <PlatformBadge platform={item.platform} />
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{item.badge}</div>
                        </div>
                        <div className="text-right shrink-0">
                          {item.ccv ? (
                            <div className="text-xs font-mono tabular-nums text-purple-400">{formatM(item.ccv)} CCV</div>
                          ) : (
                            <div className="text-xs font-mono tabular-nums text-foreground">{formatM(item.views)}</div>
                          )}
                          {item.er > 0 && <div className="text-[10px] text-emerald-400">{item.er}% ER</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[160px] flex items-center justify-center text-muted-foreground text-xs">
                    No performer data available
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <ReportPreview open={showReport} onClose={() => setShowReport(false)} campaigns={selectedCampaigns} />
    </AppShell>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <AppShell>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground text-sm">Loading analytics...</div>
        </div>
      </AppShell>
    }>
      <AnalyticsPageContent />
    </Suspense>
  )
}
