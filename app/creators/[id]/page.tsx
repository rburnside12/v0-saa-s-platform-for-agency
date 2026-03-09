'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { MOCK_CREATORS, MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  ArrowLeft,
  ExternalLink,
  Flag,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Eye,
  Heart,
  Users,
  Calendar,
  BarChart3,
  Globe,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts'

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'bg-red-500/15 text-red-400 border-red-500/20',
  TikTok: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Twitch: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  green: { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', label: 'Reliable', icon: <Flag size={12} /> },
  yellow: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', label: 'Caution', icon: <Flag size={12} /> },
  red: { bg: 'bg-red-500/15 border-red-500/30', text: 'text-red-400', label: 'Risk', icon: <Flag size={12} /> },
}

const TREND_CONFIG: Record<string, { icon: React.ReactNode; text: string; label: string }> = {
  increasing: { icon: <TrendingUp size={14} />, text: 'text-emerald-400', label: 'Increasing' },
  decreasing: { icon: <TrendingDown size={14} />, text: 'text-red-400', label: 'Decreasing' },
  stable: { icon: <Minus size={14} />, text: 'text-muted-foreground', label: 'Stable' },
}

const PIE_COLORS = ['#7C3AED', '#9146FF', '#10B981', '#F59E0B', '#6B7280']

function formatNumber(value: number) {
  if (!value) return '—'
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toLocaleString()
}

function formatCurrency(value: number) {
  if (!value) return '—'
  return `$${value.toLocaleString()}`
}

