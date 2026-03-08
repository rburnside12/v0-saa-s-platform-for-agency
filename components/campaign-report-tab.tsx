'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import {
  FileDown,
  Eye,
  LayoutGrid,
  BarChart2,
  Table2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Trophy,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────

type MetricKey =
  | 'totalViews'
  | 'engagementRate'
  | 'contentDeliverables'
  | 'externalCpm'
  | 'totalSpend'
  | 'totalEngagements'
  | 'internalCpm'
  | 'profitMargin'

type ChartKey =
  | 'viewsOverTime'
  | 'viewsByPlatform'
  | 'topCreators'
  | 'costBreakdown'
  | 'topPosts'
  | 'erByPlatform'

type SectionKey = 'deliverablesTable' | 'executiveSummary'

interface ReportConfig {
  reportTitle: string
  clientName: string
  preparedBy: string
  notes: string
  metrics: Record<MetricKey, boolean>
  charts: Record<ChartKey, boolean>
  sections: Record<SectionKey, boolean>
  colorTheme: 'purple' | 'blue' | 'green' | 'mono'
  logoPosition: 'left' | 'right' | 'none'
}

// ── Mock data (same as analytics tab) ────────────

const chartData = [
  { date: '03.01', YouTube: 1200000, Twitch: 600000, TikTok: 300000, Instagram: 150000 },
  { date: '03.07', YouTube: 1400000, Twitch: 700000, TikTok: 350000, Instagram: 175000 },
  { date: '03.13', YouTube: 1680000, Twitch: 840000, TikTok: 420000, Instagram: 210000 },
  { date: '03.19', YouTube: 1920000, Twitch: 960000, TikTok: 480000, Instagram: 240000 },
]

const viewsBreakdownData = [
  { name: 'YouTube', value: 1450000, color: '#FF0000' },
  { name: 'Twitch', value: 680000, color: '#9146FF' },
  { name: 'TikTok', value: 451450, color: '#8B5CF6' },
  { name: 'Instagram', value: 200000, color: '#E1306C' },
]

const topCreatorsData = [
  { name: 'MrBeast', value: 892000, color: '#7C3AED' },
  { name: 'Pokimane', value: 654000, color: '#9146FF' },
  { name: 'Ninja', value: 521000, color: '#10B981' },
  { name: 'xQc', value: 412000, color: '#F59E0B' },
  { name: 'Others', value: 302450, color: '#6B7280' },
]

const costBreakdownData = [
  { name: 'YouTube', value: 52000, color: '#FF0000' },
  { name: 'Twitch', value: 38000, color: '#9146FF' },
  { name: 'TikTok', value: 24450, color: '#8B5CF6' },
  { name: 'Instagram', value: 14000, color: '#E1306C' },
]

const topPostsData = [
  { rank: 1, creator: 'MrBeast', type: 'Dedicated Video', platform: 'YouTube', views: 456000, er: 6.2 },
  { rank: 2, creator: 'Pokimane', type: 'Stream', platform: 'Twitch', views: 324000, er: 8.4 },
  { rank: 3, creator: 'Ninja', type: 'YouTube Short', platform: 'YouTube', views: 287000, er: 4.8 },
  { rank: 4, creator: 'xQc', type: 'Sponsorship', platform: 'Twitch', views: 198000, er: 7.1 },
  { rank: 5, creator: 'Valkyrae', type: 'Dedicated Video', platform: 'YouTube', views: 176000, er: 5.9 },
]

const erByPlatformData = [
  { platform: 'YouTube', er: 5.2 },
  { platform: 'Twitch', er: 7.8 },
  { platform: 'TikTok', er: 6.4 },
  { platform: 'Instagram', er: 4.1 },
]

