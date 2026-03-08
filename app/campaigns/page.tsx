'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  YouTube: <svg className="w-3.5 h-3.5 fill-red-600" viewBox="0 0 24 24"><path d="M19.615 3.712c-1.899-.596-7.615-.596-9.514-.596s-7.615 0-9.514.596C.051 4.934.051 8.806.051 12s0 7.066.752 8.288c1.899.596 7.615.596 9.514.596s7.615 0 9.514-.596c.701-1.222.752-5.094.752-8.288 0-3.194 0-7.066-.752-8.288zM9.046 15.13V8.87c3.505.987 3.505 3.077 3.505 3.077 0 3.077 0 3.077-3.505 3.183z"/></svg>,
  Twitch: <svg className="w-3.5 h-3.5 fill-purple-600" viewBox="0 0 24 24"><path d="M11 2H2v20h7v-5h4l4-4v-11h-6zm6 10l-3 3h-4v-3h7z"/></svg>,
  TikTok: <svg className="w-3.5 h-3.5 fill-black dark:fill-white" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.92-2.46v3.6a6.63 6.63 0 1 0 9.69 5.63V9.01a8.35 8.35 0 0 0 4.84-2.65z"/></svg>,
  Instagram: <svg className="w-3.5 h-3.5 fill-pink-600" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><circle cx="12" cy="12" r="3.6" fill="currentColor"/><circle cx="18.406" cy="5.594" r="0.9" fill="currentColor"/></svg>,
  X: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.91 6.75H2.556l7.73-8.835L1.488 2.25h6.75l4.915 6.516 5.495-6.516zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
}

export default function CampaignsPage() {
  const { presentationMode } = usePresentationMode()
  const [search, setSearch] = useState('')
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false)

  const filtered = MOCK_CAMPAIGNS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.client.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Campaigns</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {MOCK_CAMPAIGNS.length} campaigns</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowNewCampaignDialog(true)}
            className="bg-primary text-primary-foreground h-8 text-xs gap-1.5"
          >
            <Plus size={13} /> New Campaign
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns or clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs bg-secondary border-border w-80"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left text-muted-foreground font-medium px-6 py-3">Campaign Name</th>
                  <th className="text-left text-muted-foreground font-medium px-6 py-3">Client</th>
                  <th className="text-left text-muted-foreground font-medium px-6 py-3">Status</th>
                  <th className="text-center text-muted-foreground font-medium px-6 py-3">Platforms</th>
                  <th className="text-right text-muted-foreground font-medium px-6 py-3">Views</th>
                  <th className="text-right text-muted-foreground font-medium px-6 py-3">ER%</th>
                  {!presentationMode && <th className="text-right text-muted-foreground font-medium px-6 py-3">Budget</th>}
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/campaign/${c.id}`} className="text-foreground hover:text-primary transition-colors font-medium">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{c.client}</td>
                    <td className="px-6 py-4">
                      <Badge className={`text-[10px] font-medium ${
                        c.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                        c.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {c.platforms.map(p => (
                          <div key={p} title={p} className="flex items-center justify-center">
                            {PLATFORM_ICONS[p]}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="text-right px-6 py-4 font-mono font-bold text-foreground">
                      {(c.totalViews / 1000000).toFixed(1)}M
                    </td>
                    <td className="text-right px-6 py-4 font-mono text-foreground">
                      {c.avgEngagementRate}%
                    </td>
                    {!presentationMode && (
                      <td className="text-right px-6 py-4 font-mono text-foreground">
                        ${(c.budget / 1000).toFixed(0)}K
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <Link href={`/campaign/${c.id}`}>
                        <ChevronRight size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </AppShell>
  )
}
