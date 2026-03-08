'use client'

import { AppShell } from '@/components/app-shell'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  prefix = '',
}: {
  label: string
  value: string
  change?: number
  icon: React.ElementType
  prefix?: string
}) {
  const positive = (change ?? 0) >= 0
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
          <Icon size={14} className="text-primary" />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold font-mono tabular-nums text-foreground">{prefix}{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs mt-1 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}% vs last quarter
          </div>
        )}
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const { presentationMode } = usePresentationMode()
  const activeCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'active')
  const totalBudget = MOCK_CAMPAIGNS.reduce((a, c) => a + c.budget, 0)
  const totalSpent = MOCK_CAMPAIGNS.reduce((a, c) => a + c.spent, 0)
  const totalViews = MOCK_CAMPAIGNS.reduce((a, c) => a + c.totalViews, 0)

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Agency Overview</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Q1 2025 — March 7, 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs">
              <Activity size={10} className="mr-1" />
              {activeCampaigns.length} Active Campaigns
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Campaign Budget" value={`${(totalBudget / 1000).toFixed(0)}K`} prefix="$" change={18.4} icon={DollarSign} />
          <StatCard label="Total Views Delivered" value={`${(totalViews / 1000000).toFixed(1)}M`} change={24.2} icon={Eye} />
          <StatCard label="Active Campaigns" value={String(activeCampaigns.length)} change={12.5} icon={Megaphone} />
          <StatCard label="Active Creators" value="24" change={8.1} icon={Users} />
        </div>

        {/* Campaigns Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">Active Campaigns</h2>
            <Link href="/campaigns" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Campaign</th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Client</th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Status</th>
                  <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Views</th>
                  {!presentationMode && <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Budget</th>}
                  {!presentationMode && <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Margin</th>}
                  <th className="text-right text-muted-foreground font-medium px-4 py-2.5">ER%</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CAMPAIGNS.map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/campaign/${c.id}`} className="text-foreground hover:text-primary transition-colors font-medium">
                        {c.name}
                      </Link>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {c.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.client}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-[10px] ${
                          c.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                          c.status === 'completed' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' :
                          'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                      {c.totalViews > 0 ? `${(c.totalViews / 1000000).toFixed(1)}M` : '—'}
                    </td>
                    {!presentationMode && (
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                        ${(c.budget / 1000).toFixed(0)}K
                      </td>
                    )}
                    {!presentationMode && (
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-400">
                        {c.marginPct}%
                      </td>
                    )}
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                      {c.avgEngagementRate > 0 ? `${c.avgEngagementRate}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
