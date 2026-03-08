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
  Lock,
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
} from 'recharts'
import Link from 'next/link'

const platformColors: Record<string, string> = {
  YouTube: '#7C3AED',
  Twitch: '#A78BFA',
  TikTok: '#C4B5FD',
}

const generateSparklineData = () => [
  { v: 2.1 }, { v: 3.8 }, { v: 2.9 }, { v: 4.2 }, { v: 3.5 }, { v: 4.8 }, { v: 5.2 }
]

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === params.id) || MOCK_CAMPAIGNS[0]
  const [activeTab, setActiveTab] = useState('overview')

  const sparkline = generateSparklineData()

  // Exact data from spec
  const kpiData = {
    totalSpend: { value: '$128,450.00', change: '+12.78%', changeColor: 'green' },
    forecastedViews: { value: '4.2M', change: '-1.59%', changeColor: 'red' },
    agencyProfit: { value: '$123,230.00', change: '-17.52%', changeColor: 'red', blurred: true },
    conservativeViews: { value: '3.36M', change: '+9.1%', changeColor: 'green' },
  }

  const goalProgress = {
    percentage: 72.6,
    current: '1.1M',
    target: '1.5M',
    gainPotential: '+5.4%',
  }

  const aiVerification = {
    percentage: 98.7,
    text: 'Better accuracy this week',
  }

  // Chart data with exact dates from spec
  const chartData = [
    { date: '03.01', YouTube: 12000000, Twitch: 6000000, TikTok: 3000000, X: 1000000 },
    { date: '03.07', YouTube: 14200000, Twitch: 7200000, TikTok: 3600000, X: 1200000 },
    { date: '03.13', YouTube: 16800000, Twitch: 8400000, TikTok: 4200000, X: 1400000 },
    { date: '03.19', YouTube: 19200000, Twitch: 9600000, TikTok: 4800000, X: 1600000 },
  ]

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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="text-xs font-medium text-muted-foreground">Save</span>
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
            <div className="space-y-4">
              {/* KPI BENTO ROW — 4 Cards */}
              <div className="grid grid-cols-4 gap-4">
                {/* Card 1: Total Client Spend */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Client Spend</p>
                  <p className="text-2xl font-bold text-foreground font-mono mb-3">{kpiData.totalSpend.value}</p>
                  <div className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                    kpiData.totalSpend.changeColor === 'green'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  )}>
                    {kpiData.totalSpend.changeColor === 'green' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {kpiData.totalSpend.change}
                  </div>
                  <ResponsiveContainer width="100%" height={30} className="mt-3">
                    <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Card 2: Forecasted Views */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Forecasted Views</p>
                  <p className="text-2xl font-bold text-foreground font-mono mb-3">{kpiData.forecastedViews.value}</p>
                  <div className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                    kpiData.forecastedViews.changeColor === 'green'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  )}>
                    {kpiData.forecastedViews.changeColor === 'green' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {kpiData.forecastedViews.change}
                  </div>
                  <ResponsiveContainer width="100%" height={30} className="mt-3">
                    <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Line type="monotone" dataKey="v" stroke="#EF4444" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Card 3: Accrued Agency Profit (BLURRED) */}
                <div className={cn(
                  'bg-card border border-border rounded-xl p-4 relative',
                  presentationMode && 'opacity-50'
                )}>
                  <p className="text-xs text-muted-foreground font-medium mb-2">Accrued Agency Profit</p>
                  <div className="relative mb-3">
                    <p className={cn(
                      'text-2xl font-bold text-foreground font-mono',
                      presentationMode && 'blur-sm'
                    )}>
                      {presentationMode ? '••••••••••' : kpiData.agencyProfit.value}
                    </p>
                    {presentationMode && (
                      <div className="absolute right-0 top-0">
                        <Lock size={14} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                    kpiData.agencyProfit.changeColor === 'green'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  )}>
                    {kpiData.agencyProfit.changeColor === 'green' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {kpiData.agencyProfit.change}
                  </div>
                  <ResponsiveContainer width="100%" height={30} className="mt-3">
                    <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Line type="monotone" dataKey="v" stroke="#EF4444" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Card 4: Conservative Views (80%) */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Conservative Views (80%)</p>
                  <p className="text-2xl font-bold text-foreground font-mono mb-3">{kpiData.conservativeViews.value}</p>
                  <div className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                    kpiData.conservativeViews.changeColor === 'green'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  )}>
                    {kpiData.conservativeViews.changeColor === 'green' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {kpiData.conservativeViews.change}
                  </div>
                  <ResponsiveContainer width="100%" height={30} className="mt-3">
                    <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ANALYTICS + EFFICIENCY GRID */}
              <div className="grid grid-cols-3 gap-4">
                {/* Large Analytics Card (2 cols) */}
                <div className="col-span-2 bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-foreground">Views by Platform</h2>
                    <Badge variant="outline" className="text-[10px]">Weekly</Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        label={{ value: 'Views (Millions)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                        labelStyle={{ color: '#1F2937', fontSize: '11px' }}
                        formatter={(value) => `${(value as number / 1000000).toFixed(1)}M`}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="YouTube" fill="#7C3AED" stackId="platform" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Twitch" fill="#A78BFA" stackId="platform" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="TikTok" fill="#C4B5FD" stackId="platform" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="X" fill="#F97316" stackId="platform" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Right Column: Goal Progress + AI Verification */}
                <div className="space-y-4">
                  {/* Campaign Goal Progress */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-medium mb-4">Campaign Goal Progress (External)</p>
                    <div className="flex flex-col items-center justify-center gap-3">
                      {/* Segmented Ring Progress */}
                      <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
                        {/* Background ring */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                        {/* Progress ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="6"
                          strokeDasharray={`${40 * 2 * Math.PI * (goalProgress.percentage / 100)} ${40 * 2 * Math.PI}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Center text */}
                        <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1F2937">
                          {goalProgress.percentage}%
                        </text>
                      </svg>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">{goalProgress.current} / {goalProgress.target} views</p>
                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold mt-2">
                          <TrendingUp size={10} /> {goalProgress.gainPotential} gain potential
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Data Verification Rate */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-medium mb-4">AI Data Verification Rate</p>
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-foreground">{aiVerification.percentage}%</p>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${aiVerification.percentage}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">{aiVerification.text}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DELIVERABLES TABLE — Full Width */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50">
                  <h3 className="text-sm font-semibold text-foreground">Deliverables Table</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 bg-secondary/30">
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1">Platform <ChevronRight size={10} /></div>
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
                          <div className="flex items-center gap-1 justify-end">Change <ChevronRight size={10} /></div>
                        </th>
                        <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1 justify-end">Progress <ChevronRight size={10} /></div>
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
                      {MOCK_DELIVERABLES.slice(0, 5).map((d, idx) => (
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
                          <td className="px-5 py-3 text-muted-foreground text-xs">{d.contentType}</td>
                          <td className="text-right px-5 py-3 font-mono font-bold text-foreground">
                            {d.youtube?.avg30dLong ? `${(d.youtube.avg30dLong / 1000000).toFixed(1)}M` : d.tiktok?.views ? `${(d.tiktok.views / 1000000).toFixed(1)}M` : '—'}
                          </td>
                          <td className="text-right px-5 py-3">
                            <span className="font-mono font-semibold text-green-600">+10.2%</span>
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
                              <td className="text-right px-5 py-3 font-mono text-foreground text-xs">
                                ${d.internalPrice.toLocaleString()}
                              </td>
                              <td className={cn(
                                'text-right px-5 py-3 font-mono font-semibold text-emerald-600 text-xs',
                                presentationMode && 'blur-sm opacity-30'
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
          )}

          {activeTab === 'anomalies' && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <BarChart3 size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Anomaly detection coming soon</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
