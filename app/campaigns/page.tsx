'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  Search,
  Filter,
  Plus,
  Calendar,
  ChevronDown,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  BarChart2,
  ArrowUpRight,
  MoreHorizontal,
  Tag,
  CheckSquare,
  Square,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const ALL_CLIENTS = ['Epic Games', 'Riot Games', 'Nike', 'AMD']
const ALL_TAGS = ['Q1', 'Q2', 'Gaming', 'Esports', 'Influencer', 'Launch', 'Lifestyle', 'Fashion', 'Tech', 'Hardware']

function AggregateSummary({ campaigns }: { campaigns: typeof MOCK_CAMPAIGNS }) {
  const { presentationMode } = usePresentationMode()
  const totalViews = campaigns.reduce((a, c) => a + c.totalViews, 0)
  const totalBudget = campaigns.reduce((a, c) => a + c.budget, 0)
  const totalDeliverables = campaigns.reduce((a, c) => a + c.deliverables, 0)
  const avgEr = (campaigns.reduce((a, c) => a + c.avgEngagementRate, 0) / campaigns.length).toFixed(1)
  const avgMargin = (campaigns.reduce((a, c) => a + c.marginPct, 0) / campaigns.length).toFixed(1)

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Package size={13} />
          Bundle Aggregate — {campaigns.length} Campaign{campaigns.length !== 1 ? 's' : ''} Selected
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">Total Views</div>
          <div className="font-mono tabular-nums text-sm font-semibold text-foreground">
            {(totalViews / 1000000).toFixed(1)}M
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">Deliverables</div>
          <div className="font-mono tabular-nums text-sm font-semibold text-foreground">{totalDeliverables}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">Avg. ER%</div>
          <div className="font-mono tabular-nums text-sm font-semibold text-foreground">{avgEr}%</div>
        </div>
        {!presentationMode && (
          <>
            <div>
              <div className="text-[10px] text-muted-foreground mb-0.5">Total Budget</div>
              <div className="font-mono tabular-nums text-sm font-semibold text-foreground">${(totalBudget / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground mb-0.5">Avg. Margin</div>
              <div className="font-mono tabular-nums text-sm font-semibold text-emerald-400">{avgMargin}%</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CampaignsPage() {
  const { presentationMode } = usePresentationMode()
  const [search, setSearch] = useState('')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showAggregate, setShowAggregate] = useState(false)

  const filtered = MOCK_CAMPAIGNS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase())
    const matchClient = selectedClients.length === 0 || selectedClients.includes(c.client)
    const matchTag = selectedTags.length === 0 || c.tags.some(t => selectedTags.includes(t))
    return matchSearch && matchClient && matchTag
  })

  function toggleSelect(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function toggleClient(client: string) {
    setSelectedClients(prev => prev.includes(client) ? prev.filter(x => x !== client) : [...prev, client])
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag])
  }

  const bundledCampaigns = MOCK_CAMPAIGNS.filter(c => selectedIds.includes(c.id))

  return (
    <AppShell>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Campaigns</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {MOCK_CAMPAIGNS.length} campaigns</p>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground h-8 text-xs gap-1.5">
            <Plus size={13} /> New Campaign
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-secondary border-border w-56"
            />
          </div>

          {/* Client Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs border-border bg-secondary gap-1.5">
                <Users size={12} /> Client {selectedClients.length > 0 && `(${selectedClients.length})`}
                <ChevronDown size={11} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border w-44">
              {ALL_CLIENTS.map(c => (
                <DropdownMenuItem key={c} className="text-xs gap-2 cursor-pointer" onClick={() => toggleClient(c)}>
                  {selectedClients.includes(c) ? <CheckSquare size={12} className="text-primary" /> : <Square size={12} />}
                  {c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tag Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs border-border bg-secondary gap-1.5">
                <Tag size={12} /> Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                <ChevronDown size={11} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border w-44">
              {ALL_TAGS.map(t => (
                <DropdownMenuItem key={t} className="text-xs gap-2 cursor-pointer" onClick={() => toggleTag(t)}>
                  {selectedTags.includes(t) ? <CheckSquare size={12} className="text-primary" /> : <Square size={12} />}
                  {t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active filters */}
          {(selectedClients.length > 0 || selectedTags.length > 0) && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground underline"
              onClick={() => { setSelectedClients([]); setSelectedTags([]) }}
            >
              Clear filters
            </button>
          )}

          <div className="flex-1" />

          {selectedIds.length >= 2 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-primary/40 text-primary bg-primary/10 gap-1.5"
              onClick={() => setShowAggregate(true)}
            >
              <Package size={12} /> Bundle {selectedIds.length} Campaigns
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="w-8 px-3 py-2.5"></th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Campaign</th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Client</th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Status</th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Platforms</th>
                  <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Views</th>
                  <th className="text-right text-muted-foreground font-medium px-4 py-2.5">ER%</th>
                  <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Deliverables</th>
                  {!presentationMode && <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Budget</th>}
                  {!presentationMode && <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Margin</th>}
                  <th className="w-8 px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const selected = selectedIds.includes(c.id)
                  return (
                    <tr
                      key={c.id}
                      className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${selected ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-3 py-3">
                        <button onClick={() => toggleSelect(c.id)}>
                          {selected
                            ? <CheckSquare size={13} className="text-primary" />
                            : <Square size={13} className="text-muted-foreground" />
                          }
                        </button>
                      </td>
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
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{c.client}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-[10px] ${
                          c.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                          c.status === 'completed' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' :
                          'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {c.platforms.map(p => (
                            <PlatformBadge key={p} platform={p} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground whitespace-nowrap">
                        {c.totalViews > 0 ? `${(c.totalViews / 1000000).toFixed(1)}M` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                        {c.avgEngagementRate > 0 ? `${c.avgEngagementRate}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">{c.deliverables}</td>
                      {!presentationMode && (
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground whitespace-nowrap">
                          ${(c.budget / 1000).toFixed(0)}K
                        </td>
                      )}
                      {!presentationMode && (
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-400">{c.marginPct}%</td>
                      )}
                      <td className="px-3 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal size={13} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border w-36">
                            <DropdownMenuItem className="text-xs gap-2">
                              <ArrowUpRight size={12} /> Open
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs gap-2">
                              <BarChart2 size={12} /> Analytics
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aggregate Dialog */}
        <Dialog open={showAggregate} onOpenChange={setShowAggregate}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground text-sm">
                <Package size={16} className="text-primary" />
                Campaign Bundle — Aggregate View
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Combined performance metrics across {bundledCampaigns.length} selected campaigns.
              </DialogDescription>
            </DialogHeader>
            {bundledCampaigns.length > 0 && <AggregateSummary campaigns={bundledCampaigns} />}
            <div className="space-y-1">
              {bundledCampaigns.map(c => (
                <div key={c.id} className="flex items-center justify-between text-xs py-2 border-b border-border/50">
                  <div>
                    <div className="text-foreground font-medium">{c.name}</div>
                    <div className="text-muted-foreground">{c.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono tabular-nums text-foreground">{(c.totalViews / 1000000).toFixed(1)}M views</div>
                    <div className="text-muted-foreground">{c.deliverables} deliverables</div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}

function PlatformBadge({ platform }: { platform: string }) {
  const styles: Record<string, string> = {
    YouTube: 'bg-red-500/15 text-red-400 border-red-500/20',
    TikTok: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    Twitch: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    Instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    X: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  }
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${styles[platform] ?? 'bg-secondary text-muted-foreground'}`}>
      {platform}
    </span>
  )
}

function Users({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