export default function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { presentationMode } = usePresentationMode()
  
  const creator = MOCK_CREATORS.find(c => c.id === id)
  
  if (!creator) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground">Creator not found</p>
            <Button variant="link" onClick={() => router.push('/creators')}>
              Back to Creator Library
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  const statusConfig = STATUS_CONFIG[creator.status] || STATUS_CONFIG.green
  const trendConfig = TREND_CONFIG[creator.feeTrend] || TREND_CONFIG.stable
  
  // Get past collaborations
  const pastCampaigns = MOCK_CAMPAIGNS.filter(c => 
    creator.pastCollaborations.includes(c.id)
  )

  // Prepare audience demo data for charts
  const ageData = Object.entries(creator.audienceDemo.age).map(([name, value]) => ({ name, value }))
  const genderData = Object.entries(creator.audienceDemo.gender).map(([name, value]) => ({ name, value }))
  const regionData = Object.entries(creator.audienceDemo.region).map(([name, value]) => ({ name, value }))

  // Fee history for bar chart
  const feeHistory = creator.historicalRates.map((rate, idx) => ({
    period: `Deal ${idx + 1}`,
    fee: rate,
  }))

  return (
    <AppShell>
      <TooltipProvider>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <button 
                onClick={() => router.push('/creators')} 
                className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              
              <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <span className="text-primary text-lg font-bold">{creator.avatar}</span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-semibold text-foreground">{creator.handle}</h1>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${PLATFORM_COLORS[creator.platform]}`}>
                    {creator.platform}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${statusConfig.bg}`}>
                    <span className={statusConfig.text}>{statusConfig.icon}</span>
                    <span className={`text-[10px] font-medium ${statusConfig.text}`}>{statusConfig.label}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{creator.name}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground">{creator.managementCompany}</span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="text-xs text-muted-foreground">{creator.region}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs border-border gap-1.5">
                <Pencil size={12} /> Edit
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs border-border gap-1.5">
                <ExternalLink size={12} /> View Profile
              </Button>
            </div>
          </div>

          {/* Status Note */}
          {creator.statusNote && (
            <div className={cn(
              "p-4 rounded-lg border flex items-start gap-3",
              statusConfig.bg
            )}>
              <Flag size={14} className={cn("mt-0.5 shrink-0", statusConfig.text)} />
              <div>
                <p className={cn("text-xs font-medium mb-0.5", statusConfig.text)}>Team Note</p>
                <p className="text-xs text-foreground/80">{creator.statusNote}</p>
              </div>
            </div>
          )}

          {/* Bento Grid */}
          <div className="grid grid-cols-4 gap-4">
            {/* Historical Metrics Card */}
            <div className="col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={14} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Historical Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/40">
                  <p className="text-[10px] text-muted-foreground mb-1">Total Views (All Campaigns)</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {creator.isTwitch ? `${formatNumber(creator.avgCCV || 0)} Avg CCV` : formatNumber(creator.totalViews)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/40">
                  <p className="text-[10px] text-muted-foreground mb-1">Total Engagements</p>
                  <p className="text-xl font-bold font-mono text-foreground">{formatNumber(creator.totalEngagements)}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/40">
                  <p className="text-[10px] text-muted-foreground mb-1">Campaigns Completed</p>
                  <p className="text-xl font-bold font-mono text-foreground">{creator.pastCollaborations.length}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/40">
                  <p className="text-[10px] text-muted-foreground mb-1">Category Tags</p>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {creator.category.map(cat => (
                      <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Financials Card */}
            <div className="col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={14} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Financials</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={cn("p-4 rounded-lg bg-secondary/40", presentationMode && "opacity-40")}>
                  <p className="text-[10px] text-muted-foreground mb-1">Total Fees Paid</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {presentationMode ? '••••••' : formatCurrency(creator.totalFeesPaid)}
                  </p>
                </div>
                <div className={cn("p-4 rounded-lg bg-secondary/40", presentationMode && "opacity-40")}>
                  <p className="text-[10px] text-muted-foreground mb-1">Last Paid Fee</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {presentationMode ? '••••••' : formatCurrency(creator.lastPaidFee)}
                  </p>
                </div>
              </div>

              {/* Fee Trend */}
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                creator.feeTrend === 'increasing' ? 'bg-emerald-500/5 border-emerald-500/20' :
                creator.feeTrend === 'decreasing' ? 'bg-red-500/5 border-red-500/20' :
                'bg-secondary/40 border-border'
              )}>
                <span className={trendConfig.text}>{trendConfig.icon}</span>
                <div className="flex-1">
                  <p className={cn("text-xs font-medium", trendConfig.text)}>Fee Trend: {trendConfig.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {presentationMode ? 'Rate history hidden' : `Historical: ${creator.historicalRates.map(r => formatCurrency(r)).join(' → ')}`}
                  </p>
                </div>
              </div>

              {/* Fee History Chart */}
              {!presentationMode && (
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={80}>
                    <BarChart data={feeHistory}>
                      <Bar dataKey="fee" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Fee']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Past Collaborations */}
            <div className="col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={14} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Past Collaborations</h3>
              </div>
              
              {pastCampaigns.length > 0 ? (
                <div className="space-y-2">
                  {pastCampaigns.map(campaign => (
                    <button
                      key={campaign.id}
                      onClick={() => router.push(`/campaign/${campaign.id}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{campaign.name}</p>
                        <p className="text-[10px] text-muted-foreground">{campaign.client}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded",
                          campaign.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                          campaign.status === 'completed' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-secondary text-muted-foreground'
                        )}>
                          {campaign.status}
                        </span>
                        <ExternalLink size={10} className="text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar size={24} className="text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">No past collaborations</p>
                </div>
              )}
            </div>

            {/* Audience Demographics */}
            <div className="col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Audience Demographics</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Age Distribution */}
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2 text-center">Age Distribution</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <PieChart>
                      <Pie
                        data={ageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {ageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, '']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {ageData.map((item, idx) => (
                      <div key={item.name} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-mono text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender Distribution */}
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2 text-center">Gender</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : '#EC4899'} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, '']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {genderData.map((item, idx) => (
                      <div key={item.name} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: idx === 0 ? '#3B82F6' : '#EC4899' }} />
                          <span className="text-muted-foreground capitalize">{item.name}</span>
                        </div>
                        <span className="font-mono text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Region Distribution */}
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2 text-center">Region</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, '']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {regionData.map((item, idx) => (
                      <div key={item.name} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-mono text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </AppShell>
  )
}