const mockDeliverables = [
  { creator: 'MrBeast', platform: 'YouTube', type: 'Dedicated Video', views: 456000, er: '6.2%', spend: '$28,000', cpm: '$61.40', date: 'Feb 28, 2026' },
  { creator: 'Pokimane', platform: 'Twitch', type: 'Stream', views: 324000, er: '8.4%', spend: '$18,000', cpm: '$55.56', date: 'Mar 2, 2026' },
  { creator: 'Ninja', platform: 'YouTube', type: 'YouTube Short', views: 287000, er: '4.8%', spend: '$22,000', cpm: '$76.65', date: 'Mar 5, 2026' },
  { creator: 'xQc', platform: 'Twitch', type: 'Sponsorship', views: 198000, er: '7.1%', spend: '$16,000', cpm: '$80.81', date: 'Mar 7, 2026' },
  { creator: 'Valkyrae', platform: 'YouTube', type: 'Dedicated Video', views: 176000, er: '5.9%', spend: '$14,450', cpm: '$82.10', date: 'Mar 8, 2026' },
]

// ── Theme accent colors ───────────────────────────

const THEME_COLORS: Record<ReportConfig['colorTheme'], string> = {
  purple: '#7C3AED',
  blue: '#2563EB',
  green: '#059669',
  mono: '#374151',
}

// ── Selector Section component ────────────────────

function SelectorSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border/50">{children}</div>}
    </div>
  )
}

// ── Toggle item ───────────────────────────────────

function ToggleItem({
  id,
  label,
  description,
  checked,
  onToggle,
}: {
  id: string
  label: string
  description?: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
        checked
          ? 'border-primary/40 bg-primary/5'
          : 'border-border hover:border-border/80 hover:bg-secondary/30'
      )}
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </label>
  )
}

// ── Report Preview ────────────────────────────────

