'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { useUserRole } from '@/contexts/user-role'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { MOCK_CAMPAIGNS, MOCK_PAYMENTS } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DollarSign, TrendingUp, Eye, Percent, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function FinancePage() {
  const { role } = useUserRole()
  const router = useRouter()
  const { presentationMode } = usePresentationMode()
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  useEffect(() => {
    if (role !== 'super_admin') {
      router.push('/')
    }
  }, [role, router])

  if (role !== 'super_admin') return null

  const totalRevenue = MOCK_CAMPAIGNS.reduce((a, c) => a + c.spent, 0)
  const totalViews = MOCK_CAMPAIGNS.reduce((a, c) => a + c.totalViews, 0)
  const avgER = 5.42
  const avgMargin = 28
  const totalOutstanding = MOCK_PAYMENTS.filter(p => p.status === 'pending' || p.status === 'approved').reduce((a, p) => a + p.amount, 0)
  const totalOverdue = MOCK_PAYMENTS.filter(p => p.status === 'overdue').reduce((a, p) => a + p.amount, 0)
  const paidThisMonth = MOCK_PAYMENTS.filter(p => p.status === 'paid').reduce((a, p) => a + p.amount, 0)

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finance</h1>
            <p className="text-sm text-muted-foreground mt-1">Agency-wide financial performance</p>
          </div>
          <Badge className="bg-primary/15 text-primary text-[10px] px-2 py-0.5 ml-auto">Super Admin Only</Badge>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { icon: DollarSign, label: 'Total Client Revenue', value: presentationMode ? '••••' : `$${(totalRevenue / 1000).toFixed(0)}K`, color: 'text-foreground' },
            { icon: Eye, label: 'Total Views', value: `${(totalViews / 1000000).toFixed(1)}M`, color: 'text-foreground' },
            { icon: Percent, label: 'Avg Engagement Rate', value: `${avgER}%`, color: 'text-foreground' },
            { icon: TrendingUp, label: 'Avg External CPM', value: presentationMode ? '••••' : '$46.18', color: 'text-foreground' },
            { icon: AlertCircle, label: 'Avg Profit Margin', value: presentationMode ? '••••' : `${avgMargin}%`, color: 'text-emerald-400' },
          ].map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <div key={i} className={cn('bg-card border border-border rounded-xl p-5', i === 4 && 'bg-emerald-500/5 border-emerald-500/20')}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
                <p className={cn('text-2xl font-bold font-mono', kpi.color)}>{kpi.value}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('active')}
            className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'active' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Active Campaigns
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'completed' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Completed Campaigns
          </button>
        </div>

        {/* Campaigns Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Views</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Deliverables</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Client Spend</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Margin %</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">→</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CAMPAIGNS.filter(c => c.status === (activeTab === 'active' ? 'active' : 'completed')).map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 text-foreground font-medium">{c.name}</td>
                    <td className="p-3 text-muted-foreground">{c.client}</td>
                    <td className="p-3 font-mono">{(c.totalViews / 1000000).toFixed(1)}M</td>
                    <td className="p-3">{c.deliverables}</td>
                    <td className={cn('p-3 font-mono', presentationMode && 'text-muted-foreground')}>{presentationMode ? '••••' : `$${(c.spent / 1000).toFixed(0)}K`}</td>
                    <td className={cn('p-3 font-mono text-emerald-400', presentationMode && 'text-muted-foreground')}>{presentationMode ? '••••' : `${c.marginPct}%`}</td>
                    <td className="p-3 text-center"><Link href={`/campaign/${c.id}`} className="text-primary hover:underline">→</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Clients Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-secondary/30">
            <h2 className="text-sm font-semibold text-foreground">Top Clients</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Campaigns</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Total Views</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Total Spend</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Avg Margin</th>
                </tr>
              </thead>
              <tbody>
                {['Epic Games', 'Riot Games', 'Nike', 'AMD'].map(clientName => {
                  const clientCampaigns = MOCK_CAMPAIGNS.filter(c => c.client === clientName)
                  const totalSpend = clientCampaigns.reduce((a, c) => a + c.spent, 0)
                  const totalViews = clientCampaigns.reduce((a, c) => a + c.totalViews, 0)
                  const avgMargin = Math.round(clientCampaigns.reduce((a, c) => a + c.marginPct, 0) / clientCampaigns.length)
                  return (
                    <tr key={clientName} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-3 text-foreground font-medium">{clientName}</td>
                      <td className="p-3">{clientCampaigns.length}</td>
                      <td className="p-3 font-mono">{(totalViews / 1000000).toFixed(1)}M</td>
                      <td className={cn('p-3 font-mono', presentationMode && 'text-muted-foreground')}>{presentationMode ? '••••' : `$${(totalSpend / 1000).toFixed(0)}K`}</td>
                      <td className={cn('p-3 font-mono text-emerald-400', presentationMode && 'text-muted-foreground')}>{presentationMode ? '••••' : `${avgMargin}%`}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments Overview */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Payments Overview</h2>
            <Link href="/finance/payments" className="text-xs text-primary hover:underline">View all payments →</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Outstanding', value: presentationMode ? '••••' : `$${(totalOutstanding / 1000).toFixed(0)}K`, icon: AlertCircle, color: 'bg-amber-500/5 border-amber-500/20' },
              { label: 'Total Overdue', value: presentationMode ? '••••' : `$${(totalOverdue / 1000).toFixed(0)}K`, icon: AlertCircle, color: 'bg-red-500/5 border-red-500/20' },
              { label: 'Paid This Month', value: presentationMode ? '••••' : `$${(paidThisMonth / 1000).toFixed(0)}K`, icon: CheckCircle2, color: 'bg-emerald-500/5 border-emerald-500/20' },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className={cn('border rounded-xl p-4', stat.color)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                  <p className="text-lg font-bold font-mono">{stat.value}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
