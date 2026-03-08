'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_ANALYTICS } from '@/lib/mock-data'
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
  Legend,
} from 'recharts'
import {
  FileText,
  Download,
  TrendingUp,
  Eye,
  Share2,
  CheckCircle,
  BarChart2,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const formatM = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
  return v.toString()
}

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

function ReportPreview({ open, onClose }: { open: boolean; onClose: () => void }) {
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

        {/* Report Preview */}
        <div className="bg-background border border-border/50 rounded-lg p-6 space-y-5">
          {/* Report Header */}
          <div className="flex items-start justify-between border-b border-border/50 pb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">CAMPAIGN PERFORMANCE REPORT</div>
              <h2 className="text-base font-semibold text-foreground">Fortnite Chapter 5 — Q1 2025</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Epic Games · Jan 15 – Mar 31, 2025</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground">Prepared by</div>
              <div className="text-xs font-medium text-foreground">CherryPick Talent</div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Views', value: '48.2M', sub: 'across all platforms' },
              { label: 'Avg. Engagement', value: '4.2%', sub: 'above industry avg.' },
              { label: 'Deliverables', value: '24', sub: 'completed on schedule' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-secondary rounded p-3 text-center">
                <div className="text-xl font-bold font-mono tabular-nums text-foreground">{value}</div>
                <div className="text-[10px] text-foreground font-medium mt-0.5">{label}</div>
                <div className="text-[10px] text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>

          {/* Platform breakdown */}
          <div>
            <div className="text-xs font-medium text-foreground mb-3">Performance by Platform</div>
            <div className="space-y-2">
              {MOCK_ANALYTICS.byPlatform.map(p => (
                <div key={p.platform} className="flex items-center gap-3">
                  <div className="w-20 text-[11px] text-muted-foreground shrink-0">{p.platform}</div>
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(p.views / MOCK_ANALYTICS.byPlatform[0].views) * 100}%`,
                        background: p.color,
                      }}
                    />
                  </div>
                  <div className="w-16 text-right text-[11px] font-mono tabular-nums text-foreground">{formatM(p.views)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/50">
            Prepared by CherryPick Talent · Confidential — for client use only
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

export default function AnalyticsPage() {
  const { presentationMode } = usePresentationMode()
  const [showReport, setShowReport] = useState(false)
  const [activeMetric, setActiveMetric] = useState<'views' | 'target'>('views')

  const totalViews = MOCK_ANALYTICS.byPlatform.reduce((a, p) => a + p.views, 0)

  return (
    <AppShell>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Analytics & Reporting</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Fortnite Chapter 5 — Q1 2025 Bundle</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 text-xs bg-primary text-primary-foreground gap-1.5"
              onClick={() => setShowReport(true)}
            >
              <FileText size={12} /> Generate Shareable Report
            </Button>
          </div>
        </div>

        {/* Stat Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Views', value: formatM(totalViews), icon: Eye, green: false },
            { label: 'Views vs Target', value: '+14.8%', icon: TrendingUp, green: true },
            { label: 'Avg ER%', value: '4.8%', icon: BarChart2, green: false },
            { label: 'Days Running', value: '51', icon: Clock, green: false },
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
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MOCK_ANALYTICS.viewsOverTime}>
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
          </div>

          {/* Pie: By Platform */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-sm font-medium text-foreground mb-1">Views by Platform</h2>
            <p className="text-[10px] text-muted-foreground mb-3">Share of total {formatM(totalViews)} views</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={MOCK_ANALYTICS.byPlatform}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="views"
                >
                  {MOCK_ANALYTICS.byPlatform.map((entry, i) => (
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
              {MOCK_ANALYTICS.byPlatform.map(p => (
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
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie: By Content Type */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-sm font-medium text-foreground mb-1">Views by Content Type</h2>
            <p className="text-[10px] text-muted-foreground mb-3">Breakdown across campaign formats</p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={MOCK_ANALYTICS.byContentType}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="views"
                  >
                    {MOCK_ANALYTICS.byContentType.map((entry, i) => (
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
                {MOCK_ANALYTICS.byContentType.map(ct => (
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
          </div>

          {/* Top Performers */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-sm font-medium text-foreground mb-3">Top Performing Deliverables</h2>
            <div className="space-y-2">
              {[
                { creator: '@SypherPK', platform: 'YouTube', views: 2800000, er: 5.4, badge: 'Dedicated Video' },
                { creator: '@Ninja', platform: 'Twitch', views: 0, er: 0, ccv: 38000, badge: 'Dedicated Stream' },
                { creator: '@Clix', platform: 'TikTok', views: 8400000, er: 7.8, badge: 'Sponsorship' },
                { creator: '@Nickmercs', platform: 'Twitch', views: 0, er: 0, ccv: 28000, badge: 'Dedicated Stream' },
              ].map((item, i) => (
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
          </div>
        </div>
      </div>

      <ReportPreview open={showReport} onClose={() => setShowReport(false)} />
    </AppShell>
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