function ReportPreview({ config, presentationMode }: { config: ReportConfig; presentationMode: boolean }) {
  const accent = THEME_COLORS[config.colorTheme]

  const kpiMeta: { key: MetricKey; label: string; value: string; sensitive?: boolean }[] = [
    { key: 'totalViews', label: 'Total Views', value: '2,781,450' },
    { key: 'engagementRate', label: 'Engagement Rate', value: '5.71%' },
    { key: 'contentDeliverables', label: 'Content Deliverables', value: '35 / 40' },
    { key: 'externalCpm', label: 'External CPM', value: '$46.18' },
    { key: 'totalSpend', label: 'Total Client Spend', value: '$128,450', sensitive: true },
    { key: 'totalEngagements', label: 'Total Engagements', value: '158,900' },
    { key: 'internalCpm', label: 'Internal CPM', value: '$31.20', sensitive: true },
    { key: 'profitMargin', label: 'Profit Margin', value: '23.5%', sensitive: true },
  ]

  const activeKpis = kpiMeta.filter(m => config.metrics[m.key])

  const mask = (val: string, sensitive?: boolean) =>
    presentationMode && sensitive ? '••••••' : val

  return (
    <div className="bg-white text-gray-900 rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Report Header */}
      <div className="px-8 py-6" style={{ borderBottom: `3px solid ${accent}` }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: accent }}>
              Campaign Report
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {config.reportTitle || 'Q1 Gaming Push'}
            </h1>
            {config.clientName && (
              <p className="text-sm text-gray-500 mt-0.5">Client: {config.clientName}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Prepared by</p>
            <p className="text-sm font-semibold text-gray-700">{config.preparedBy || 'Your Agency'}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Executive Summary */}
        {config.sections.executiveSummary && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
              Executive Summary
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              {config.notes || 'This report summarizes the performance of the Q1 Gaming Push campaign. The campaign exceeded expectations on engagement metrics, with an average engagement rate of 5.71% across all platforms. YouTube remained the strongest channel by volume, while Twitch delivered the highest engagement rates.'}
            </p>
          </div>
        )}

        {/* KPI Cards */}
        {activeKpis.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
              Key Metrics
            </h2>
            <div className={cn(
              'grid gap-3',
              activeKpis.length <= 2 ? 'grid-cols-2' :
              activeKpis.length <= 4 ? 'grid-cols-4' : 'grid-cols-4'
            )}>
              {activeKpis.map(m => (
                <div key={m.key} className="rounded-lg p-3" style={{ backgroundColor: `${accent}10`, border: `1px solid ${accent}25` }}>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500 mb-1">{m.label}</p>
                  <p className="text-xl font-bold" style={{ color: accent }}>{mask(m.value, m.sensitive)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Views Over Time chart */}
        {config.charts.viewsOverTime && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
              Views Over Time
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                <Tooltip formatter={(v) => `${(v as number / 1000000).toFixed(1)}M`} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="YouTube" stroke="#FF0000" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Twitch" stroke="#9146FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="TikTok" stroke="#374151" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Instagram" stroke="#E1306C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Views by Platform + Cost Breakdown side by side */}
        {(config.charts.viewsByPlatform || config.charts.costBreakdown) && (
          <div className={cn('grid gap-6', config.charts.viewsByPlatform && config.charts.costBreakdown ? 'grid-cols-2' : 'grid-cols-1')}>
            {config.charts.viewsByPlatform && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
                  Views by Platform
                </h2>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={140}>
                    <PieChart>
                      <Pie data={viewsBreakdownData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                        {viewsBreakdownData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${(v as number / 1000000).toFixed(2)}M`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5">
                    {viewsBreakdownData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-800">{(item.value / 1000000).toFixed(2)}M</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {config.charts.costBreakdown && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
                  {presentationMode ? 'Cost Breakdown' : 'Cost Breakdown by Platform'}
                </h2>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={140}>
                    <PieChart>
                      <Pie data={costBreakdownData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                        {costBreakdownData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => presentationMode ? '••••' : `$${(v as number).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5">
                    {costBreakdownData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-800">
                          {presentationMode ? '••••' : `$${(item.value / 1000).toFixed(0)}K`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Creators + ER by Platform side by side */}
        {(config.charts.topCreators || config.charts.erByPlatform) && (
          <div className={cn('grid gap-6', config.charts.topCreators && config.charts.erByPlatform ? 'grid-cols-2' : 'grid-cols-1')}>
            {config.charts.topCreators && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
                  Top Creators by Views
                </h2>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={140}>
                    <PieChart>
                      <Pie data={topCreatorsData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                        {topCreatorsData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${(v as number / 1000).toFixed(0)}K views`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5">
                    {topCreatorsData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-800">{(item.value / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {config.charts.erByPlatform && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
                  Engagement Rate by Platform
                </h2>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={erByPlatformData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="platform" tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                    <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} unit="%" />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="er" fill={accent} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Top Performing Posts */}
        {config.charts.topPosts && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
              Top Performing Posts
            </h2>
            <div className="space-y-2">
              {topPostsData.map((post) => (
                <div key={post.rank} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ backgroundColor: `${accent}08` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white" style={{ backgroundColor: accent }}>
                    #{post.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-gray-800">{post.creator}</p>
                    <p className="text-[9px] text-gray-400">{post.type} · {post.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-gray-800">{(post.views / 1000).toFixed(0)}K views</p>
                    <p className="text-[9px] text-gray-400">{post.er}% ER</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables Table */}
        {config.sections.deliverablesTable && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
              Deliverables Summary
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-[10px]">
                <thead>
                  <tr style={{ backgroundColor: `${accent}12` }}>
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Creator</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Platform</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Type</th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">Views</th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">ER</th>
                    {!presentationMode && <th className="text-right px-3 py-2 font-semibold text-gray-600">Spend</th>}
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">CPM</th>
                    <th className="text-right px-3 py-2 font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDeliverables.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-medium text-gray-800">{row.creator}</td>
                      <td className="px-3 py-2 text-gray-500">{row.platform}</td>
                      <td className="px-3 py-2 text-gray-500">{row.type}</td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-gray-800">{(row.views / 1000).toFixed(0)}K</td>
                      <td className="px-3 py-2 text-right font-mono text-gray-600">{row.er}</td>
                      {!presentationMode && <td className="px-3 py-2 text-right font-mono text-gray-600">{row.spend}</td>}
                      <td className="px-3 py-2 text-right font-mono text-gray-600">{row.cpm}</td>
                      <td className="px-3 py-2 text-right text-gray-400">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[9px] text-gray-300">Generated by Campaign Dashboard</p>
          <p className="text-[9px] text-gray-300">{config.reportTitle || 'Q1 Gaming Push'} · {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────

export function CampaignReportTab({ presentationMode }: { presentationMode: boolean }) {
  const [config, setConfig] = useState<ReportConfig>({
    reportTitle: 'Q1 Gaming Push',
    clientName: 'Epic Games',
    preparedBy: '',
    notes: '',
    metrics: {
      totalViews: true,
      engagementRate: true,
      contentDeliverables: true,
      externalCpm: true,
      totalSpend: false,
      totalEngagements: false,
      internalCpm: false,
      profitMargin: false,
    },
    charts: {
      viewsOverTime: true,
      viewsByPlatform: true,
      topCreators: true,
      costBreakdown: false,
      topPosts: true,
      erByPlatform: false,
    },
    sections: {
      deliverablesTable: false,
      executiveSummary: true,
    },
    colorTheme: 'purple',
    logoPosition: 'none',
  })

  const [showPreview, setShowPreview] = useState(false)

  const setMetric = (k: MetricKey) =>
    setConfig(c => ({ ...c, metrics: { ...c.metrics, [k]: !c.metrics[k] } }))

  const setChart = (k: ChartKey) =>
    setConfig(c => ({ ...c, charts: { ...c.charts, [k]: !c.charts[k] } }))

  const setSection = (k: SectionKey) =>
    setConfig(c => ({ ...c, sections: { ...c.sections, [k]: !c.sections[k] } }))

  const metricsOptions: { key: MetricKey; label: string; description: string; sensitive?: boolean }[] = [
    { key: 'totalViews', label: 'Total Views', description: '2,781,450 across all platforms' },
    { key: 'engagementRate', label: 'Engagement Rate', description: '5.71% avg across all content' },
    { key: 'contentDeliverables', label: 'Content Deliverables', description: '35/40 completed' },
    { key: 'externalCpm', label: 'External CPM', description: '$46.18 blended CPM' },
    { key: 'totalSpend', label: 'Total Client Spend', description: 'Total investment amount', sensitive: true },
    { key: 'totalEngagements', label: 'Total Engagements', description: 'Likes, comments, shares' },
    { key: 'internalCpm', label: 'Internal CPM', description: 'Agency cost per 1K views', sensitive: true },
    { key: 'profitMargin', label: 'Profit Margin', description: 'Campaign margin %', sensitive: true },
  ]

  const chartOptions: { key: ChartKey; label: string; description: string }[] = [
    { key: 'viewsOverTime', label: 'Views Over Time', description: 'Line chart by platform over the campaign period' },
    { key: 'viewsByPlatform', label: 'Views by Platform', description: 'Pie chart breaking down views per channel' },
    { key: 'topCreators', label: 'Top Creators', description: 'Pie chart of top creators by views' },
    { key: 'costBreakdown', label: 'Cost Breakdown', description: 'Spend distribution by platform', },
    { key: 'topPosts', label: 'Top Performing Posts', description: 'Ranked list of best content' },
    { key: 'erByPlatform', label: 'Engagement Rate by Platform', description: 'Bar chart comparing ER across platforms' },
  ]

  const sectionOptions: { key: SectionKey; label: string; description: string }[] = [
    { key: 'executiveSummary', label: 'Executive Summary', description: 'Intro paragraph at the top of the report' },
    { key: 'deliverablesTable', label: 'Deliverables Table', description: 'Full breakdown of all campaign content' },
  ]

  const activeCount =
    Object.values(config.metrics).filter(Boolean).length +
    Object.values(config.charts).filter(Boolean).length +
    Object.values(config.sections).filter(Boolean).length

  return (
    <div className="grid grid-cols-[360px_1fr] gap-6 items-start">
      {/* ── Left: Builder panel ── */}
      <div className="space-y-4">
        {/* Report Details */}
        <SelectorSection title="Report Details" icon={<FileDown size={14} />}>
          <div className="space-y-3 pt-4">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Report Title</label>
              <Input
                value={config.reportTitle}
                onChange={e => setConfig(c => ({ ...c, reportTitle: e.target.value }))}
                className="h-8 text-xs bg-secondary/50 border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Client Name</label>
                <Input
                  value={config.clientName}
                  onChange={e => setConfig(c => ({ ...c, clientName: e.target.value }))}
                  placeholder="Epic Games"
                  className="h-8 text-xs bg-secondary/50 border-border"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Prepared By</label>
                <Input
                  value={config.preparedBy}
                  onChange={e => setConfig(c => ({ ...c, preparedBy: e.target.value }))}
                  placeholder="Your Agency"
                  className="h-8 text-xs bg-secondary/50 border-border"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Executive Summary Notes</label>
              <Textarea
                value={config.notes}
                onChange={e => setConfig(c => ({ ...c, notes: e.target.value }))}
                placeholder="Add context or highlights for this report..."
                className="text-xs bg-secondary/50 border-border min-h-20 resize-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Color Theme</label>
              <div className="flex items-center gap-2">
                {(['purple', 'blue', 'green', 'mono'] as const).map(theme => (
                  <button
                    key={theme}
                    onClick={() => setConfig(c => ({ ...c, colorTheme: theme }))}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-all',
                      config.colorTheme === theme ? 'border-foreground scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: THEME_COLORS[theme] }}
                    title={theme}
                  />
                ))}
              </div>
            </div>
          </div>
        </SelectorSection>

        {/* Metrics */}
        <SelectorSection title="Key Metrics" icon={<Activity size={14} />}>
          <div className="grid grid-cols-1 gap-2 pt-4">
            {metricsOptions.map(m => (
              <ToggleItem
                key={m.key}
                id={`metric-${m.key}`}
                label={m.label + (m.sensitive && presentationMode ? ' (hidden in presentation mode)' : '')}
                description={m.description}
                checked={config.metrics[m.key]}
                onToggle={() => setMetric(m.key)}
              />
            ))}
          </div>
        </SelectorSection>

        {/* Charts */}
        <SelectorSection title="Charts & Visualizations" icon={<BarChart2 size={14} />}>
          <div className="grid grid-cols-1 gap-2 pt-4">
            {chartOptions.map(c => (
              <ToggleItem
                key={c.key}
                id={`chart-${c.key}`}
                label={c.label}
                description={c.description}
                checked={config.charts[c.key]}
                onToggle={() => setChart(c.key)}
              />
            ))}
          </div>
        </SelectorSection>

        {/* Sections */}
        <SelectorSection title="Report Sections" icon={<LayoutGrid size={14} />}>
          <div className="grid grid-cols-1 gap-2 pt-4">
            {sectionOptions.map(s => (
              <ToggleItem
                key={s.key}
                id={`section-${s.key}`}
                label={s.label}
                description={s.description}
                checked={config.sections[s.key]}
                onToggle={() => setSection(s.key)}
              />
            ))}
          </div>
        </SelectorSection>
      </div>

      {/* ── Right: Preview + Actions ── */}
      <div className="space-y-4">
        {/* Preview header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Report Preview</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {activeCount} element{activeCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(v => !v)}
              className="h-8 gap-1.5 text-xs border-border"
            >
              <Eye size={13} />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.print()}
            >
              <FileDown size={13} />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Empty state when preview hidden */}
        {!showPreview && (
          <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Eye size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Report preview hidden</p>
              <p className="text-xs text-muted-foreground mt-1">
                Configure your report on the left, then click "Show Preview" to see the live output.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs border-border mt-2"
              onClick={() => setShowPreview(true)}
            >
              <Eye size={13} /> Show Preview
            </Button>
          </div>
        )}

        {showPreview && (
          <ReportPreview config={config} presentationMode={presentationMode} />
        )}
      </div>
    </div>
  )
}
