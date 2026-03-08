'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_DELIVERABLES, MOCK_CAMPAIGN_ANALYTICS, MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { cn } from '@/lib/utils'
import {
  Download,
  MessageSquare,
  Filter,
  Plus,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Eye,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import Link from 'next/link'

const platformColors: Record<string, string> = {
  YouTube: '#7C3AED',
  Twitch: '#A78BFA',
  TikTok: '#C4B5FD',
}

// Sparkline data (last 7 days)
const generateSparklineData = () => [
  { v: 2.1 }, { v: 3.8 }, { v: 2.9 }, { v: 4.2 }, { v: 3.5 }, { v: 4.8 }, { v: 5.2 }
]

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === params.id) || MOCK_CAMPAIGNS[0]
  const analytics = MOCK_CAMPAIGN_ANALYTICS[params.id]
  const [activeTab, setActiveTab] = useState('overview')

  const profit = campaign.spent * (campaign.marginPct / 100)
  const profitChange = 8.5
  const viewsChange = 5.2
  const spendChange = 12.4
  const sparkline = generateSparklineData()

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link href="/campaigns" className="text-muted-foreground hover:text-foreground transition-colors">
                Campaigns
              </Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <span className="font-semibold text-foreground">{campaign.name}</span>
            </div>

            {/* Title & Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
                <p className="text-xs text-muted-foreground mt-1">
                  {campaign.startDate} to {campaign.endDate} • {campaign.deliverables} deliverables
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                  <Download size={14} className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Chat">
                  <MessageSquare size={14} className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Filter">
                  <Filter size={14} className="text-muted-foreground" />
                </Button>
                <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs">
                  <Plus size={13} /> Add Deliverable
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border flex gap-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  'pb-3 text-xs font-medium border-b-2 transition-colors',
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('anomalies')}
                className={cn(
                  'pb-3 text-xs font-medium border-b-2 transition-colors',
                  activeTab === 'anomalies'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                Anomalies
              </button>
            </div>

            {activeTab === 'overview' && (
              <>
                {/* KPI Cards with Sparklines */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Card 1: Total Client Spend */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Total Client Spend</p>
                        <p className="text-2xl font-bold text-foreground font-mono mt-1">
                          {presentationMode ? '••••' : `$${(campaign.spent / 1000).toFixed(0)}K`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <ArrowUpRight size={11} />
                        +{spendChange}%
                      </div>
                    </div>
                    {/* Sparkline */}
                    <ResponsiveContainer width="100%" height={40}>
                      <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Card 2: Forecasted Views */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Forecasted Views</p>
                        <p className="text-2xl font-bold text-foreground font-mono mt-1">
                          {(campaign.totalViews / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <ArrowUpRight size={11} />
                        +{viewsChange}%
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={40}>
                      <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Card 3: Agency Profit */}
                  <div className={cn(
                    'bg-card border border-border rounded-lg p-4',
                    presentationMode && 'opacity-30'
                  )}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Agency Profit</p>
                        <p className="text-2xl font-bold text-emerald-600 font-mono mt-1">
                          ${(profit / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <ArrowUpRight size={11} />
                        +8.5%
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={40}>
                      <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Analytics Hub — Stacked Bar Chart */}
                <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-foreground">Views by Platform</h2>
                    <Badge variant="outline" className="text-xs">Weekly</Badge>
                  </div>

                  {analytics?.stackedByPlatform ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.stackedByPlatform} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '4px',
                          }}
                          labelStyle={{ color: '#1F2937' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="YouTube" fill={platformColors.YouTube} stackId="platform" />
                        <Bar dataKey="Twitch" fill={platformColors.Twitch} stackId="platform" />
                        <Bar dataKey="TikTok" fill={platformColors.TikTok} stackId="platform" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 bg-secondary/20 rounded flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No chart data available</span>
                    </div>
                  )}
                </div>

                {/* High-Density Deliverables Table */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-3 border-b border-border bg-secondary/30">
                    <h3 className="text-sm font-semibold text-foreground">Deliverables</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-6 py-3 text-muted-foreground font-medium">Platform</th>
                          <th className="text-left px-6 py-3 text-muted-foreground font-medium">Creator</th>
                          <th className="text-left px-6 py-3 text-muted-foreground font-medium">Type</th>
                          <th className="text-right px-6 py-3 text-muted-foreground font-medium">Views</th>
                          <th className="text-right px-6 py-3 text-muted-foreground font-medium">Target</th>
                          <th className="text-right px-6 py-3 text-muted-foreground font-medium">% to Goal</th>
                          {!presentationMode && <th className="text-right px-6 py-3 text-muted-foreground font-medium">Int. Cost</th>}
                          {!presentationMode && <th className="text-right px-6 py-3 text-muted-foreground font-medium">Margin %</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_DELIVERABLES.slice(0, 5).map((d, idx) => (
                          <tr key={idx} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4 font-medium">{d.creator.platform}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="text-primary text-[9px] font-bold">{d.creator.avatar}</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-foreground truncate">{d.creator.handle}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{d.creator.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{d.contentType}</td>
                            <td className="text-right px-6 py-4 font-mono text-foreground font-semibold">
                              {d.youtube?.avg30dLong ? `${(d.youtube.avg30dLong / 1000000).toFixed(1)}M` : '—'}
                            </td>
                            <td className="text-right px-6 py-4 font-mono text-muted-foreground">
                              2.5M
                            </td>
                            <td className="text-right px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-12 h-1 bg-secondary rounded-full overflow-hidden">
                                  <div className="h-full w-3/4 bg-primary rounded-full" />
                                </div>
                                <span className="font-mono text-foreground font-semibold">75%</span>
                              </div>
                            </td>
                            {!presentationMode && (
                              <>
                                <td className="text-right px-6 py-4 font-mono text-foreground">${d.internalPrice.toLocaleString()}</td>
                                <td className="text-right px-6 py-4 font-mono text-emerald-600 font-semibold">{d.margin}%</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'anomalies' && (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <BarChart3 size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Anomaly detection coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
