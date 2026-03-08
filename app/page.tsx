'use client'

import { AppShell } from '@/components/app-shell'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, DollarSign, Package, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Mock profit trend data
const profitTrendData = [
  { month: 'Jan', profit: 48000 },
  { month: 'Feb', profit: 62000 },
  { month: 'Mar', profit: 78000 },
]

// Mock spend per client data
const spendPerClientData = [
  { client: 'Epic Games', spend: 312000, color: '#FF0000' },
  { client: 'Riot Games', spend: 195000, color: '#9146FF' },
  { client: 'Nike', spend: 348500, color: '#E1306C' },
  { client: 'AMD', spend: 0, color: '#FFB700' },
]

// Mock recent activity
const recentActivity = [
  { id: 1, type: 'deliverable', message: '@SypherPK video went live on YouTube', campaign: 'Fortnite Q1 Launch', timestamp: '2 hours ago' },
  { id: 2, type: 'campaign', message: 'Valorant campaign exceeded view target', campaign: 'Valorant Act III', timestamp: '4 hours ago' },
  { id: 3, type: 'deliverable', message: '@Ninja stream peaked at 72K viewers', campaign: 'Fortnite Q1 Launch', timestamp: '6 hours ago' },
  { id: 4, type: 'campaign', message: 'Nike campaign completed with 31.5M views', campaign: 'Spring/Summer 2025', timestamp: '1 day ago' },
  { id: 5, type: 'deliverable', message: '@Clix TikTok video received 8.4M views', campaign: 'Fortnite Q1 Launch', timestamp: '2 days ago' },
]

export default function AgencyDashboard() {
  const { presentationMode } = usePresentationMode()

  // Calculate KPIs
  const activeCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'active').length
  const totalSpend = MOCK_CAMPAIGNS.reduce((a, c) => a + c.spent, 0)
  const totalProfit = MOCK_CAMPAIGNS.reduce((a, c) => a + (c.spent * c.marginPct / 100), 0)
  const totalViews = MOCK_CAMPAIGNS.reduce((a, c) => a + c.totalViews, 0)

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agency Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">High-level overview and recent activity</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Active Campaigns</span>
              <Package size={14} className="text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{activeCampaigns}</div>
            <div className="text-xs text-muted-foreground mt-1">of {MOCK_CAMPAIGNS.length} total</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Total Views</span>
              <TrendingUp size={14} className="text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground font-mono">
              {(totalViews / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">across all campaigns</div>
          </div>

          {!presentationMode && (
            <>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Total Spend</span>
                  <DollarSign size={14} className="text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-foreground font-mono">
                  ${(totalSpend / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-muted-foreground mt-1">client spend</div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Total Profit</span>
                  <DollarSign size={14} className="text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  ${(totalProfit / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-muted-foreground mt-1">agency profit</div>
              </div>
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profit Trend */}
          {!presentationMode && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Profit Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Spend per Client */}
          {!presentationMode && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Spend per Client</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={spendPerClientData.filter(d => d.spend > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ client, spend }) => `${client}: $${(spend / 1000).toFixed(0)}K`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="spend"
                  >
                    {spendPerClientData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    activity.type === 'deliverable' ? 'bg-blue-400' : 'bg-green-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] border-border">
                      {activity.campaign}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
