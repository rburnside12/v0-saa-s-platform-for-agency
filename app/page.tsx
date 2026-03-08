'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { cn } from '@/lib/utils'
import { ChevronRight, Lock, TrendingUp, Users, DollarSign, Percent, BarChart3, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

// Mock top clients data
const TOP_CLIENTS = [
  { name: 'Epic Games', campaigns: 3, totalSpend: 312000, views: 48200000 },
  { name: 'Riot Games', campaigns: 2, totalSpend: 195000, views: 31500000 },
  { name: 'Nike', campaigns: 1, totalSpend: 348500, views: 42800000 },
  { name: 'AMD', campaigns: 1, totalSpend: 89000, views: 12400000 },
]

export default function AgencyDashboard() {
  const { presentationMode } = usePresentationMode()
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false)

  // Calculate Agency-Wide KPIs (non-rounded, detailed)
  const totalViews = MOCK_CAMPAIGNS.reduce((a, c) => a + c.totalViews, 0)
  const totalEngagements = Math.floor(totalViews * 0.054) // 5.4% engagement rate
  const totalClientSpend = MOCK_CAMPAIGNS.reduce((a, c) => a + c.spent, 0)
  const avgEngagementRate = 5.42 // fixed for display
  const avgExternalCpm = 46.18 // fixed for display

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agency Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">High-level performance across all campaigns</p>
          </div>
          <Button 
            onClick={() => setShowNewCampaignDialog(true)}
            className="bg-primary text-primary-foreground h-8 text-xs gap-1.5"
          >
            <Plus size={13} /> New Campaign
          </Button>
        </div>

        {/* KPI Bento Row — 5 Cards */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Total Views</span>
              <TrendingUp size={14} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">{totalViews.toLocaleString()}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Total Engagements</span>
              <Users size={14} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">{totalEngagements.toLocaleString()}</p>
          </div>

          <div className={cn("bg-card border border-border rounded-xl p-5", presentationMode && "opacity-40")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Total Client Spend</span>
              {presentationMode ? <Lock size={14} className="text-muted-foreground" /> : <DollarSign size={14} className="text-blue-500" />}
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              {presentationMode ? '••••••' : `$${totalClientSpend.toLocaleString()}`}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Avg. Engagement Rate</span>
              <Percent size={14} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">{avgEngagementRate}%</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Avg. External CPM</span>
              <BarChart3 size={14} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">${avgExternalCpm}</p>
          </div>
        </div>

        {/* Active Campaigns Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">Active Campaigns</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="text-left px-6 py-3 text-muted-foreground font-medium">Campaign</th>
                  <th className="text-left px-6 py-3 text-muted-foreground font-medium">Client</th>
                  <th className="text-left px-6 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-right px-6 py-3 text-muted-foreground font-medium">Views</th>
                  <th className="text-right px-6 py-3 text-muted-foreground font-medium">Deliverables</th>
                  {!presentationMode && <th className="text-right px-6 py-3 text-muted-foreground font-medium">Client Spend</th>}
                  <th className="text-right px-6 py-3 text-muted-foreground font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CAMPAIGNS.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/campaign/${campaign.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{campaign.client}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] capitalize",
                          campaign.status === 'active' && "border-green-500 text-green-600 bg-green-50",
                          campaign.status === 'completed' && "border-blue-500 text-blue-600 bg-blue-50",
                          campaign.status === 'draft' && "border-gray-400 text-gray-500 bg-gray-50"
                        )}
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="text-right px-6 py-4 font-mono font-bold text-foreground">
                      {campaign.totalViews.toLocaleString()}
                    </td>
                    <td className="text-right px-6 py-4 font-mono text-foreground">
                      {campaign.deliverables}
                    </td>
                    {!presentationMode && (
                      <td className="text-right px-6 py-4 font-mono text-foreground">
                        ${campaign.spent.toLocaleString()}
                      </td>
                    )}
                    <td className="text-right px-6 py-4">
                      <Link href={`/campaign/${campaign.id}`}>
                        <ChevronRight size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">Top Clients</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="text-left px-6 py-3 text-muted-foreground font-medium">Client</th>
                  <th className="text-right px-6 py-3 text-muted-foreground font-medium">Campaigns</th>
                  <th className="text-right px-6 py-3 text-muted-foreground font-medium">Total Views</th>
                  {!presentationMode && <th className="text-right px-6 py-3 text-muted-foreground font-medium">Total Spend</th>}
                </tr>
              </thead>
              <tbody>
                {TOP_CLIENTS.map((client, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                    <td className="text-right px-6 py-4 font-mono text-foreground">{client.campaigns}</td>
                    <td className="text-right px-6 py-4 font-mono font-bold text-foreground">{client.views.toLocaleString()}</td>
                    {!presentationMode && (
                      <td className="text-right px-6 py-4 font-mono text-foreground">${client.totalSpend.toLocaleString()}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Campaign Dialog */}
        <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Campaign</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Enter campaign details to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Campaign Name</label>
                <Input placeholder="e.g., Q2 Gaming Push" className="h-8 text-xs border-border" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Client</label>
                <Input placeholder="e.g., Epic Games" className="h-8 text-xs border-border" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total Budget</label>
                <Input placeholder="e.g., 100000" className="h-8 text-xs border-border" type="number" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs border-border">Cancel</Button>
              <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground">Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
