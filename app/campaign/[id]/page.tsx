'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_DELIVERABLES, MOCK_CAMPAIGN_ANALYTICS, MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { cn } from '@/lib/utils'
import {
  ArrowUp,
  ArrowDown,
  Download,
  FileText,
  MessageSquare,
  Save,
  Youtube,
  Twitch,
  TrendingUp,
  Eye,
  MessageCircle,
  Share2,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const platformIcons: Record<string, React.ReactNode> = {
  YouTube: <Youtube size={13} className="text-red-500" />,
  Twitch: <Twitch size={13} className="text-purple-500" />,
  TikTok: <TrendingUp size={13} className="text-pink-500" />,
  Instagram: <Eye size={13} className="text-pink-400" />,
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === params.id) || MOCK_CAMPAIGNS[0]
  const [activeTab, setActiveTab] = useState('overview')

  const profit = campaign.spent * (campaign.marginPct / 100)
  const profitChange = 8.5
  const viewsChange = 5.2
  const costPerView = campaign.spent > 0 ? ((campaign.spent / campaign.totalViews) * 1000).toFixed(2) : '0'

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Breadcrumb & Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/campaigns" className="text-xs text-muted-foreground hover:text-foreground">
              Campaigns
            </Link>
            <span className="text-xs text-muted-foreground">/</span>
            <h1 className="text-lg font-semibold text-foreground">{campaign.name}</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-xs font-medium pb-3 px-2 transition-colors ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`text-xs font-medium pb-3 px-2 transition-colors ${
              activeTab === 'analytics'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 border-border">
            <Download size={12} /> Download
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 border-border">
            <MessageSquare size={12} /> Chat
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 border-border">
            <Save size={12} /> Save
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Card 1: Accrued Client Spend */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Accrued Client Spend</span>
              <DollarSign size={14} className="text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground font-mono">
              {presentationMode ? '••••' : `$${(campaign.spent / 1000).toFixed(0)}K`}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500">
              <ArrowUp size={11} /> +{viewsChange}%
            </div>
          </div>

          {/* Card 2: Forecasted Views */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Forecasted Views</span>
              <Eye size={14} className="text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground font-mono">
              {(campaign.totalViews / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500">
              <ArrowUp size={11} /> +{viewsChange}%
            </div>
          </div>

          {/* Card 3: Agency Profit */}
          <div className={cn(
            'bg-card border border-border rounded-lg p-4',
            presentationMode && 'opacity-40 pointer-events-none'
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Agency Profit</span>
              <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-500 font-mono">
              ${(profit / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500">
              <ArrowUp size={11} /> +{profitChange}%
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Chart Placeholder */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Total Views Over Time</h3>
              <div className="h-48 bg-secondary/30 rounded flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Line Chart Placeholder</span>
              </div>
            </div>

            {/* Deliverables Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-semibold text-foreground">Deliverables</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">Platform</th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">Creator</th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">Type</th>
                      <th className="text-right px-5 py-3 text-muted-foreground font-medium">Views</th>
                      <th className="text-right px-5 py-3 text-muted-foreground font-medium">Likes</th>
                      <th className="text-right px-5 py-3 text-muted-foreground font-medium">Comments</th>
                      <th className="text-right px-5 py-3 text-muted-foreground font-medium">Shares</th>
                      <th className="text-right px-5 py-3 text-muted-foreground font-medium">ER%</th>
                      {!presentationMode && (
                        <>
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">Int. Price</th>
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">Client Price</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DELIVERABLES.slice(0, 5).map((d, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-4">{platformIcons[d.platform] || d.platform}</td>
                        <td className="px-5 py-4 font-medium text-foreground">{d.creator}</td>
                        <td className="px-5 py-4 text-muted-foreground">{d.type}</td>
                        <td className="text-right px-5 py-4 font-mono text-foreground">
                          {(d.views / 1000000).toFixed(1)}M
                        </td>
                        <td className="text-right px-5 py-4 font-mono text-foreground">
                          {(d.likes / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right px-5 py-4 font-mono text-foreground">
                          {(d.comments / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right px-5 py-4 font-mono text-foreground">
                          {(d.shares / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right px-5 py-4 font-mono text-foreground">{d.er}%</td>
                        {!presentationMode && (
                          <>
                            <td className="text-right px-5 py-4 font-mono text-foreground">${d.internalPrice}</td>
                            <td className="text-right px-5 py-4 font-mono text-foreground">${d.clientPrice}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Campaign Analytics</h3>
            <div className="h-64 bg-secondary/30 rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Analytics Dashboard Placeholder</span>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
