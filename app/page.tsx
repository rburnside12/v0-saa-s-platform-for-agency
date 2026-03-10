'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppShell } from '@/components/app-shell'
import { useUserRole } from '@/contexts/user-role'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChevronRight, AlertTriangle, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { role } = useUserRole()
  const { presentationMode } = usePresentationMode()

  // SUPER ADMIN: Finance Dashboard
  if (role === 'super_admin') {
    const totalSpend = MOCK_CAMPAIGNS.reduce((a, c) => a + c.spent, 0)
    const totalViews = MOCK_CAMPAIGNS.reduce((a, c) => a + c.totalViews, 0)
    const avgER = 5.42

    return (
      <AppShell>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finance Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Agency-wide financial performance</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: 'Total Client Revenue', value: presentationMode ? '••••' : `$${(totalSpend / 1000).toFixed(0)}K`, color: 'text-foreground' },
              { label: 'Total Views', value: `${(totalViews / 1000000).toFixed(1)}M`, color: 'text-foreground' },
              { label: 'Avg Engagement Rate', value: `${avgER}%`, color: 'text-foreground' },
              { label: 'Avg External CPM', value: presentationMode ? '••••' : '$46.18', color: 'text-foreground' },
              { label: 'Avg Profit Margin', value: presentationMode ? '••••' : '28%', color: 'text-emerald-400' },
            ].map((kpi, i) => (
              <div key={i} className={cn('bg-card border border-border rounded-xl p-5', i === 4 && 'bg-emerald-500/5 border-emerald-500/20')}>
                <p className="text-xs text-muted-foreground mb-2">{kpi.label}</p>
                <p className={cn('text-2xl font-bold font-mono', kpi.color)}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Active Campaigns Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-secondary/30">
              <h2 className="text-sm font-semibold text-foreground">Active Campaigns</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-border/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Campaign</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Views</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Spend</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CAMPAIGNS.filter(c => c.status === 'active').map(c => {
                    const spend = presentationMode ? '••••' : `$${(c.spent / 1000).toFixed(0)}K`
                    return (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-foreground font-medium">{c.name}</td>
                        <td className="p-3 text-muted-foreground">{c.client}</td>
                        <td className="p-3 font-mono">{(c.totalViews / 1000000).toFixed(1)}M</td>
                        <td className={cn('p-3 font-mono', presentationMode && 'text-muted-foreground')}>{spend}</td>
                        <td className={cn('p-3 font-mono text-emerald-400', presentationMode && 'text-muted-foreground')}>{presentationMode ? '••••' : `${c.marginPct}%`}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  // NON-ADMIN: My Campaigns Home
  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, Robert</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening across your campaigns today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-2">My Active Campaigns</p>
            <p className="text-2xl font-bold">{MOCK_CAMPAIGNS.filter(c => c.status === 'active').length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-2">Deliverables Due This Week</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-2">Pending Approvals</p>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-2">Anomalies Flagged</p>
            <p className="text-2xl font-bold text-amber-400">2</p>
          </div>
        </div>

        {/* My Active Campaigns */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">My Active Campaigns</h2>
            <Link href="/campaigns">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                View All <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Views</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Deliverables</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CAMPAIGNS.filter(c => c.status === 'active').slice(0, 5).map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="p-3 text-foreground font-medium">{c.name}</td>
                    <td className="p-3 text-muted-foreground">{c.client}</td>
                    <td className="p-3 font-mono">{(c.totalViews / 1000000).toFixed(1)}M</td>
                    <td className="p-3">{c.deliverables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Anomalies & Deadlines Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Anomalies Widget */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-foreground">Anomalies to Review</h3>
              <Badge className="ml-auto bg-amber-500/15 text-amber-400 text-[10px]">2 flagged</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs py-2 border-b border-border/50">
                <span className="text-foreground font-medium">@SypherPK</span>
                <span className="text-muted-foreground flex-1">Fortnite Q1</span>
                <Badge variant="secondary" className="text-[10px]">YouTube</Badge>
                <span className="font-mono text-amber-400">+284%</span>
              </div>
              <div className="flex items-center gap-2 text-xs py-2">
                <span className="text-foreground font-medium">@Clix</span>
                <span className="text-muted-foreground flex-1">Fortnite Q1</span>
                <Badge variant="secondary" className="text-[10px]">TikTok</Badge>
                <span className="font-mono text-red-400">-71%</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Outliers are posts exceeding 3× or falling below 0.3× the creator's 30-day average</p>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Deadlines</h3>
            <div className="space-y-0">
              {[
                { name: 'Dedicated Video - @Ninja', campaign: 'Fortnite Q1', date: 'Mar 12', overdue: false, days: 2 },
                { name: 'Stream 12h - @Shroud', campaign: 'Valorant Act III', date: 'Mar 15', overdue: false, days: 5 },
                { name: 'Sponsorship - @Pokimane', campaign: 'Nike Spring', date: 'Mar 18', overdue: false, days: 8 },
                { name: 'YouTube Video - @Valkyrae', campaign: 'Epic Games', date: 'Mar 20', overdue: false, days: 10 },
                { name: 'Integration - @SypherPK', campaign: 'Nike Spring', date: 'Mar 22', overdue: false, days: 12 },
              ].map((deadline, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className={cn('w-1 h-8 rounded-full flex-shrink-0', 
                    deadline.days <= 3 ? 'bg-amber-500' : deadline.days > 8 ? 'bg-emerald-500' : 'bg-amber-500/40'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{deadline.name}</p>
                    <p className="text-[10px] text-muted-foreground">{deadline.campaign}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{deadline.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
