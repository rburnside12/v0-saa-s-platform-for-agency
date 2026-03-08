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
  ChevronDown,
  Lock,
  Youtube,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  YouTube: <svg className="w-4 h-4 fill-red-600" viewBox="0 0 24 24"><path d="M19.615 3.712c-1.899-.596-7.615-.596-9.514-.596s-7.615 0-9.514.596C.051 4.934.051 8.806.051 12s0 7.066.752 8.288c1.899.596 7.615.596 9.514.596s7.615 0 9.514-.596c.701-1.222.752-5.094.752-8.288 0-3.194 0-7.066-.752-8.288zM9.046 15.13V8.87c3.505.987 3.505 3.077 3.505 3.077 0 3.077 0 3.077-3.505 3.183z"/></svg>,
  Twitch: <svg className="w-4 h-4 fill-purple-600" viewBox="0 0 24 24"><path d="M11 2H2v20h7v-5h4l4-4v-11h-6zm6 10l-3 3h-4v-3h7z"/></svg>,
  TikTok: <svg className="w-4 h-4 fill-black dark:fill-white" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.92-2.46v3.6a6.63 6.63 0 1 0 9.69 5.63V9.01a8.35 8.35 0 0 0 4.84-2.65z"/></svg>,
  X: <svg className="w-4 h-4 fill-black dark:fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.63l-5.195-6.791-5.966 6.791h-3.31l7.73-8.835L2.818 2.25h6.79l4.831 6.397L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Instagram: <svg className="w-4 h-4 fill-pink-600" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>,
}

