'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { useUserRole } from '@/contexts/user-role'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { MOCK_CAMPAIGNS, MOCK_CAMPAIGN_ANALYTICS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { role } = useUserRole()
  const { presentationMode } = usePresentationMode()
  const [activeTab, setActiveTab] = useState<'campaigns' | 'performance' | 'contacts'>('campaigns')

  // Un-slugify and find client
  const clientName = id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const clientCampaigns = MOCK_CAMPAIGNS.filter(
    (c) => c.client.toLowerCase() === clientName.toLowerCase()
  )

  if (!clientCampaigns.length) {
    return (
      <AppShell>
        <div className="p-6">
          <p className="text-muted-foreground">Client not found</p>
          <Link href="/clients" className="text-primary hover:underline mt-4 inline-block">← Back to Clients</Link>
        </div>
      </AppShell>
    )
  }

  const totalViews = clientCampaigns.reduce((a, c) => a + c.totalViews, 0)
  const totalSpend = clientCampaigns.reduce((a, c) => a + c.spent, 0)
  const activeCampaigns = clientCampaigns.filter((c) => c.status === 'active').length
  const showFinancial = role === 'super_admin' && !presentationMode

  // Aggregate analytics data for line chart
  const analyticsData = clientCampaigns
    .flatMap((c) => MOCK_CAMPAIGN_ANALYTICS[c.id]?.stackedByPlatform || [])
    .reduce((acc, point) => {
      const existing = acc.find((p: any) => p.date === point.date)
      if (existing) {
        existing.YouTube = (existing.YouTube || 0) + (point.YouTube || 0)
        existing.Twitch = (existing.Twitch || 0) + (point.Twitch || 0)
        existing.TikTok = (existing.TikTok || 0) + (point.TikTok || 0)
        existing.Instagram = (existing.Instagram || 0) + (point.Instagram || 0)
      } else {
        acc.push(point)
      }
      return acc
    }, [])

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="bg-card border border-border rounded-xl p-6 flex items-start gap-6">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary">
              {clientName.substring(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{clientName}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-[10px]">Gaming</Badge>
              <span className="text-xs text-muted-foreground">Active since 2024</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/clients">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                <ChevronLeft size={12} /> Back
              </Button>
            </Link>
            <Button className="bg-primary text-primary-foreground h-8 text-xs">New Campaign</Button>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Campaigns</p>
            <p className="text-2xl font-bold">{clientCampaigns.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Views</p>
            <p className="text-2xl font-bold">{(totalViews / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Active Now</p>
            <p className="text-2xl font-bold">{activeCampaigns}</p>
          </div>
          <div className={cn('bg-card border border-border rounded-xl p-4', showFinancial && 'bg-emerald-500/5 border-emerald-500/20')}>
            <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
            <p className={cn('text-2xl font-bold', showFinancial ? '' : 'text-muted-foreground')}>
              {showFinancial ? `$${(totalSpend / 1000).toFixed(0)}K` : '••••'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {(['campaigns', 'performance', 'contacts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize',
                activeTab === tab
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab === 'campaigns' ? 'Campaign History' : tab === 'performance' ? 'Performance' : 'Contacts'}
            </button>
          ))}
        </div>

        {/* Campaign History Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-secondary/30 border-b border-border/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Campaign</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Platforms</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Views</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">ER %</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {clientCampaigns.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="p-3 text-foreground font-medium">{c.name}</td>
                      <td className="p-3">
                        <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                          {c.status}
                        </Badge>
                      </td>
                      <td className="p-3 flex gap-1">
                        {c.platforms.map((p) => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary">
                            {p}
                          </span>
                        ))}
                      </td>
                      <td className="p-3 font-mono">{(c.totalViews / 1000000).toFixed(1)}M</td>
                      <td className="p-3 font-mono">{c.avgEngagementRate}%</td>
                      <td className="p-3 text-muted-foreground text-[10px]">
                        {c.startDate} → {c.endDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-4">
            {/* Views Chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Views Over Time — All Campaigns</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => { const v = value as number; return `${(v / 1000000).toFixed(1)}M` }} />
                  <Legend />
                  <Line type="monotone" dataKey="YouTube" stroke="#FF0000" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Twitch" stroke="#9146FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="TikTok" stroke="#69C9D0" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Instagram" stroke="#E1306C" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Platform Mix & Top Creators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Platform Mix</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={[
                      { name: 'YouTube', value: 35 },
                      { name: 'Twitch', value: 28 },
                      { name: 'TikTok', value: 22 },
                      { name: 'Instagram', value: 15 },
                    ]} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                      {[
                        { name: 'YouTube', color: '#FF0000' },
                        { name: 'Twitch', color: '#9146FF' },
                        { name: 'TikTok', color: '#69C9D0' },
                        { name: 'Instagram', color: '#E1306C' },
                      ].map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Top Performing Creators</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { name: '@SypherPK', views: 12400000 },
                    { name: '@Ninja', views: 9800000 },
                    { name: '@Shroud', views: 8200000 },
                    { name: '@Pokimane', views: 7500000 },
                  ].map((creator) => (
                    <div key={creator.name} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                      <span className="text-foreground">{creator.name}</span>
                      <span className="font-mono text-muted-foreground">{(creator.views / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', title: 'Head of Marketing', email: 'sarah@epicgames.com', phone: '+1 (206) 555-0123', primary: true },
              { name: 'Mike Chen', title: 'Brand Manager', email: 'mike@epicgames.com', phone: '+1 (206) 555-0124', primary: false },
            ].map((contact, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{contact.name}</h3>
                      {contact.primary && <Badge className="text-[10px]">Primary Contact</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{contact.title}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xs font-bold">{contact.name.substring(0, 1)}</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="h-7 text-xs">+ Add Contact</Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
