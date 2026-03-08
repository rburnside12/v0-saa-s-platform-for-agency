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
                {/* BENTO GRID LAYOUT */}
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                  
                  {/* Top Row: 4 KPI Cards */}
                  <div className="col-span-3 bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Total Client Spend</p>
                    <p className="text-2xl font-bold text-foreground font-mono mb-3">
                      {presentationMode ? '•••••' : `$${(campaign.spent / 1000).toFixed(0)}K`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <ArrowUpRight size={10} /> +{spendChange}%
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={30} className="mt-3">
                      <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="col-span-3 bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Forecasted Views</p>
                    <p className="text-2xl font-bold text-foreground font-mono mb-3">
                      {(campaign.totalViews / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      <ArrowUpRight size={10} /> +{viewsChange}%
                    </div>
                    <ResponsiveContainer width="100%" height={30} className="mt-3">
                      <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={cn(
                    'col-span-3 bg-card border border-border rounded-xl p-4',
                    presentationMode && 'opacity-40 pointer-events-none'
                  )}>
                    <p className="text-xs text-muted-foreground font-medium mb-2">Agency Profit</p>
                    <p className="text-2xl font-bold text-emerald-600 font-mono mb-3">
                      ${(profit / 1000).toFixed(0)}K
                    </p>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      <ArrowUpRight size={10} /> +{profitChange}%
                    </div>
                    <ResponsiveContainer width="100%" height={30} className="mt-3">
                      <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="col-span-3 bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Avg. Platform CPM</p>
                    <p className="text-2xl font-bold text-foreground font-mono mb-3">
                      $12.80
                    </p>
                    <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      <ArrowDownRight size={10} /> -2.1%
                    </div>
                    <ResponsiveContainer width="100%" height={30} className="mt-3">
                      <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Line type="monotone" dataKey="v" stroke="#EF4444" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Analytics Hub: 3-column Chart + Right Sidebar */}
                  <div className="col-span-8 bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-foreground">Views by Platform</h2>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Filter size={12} className="text-muted-foreground" />
                        </Button>
                        <Badge variant="outline" className="text-[10px]">Weekly</Badge>
                      </div>
                    </div>

                    {analytics?.stackedByPlatform ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={analytics.stackedByPlatform} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                            labelStyle={{ color: '#1F2937', fontSize: '11px' }}
                          />
                          <Bar dataKey="YouTube" fill="#7C3AED" stackId="platform" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Twitch" fill="#A78BFA" stackId="platform" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="TikTok" fill="#C4B5FD" stackId="platform" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-72 bg-secondary/20 rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No chart data</span>
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar: Efficiency Cards */}
                  <div className="col-span-4 space-y-4">
                    {/* Goal Progress */}
                    <div className="bg-card border border-border rounded-xl p-5">
                      <p className="text-xs text-muted-foreground font-medium mb-4">Campaign Goal Progress</p>
                      <div className="flex items-center gap-6">
                        <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
                          <circle cx="40" cy="40" r="35" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            fill="none"
                            stroke="#7C3AED"
                            strokeWidth="4"
                            strokeDasharray={`${35 * 2 * Math.PI * 0.78} ${35 * 2 * Math.PI}`}
                            strokeLinecap="round"
                            transform="rotate(-90 40 40)"
                          />
                          <text x="40" y="48" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1F2937">
                            78%
                          </text>
                        </svg>
                        <div>
                          <p className="text-2xl font-bold text-foreground">78%</p>
                          <p className="text-xs text-muted-foreground mt-1">to target</p>
                          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold mt-2">
                            <TrendingUp size={10} /> +Gain potential
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Data Verification */}
                    <div className="bg-card border border-border rounded-xl p-5">
                      <p className="text-xs text-muted-foreground font-medium mb-3">AI Data Verification</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">Health: <span className="text-green-700 font-bold">98%</span></span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full w-98/100 bg-green-500 rounded-full" style={{ width: '98%' }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Data sources verified</p>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Full-Width Deliverables Table: High-Density Bento */}
                  <div className="col-span-12 bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border/50">
                    <h3 className="text-sm font-semibold text-foreground">Deliverables</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50 bg-secondary/30">
                          <th className="text-left px-5 py-3 text-muted-foreground font-medium">Platform</th>
                          <th className="text-left px-5 py-3 text-muted-foreground font-medium">Creator</th>
                          <th className="text-left px-5 py-3 text-muted-foreground font-medium">Content Type</th>
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">Views</th>
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">Change</th>
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">Trend</th>
                          {!presentationMode && <th className="text-right px-5 py-3 text-muted-foreground font-medium">Int. Cost</th>}
                          {!presentationMode && <th className="text-right px-5 py-3 text-muted-foreground font-medium">Margin</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_DELIVERABLES.slice(0, 6).map((d, idx) => (
                          <tr key={idx} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                            <td className="px-5 py-3 font-semibold text-foreground">{d.creator.platform}</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                                  <span className="text-primary text-[8px] font-bold">{d.creator.avatar}</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-foreground text-xs truncate">{d.creator.handle}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-muted-foreground">{d.contentType}</td>
                            <td className="text-right px-5 py-3 font-mono font-bold text-foreground">
                              {d.youtube?.avg30dLong ? `${(d.youtube.avg30dLong / 1000000).toFixed(1)}M` : d.tiktok?.views ? `${(d.tiktok.views / 1000000).toFixed(1)}M` : '—'}
                            </td>
                            <td className="text-right px-5 py-3">
                              <span className="font-mono font-semibold text-green-600">+12.4%</span>
                            </td>
                            <td className="text-right px-5 py-3">
                              <ResponsiveContainer width={50} height={20} className="inline-block">
                                <LineChart data={sparkline} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                                  <Line type="monotone" dataKey="v" stroke="#7C3AED" strokeWidth={1} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </td>
                            {!presentationMode && (
                              <>
                                <td className={cn(
                                  'text-right px-5 py-3 font-mono text-foreground',
                                  presentationMode && 'opacity-30'
                                )}>
                                  ${d.internalPrice.toLocaleString()}
                                </td>
                                <td className={cn(
                                  'text-right px-5 py-3 font-mono font-semibold text-emerald-600',
                                  presentationMode && 'opacity-30'
                                )}>
                                  {d.margin}%
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </div>
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