const performanceMetricsData = {
  totalActualViews: 2781450,
  totalEngagements: 1500890,
  avgCPM: 45.23,
  conservativeViews: 2225160, // 80% of actual
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === params.id) || MOCK_CAMPAIGNS[0]
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMetric, setSelectedMetric] = useState<'Views' | 'Engagements' | 'CPM'>('Views')

  // Chart data for metric selection
  const chartDataByMetric = {
    Views: [
      { date: '03.01', YouTube: 1200000, Twitch: 600000, TikTok: 300000, X: 100000 },
      { date: '03.07', YouTube: 1400000, Twitch: 700000, TikTok: 350000, X: 120000 },
      { date: '03.13', YouTube: 1680000, Twitch: 840000, TikTok: 420000, X: 140000 },
      { date: '03.19', YouTube: 1920000, Twitch: 960000, TikTok: 480000, X: 160000 },
    ],
    Engagements: [
      { date: '03.01', YouTube: 48000, Twitch: 18000, TikTok: 12000, X: 2000 },
      { date: '03.07', YouTube: 56000, Twitch: 21000, TikTok: 14000, X: 2400 },
      { date: '03.13', YouTube: 67200, Twitch: 25200, TikTok: 16800, X: 2800 },
      { date: '03.19', YouTube: 76800, Twitch: 28800, TikTok: 19200, X: 3200 },
    ],
    CPM: [
      { date: '03.01', YouTube: 45, Twitch: 42, TikTok: 38, X: 50 },
      { date: '03.07', YouTube: 44, Twitch: 41, TikTok: 37, X: 48 },
      { date: '03.13', YouTube: 46, Twitch: 43, TikTok: 39, X: 52 },
      { date: '03.19', YouTube: 45, Twitch: 42, TikTok: 38, X: 50 },
    ],
  }

  const currentChartData = chartDataByMetric[selectedMetric]

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="p-6 space-y-6 overflow-auto flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Campaign Reports</span>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="font-semibold text-foreground">Q1 Gaming Push</span>
          </div>

          {/* Title & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Q1 Gaming Push</h1>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download size={14} className="text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MessageSquare size={14} className="text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter size={14} className="text-muted-foreground" />
              </Button>
              <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs font-medium px-3">
                <Plus size={13} /> New Deliverable
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                'pb-3 text-xs font-semibold border-b-2 transition-colors',
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
                'pb-3 text-xs font-semibold border-b-2 transition-colors',
                activeTab === 'anomalies'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              Anomalies
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI CARDS — 4 Cards (Performance Focus, No Trends) */}
              <div className="grid grid-cols-4 gap-4">
                {/* Card 1: Total Actual Views */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Actual Views</p>
                  <p className="text-2xl font-bold text-foreground font-mono">{performanceMetricsData.totalActualViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">2.78M detailed</p>
                </div>

                {/* Card 2: Total Engagements */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Engagements</p>
                  <p className="text-2xl font-bold text-foreground font-mono">{performanceMetricsData.totalEngagements.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Likes + Comments + Shares</p>
                </div>

                {/* Card 3: Average Campaign CPM */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Average Campaign CPM</p>
                  <p className="text-2xl font-bold text-foreground font-mono">${performanceMetricsData.avgCPM.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Cost per thousand impressions</p>
                </div>

                {/* Card 4: Conservative Views (80%) */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Conservative Views (80%)</p>
                  <p className="text-2xl font-bold text-foreground font-mono">{performanceMetricsData.conservativeViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Lower confidence estimate</p>
                </div>
              </div>

              {/* ANALYTICS SECTION — 3-Column Layout */}
              <div className="grid grid-cols-3 gap-4">
                {/* Large Analytics Card (2 cols) */}
                <div className="col-span-2 bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-foreground">Performance Analytics</h2>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select
                          value={selectedMetric}
                          onChange={(e) => setSelectedMetric(e.target.value as 'Views' | 'Engagements' | 'CPM')}
                          className="appearance-none bg-secondary text-foreground text-xs font-medium px-3 py-1.5 rounded-md border border-border cursor-pointer pr-7"
                        >
                          <option>Views</option>
                          <option>Engagements</option>
                          <option>CPM</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Filter size={12} className="text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={currentChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                        labelStyle={{ color: '#1F2937', fontSize: '11px' }}
                        formatter={(value) => {
                          if (selectedMetric === 'CPM') return `$${value}`
                          if (selectedMetric === 'Engagements') return value.toLocaleString()
                          return `${(value as number / 1000000).toFixed(1)}M`
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="YouTube" fill="#7C3AED" stackId="metric" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Twitch" fill="#A78BFA" stackId="metric" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="TikTok" fill="#C4B5FD" stackId="metric" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="X" fill="#F97316" stackId="metric" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Right Column: Efficiency Cards */}
                <div className="space-y-4">
                  {/* Engagement Target Progress */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-medium mb-4">Engagement Target Progress</p>
                    <div className="flex flex-col items-center justify-center gap-3">
                      {/* Segmented Ring Progress */}
                      <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="6"
                          strokeDasharray={`${40 * 2 * Math.PI * 0.746} ${40 * 2 * Math.PI}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1F2937">
                          74.6%
                        </text>
                      </svg>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">1.5M / 2.0M target</p>
                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold mt-2">
                          <TrendingUp size={10} /> +5.4% gain potential
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Data Verification Rate */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-medium mb-4">AI Data Verification</p>
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-foreground">98.7%</p>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '98.7%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Data sources verified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DELIVERABLES TABLE — Full Width */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50">
                  <h3 className="text-sm font-semibold text-foreground">Deliverables</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 bg-secondary/30">
                        <th className="text-center px-4 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1 justify-center">Platform <ChevronRight size={10} /></div>
                        </th>
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1">Creator <ChevronRight size={10} /></div>
                        </th>
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1">Type <ChevronRight size={10} /></div>
                        </th>
                        <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1 justify-end">Views <ChevronRight size={10} /></div>
                        </th>
                        <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1 justify-end">Engagements <ChevronRight size={10} /></div>
                        </th>
                        <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1 justify-end">CPM <ChevronRight size={10} /></div>
                        </th>
                        {!presentationMode && (
                          <>
                            <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                              <div className="flex items-center gap-1 justify-end">Int. Cost <ChevronRight size={10} /></div>
                            </th>
                            <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                              <div className="flex items-center gap-1 justify-end">Profit <ChevronRight size={10} /></div>
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DELIVERABLES.slice(0, 6).map((d, idx) => {
                        const views = d.youtube?.avg30dLong || d.tiktok?.views || 0
                        const engagements = Math.floor((views * 0.054)) // 5.4% engagement rate
                        const cpm = d.cpm || 45.23

                        return (
                          <tr key={idx} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                            <td className="text-center px-4 py-3">
                              {d.creator.platform === 'YouTube' && PLATFORM_ICONS.YouTube}
                              {d.creator.platform === 'Twitch' && PLATFORM_ICONS.Twitch}
                              {d.creator.platform === 'TikTok' && PLATFORM_ICONS.TikTok}
                            </td>
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
                            <td className="px-5 py-3 text-muted-foreground text-xs">{d.contentType}</td>
                            <td className="text-right px-5 py-3 font-mono font-bold text-foreground">
                              {views.toLocaleString()}
                            </td>
                            <td className="text-right px-5 py-3 font-mono font-bold text-foreground">
                              {engagements.toLocaleString()}
                            </td>
                            <td className="text-right px-5 py-3 font-mono font-bold text-foreground">
                              ${cpm.toFixed(2)}
                            </td>
                            {!presentationMode && (
                              <>
                                <td className="text-right px-5 py-3 font-mono text-foreground">
                                  ${d.internalPrice.toLocaleString()}
                                </td>
                                <td className="text-right px-5 py-3 font-mono font-semibold text-emerald-600">
                                  ${Math.round(d.clientPrice - d.internalPrice).toLocaleString()}
                                </td>
                              </>
                            )}
                            {presentationMode && (
                              <>
                                <td className="text-right px-5 py-3 font-mono text-foreground relative">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <span className="blur-sm">$80,000</span>
                                    <Lock size={12} className="text-muted-foreground" />
                                  </div>
                                </td>
                                <td className="text-right px-5 py-3 font-mono font-semibold text-emerald-600 relative">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <span className="blur-sm">$28,000</span>
                                    <Lock size={12} className="text-muted-foreground" />
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
