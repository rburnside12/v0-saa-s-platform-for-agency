'use client'

import { use } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignReportTab } from '@/components/campaign-report-tab'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { ArrowLeft, Plus, BarChart3, Check } from 'lucide-react'
import { MOCK_CAMPAIGNS, MOCK_CREATORS, MOCK_PAYMENTS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  completed: 'bg-blue-500/15 text-blue-400',
  draft: 'bg-slate-500/15 text-slate-300',
  archived: 'bg-muted text-muted-foreground',
}

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'bg-red-500/15 text-red-400',
  TikTok: 'bg-cyan-500/15 text-cyan-400',
  Twitch: 'bg-purple-500/15 text-purple-400',
  Instagram: 'bg-pink-500/15 text-pink-400',
  X: 'bg-slate-500/15 text-slate-300',
}

const DELIVERABLE_STATUS: Record<string, string> = {
  Contracted: 'bg-blue-500/15 text-blue-400',
  'Brief Sent': 'bg-amber-500/15 text-amber-400',
  'Content Submitted': 'bg-purple-500/15 text-purple-400',
  Approved: 'bg-cyan-500/15 text-cyan-400',
  Live: 'bg-emerald-500/15 text-emerald-400',
  Paid: 'bg-green-500/15 text-green-400',
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { presentationMode } = usePresentationMode()
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === id)

  if (!campaign) {
    return (
      <AppShell>
        <div className="p-6 text-center text-muted-foreground">Campaign not found</div>
      </AppShell>
    )
  }

  const spentPercentage = (campaign.spent / campaign.budget) * 100
  const campaignPayments = MOCK_PAYMENTS.filter(p => p.campaignId === campaign.id)

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Link href="/campaigns" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={13} /> Back to Campaigns
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{campaign.client}</p>
            <div className="flex gap-2 mt-3">
              <Badge className={cn('text-xs', STATUS_COLORS[campaign.status])}>{campaign.status}</Badge>
              {campaign.platforms.map(p => (
                <Badge key={p} className={cn('text-xs', PLATFORM_COLORS[p])}>{p}</Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">Edit Campaign</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <BarChart3 size={12} /> Generate Report
            </Button>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Start Date</p>
              <p className="text-sm font-semibold text-foreground">{new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">End Date</p>
              <p className="text-sm font-semibold text-foreground">{new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Campaign Manager</p>
              <p className="text-sm font-semibold text-foreground">{campaign.manager}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Margin</p>
              <p className="text-sm font-semibold text-foreground">{campaign.marginPct}%</p>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="pt-5 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Budget Spending</p>
              <p className="text-xs font-mono text-foreground">
                {presentationMode ? '•••' : `$${(campaign.spent / 1000).toFixed(0)}K / $${(campaign.budget / 1000).toFixed(0)}K`}
              </p>
            </div>
            <Progress value={spentPercentage} className="h-2" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Views', value: campaign.totalViews >= 1000000 ? `${(campaign.totalViews / 1000000).toFixed(1)}M` : `${(campaign.totalViews / 1000).toFixed(0)}K` },
            { label: 'Total Engagements', value: campaign.totalImpressions >= 1000000 ? `${(campaign.totalImpressions / 1000000).toFixed(1)}M` : `${(campaign.totalImpressions / 1000).toFixed(0)}K` },
            { label: 'Avg CPM', value: '$' + (campaign.budget / (campaign.totalImpressions / 1000)).toFixed(2) },
            { label: 'Deliverables', value: `${campaign.deliverables}/40` },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Campaign Phase Stepper */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-6">Campaign Phase</h3>
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Sales' },
              { step: 2, label: 'Strategy & Planning' },
              { step: 3, label: 'Contracting' },
              { step: 4, label: 'Production' },
              { step: 5, label: 'Reporting' },
            ].map((phase, idx) => {
              const isActive = phase.step <= (campaign.status === 'active' ? 4 : campaign.status === 'completed' ? 5 : 2)
              const isCompleted = phase.step < (campaign.status === 'active' ? 4 : campaign.status === 'completed' ? 5 : 2)
              return (
                <div key={phase.step} className="flex items-center flex-1">
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs',
                    isCompleted ? 'bg-emerald-500/15 text-emerald-400' : isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  )}>
                    {isCompleted ? <Check size={14} /> : phase.step}
                  </div>
                  {idx < 4 && (
                    <div className={cn(
                      'flex-1 h-1 mx-2',
                      isCompleted ? 'bg-emerald-500' : isActive ? 'bg-primary' : 'bg-secondary'
                    )}></div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {[
              'Sales',
              'Strategy & Planning',
              'Contracting',
              'Production',
              'Reporting',
            ].map((label, idx) => (
              <p key={idx} className="text-[10px] text-muted-foreground text-center">{label}</p>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="creators" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="creators">Creators & Deliverables</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* TAB 1: Creators & Deliverables */}
          <TabsContent value="creators" className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" className="h-8 text-xs gap-1.5">
                <Plus size={12} /> Add Creator
              </Button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Creator</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Platform</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Deliverable</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Fee Agreed</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Fee Paid</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Go-Live Date</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPayments.slice(0, 5).map(payment => (
                    <tr key={payment.id} className="border-b border-border/50 hover:bg-secondary/40">
                      <td className="px-4 py-3 font-medium text-foreground">{payment.creatorName}</td>
                      <td className="px-4 py-3">{payment.campaignId === 'epic-games-q1' ? 'YouTube' : 'TikTok'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{payment.deliverable}</td>
                      <td className="px-4 py-3 text-right font-mono">{presentationMode ? '•••' : `$${payment.amount.toLocaleString()}`}</td>
                      <td className="px-4 py-3 text-right font-mono">{presentationMode ? '•••' : (payment.status === 'paid' ? `$${payment.amount.toLocaleString()}` : '—')}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={`text-[10px] ${DELIVERABLE_STATUS[payment.status] || DELIVERABLE_STATUS.Contracted}`}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 2: Content */}
          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { creator: '@SypherPK', platform: 'YouTube', type: 'Video', date: 'Mar 5', views: '2.8M', likes: '142K', status: 'Live' },
                { creator: '@Clix', platform: 'TikTok', type: 'Sponsorship', date: 'Mar 4', views: '8.4M', likes: '620K', status: 'Live' },
                { creator: '@Nickmercs', platform: 'Twitch', type: 'Stream', date: 'Mar 3', views: '— CCV', likes: '28K', status: 'Approved' },
              ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.creator}</p>
                      <p className="text-xs text-muted-foreground">{item.platform}</p>
                    </div>
                    <Badge className={cn('text-[10px]', PLATFORM_COLORS[item.platform])}>
                      {item.platform}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs mb-3 pb-3 border-b border-border/50">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-foreground font-medium">{item.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Go-Live:</span>
                      <span className="text-foreground font-medium">{item.date}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground space-y-1 mb-3">
                    <div className="flex justify-between"><span>Views:</span><span className="font-mono text-foreground">{item.views}</span></div>
                    <div className="flex justify-between"><span>Likes:</span><span className="font-mono text-foreground">{item.likes}</span></div>
                  </div>
                  <Badge className={`text-[10px] w-full justify-center ${DELIVERABLE_STATUS[item.status] || 'bg-secondary text-muted-foreground'}`}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: Report */}
          <TabsContent value="report">
            <CampaignReportTab presentationMode={presentationMode} />
          </TabsContent>

          {/* TAB 4: Payments */}
          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" className="h-8 text-xs gap-1.5">
                <Plus size={12} /> Log Payment
              </Button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Creator</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Deliverable</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPayments.map(payment => (
                    <tr
                      key={payment.id}
                      className={cn(
                        'border-b border-border/50 hover:bg-secondary/40',
                        payment.status === 'overdue' && 'bg-red-500/5'
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{payment.creatorName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{payment.deliverable}</td>
                      <td className="px-4 py-3 text-right font-mono">{presentationMode ? '•••' : `$${payment.amount.toLocaleString()}`}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={`text-[10px] ${
                          payment.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' :
                          payment.status === 'approved' ? 'bg-blue-500/15 text-blue-400' :
                          payment.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                          payment.status === 'invoice_received' ? 'bg-cyan-500/15 text-cyan-400' :
                          'bg-red-500/15 text-red-400'
                        }`}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(payment.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-muted-foreground">{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                <p className="text-2xl font-bold font-mono text-emerald-400">
                  {presentationMode ? '•••' : `$${campaignPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Outstanding</p>
                <p className="text-2xl font-bold font-mono text-amber-400">
                  {presentationMode ? '•••' : `$${campaignPayments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
