'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_DELIVERABLES, MOCK_CAMPAIGN_ANALYTICS, MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { cn } from '@/lib/utils'
import {
  Download,
  MessageSquare,
  Filter,
  Plus,
  ChevronRight,
  ChevronDown,
  Lock,
  Settings,
  X,
  RefreshCw,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  YouTube: <svg className="w-4 h-4 fill-red-600" viewBox="0 0 24 24"><path d="M19.615 3.712c-1.899-.596-7.615-.596-9.514-.596s-7.615 0-9.514.596C.051 4.934.051 8.806.051 12s0 7.066.752 8.288c1.899.596 7.615.596 9.514.596s7.615 0 9.514-.596c.701-1.222.752-5.094.752-8.288 0-3.194 0-7.066-.752-8.288zM9.046 15.13V8.87c3.505.987 3.505 3.077 3.505 3.077 0 3.077 0 3.077-3.505 3.183z"/></svg>,
  Twitch: <svg className="w-4 h-4 fill-purple-600" viewBox="0 0 24 24"><path d="M11 2H2v20h7v-5h4l4-4v-11h-6zm6 10l-3 3h-4v-3h7z"/></svg>,
  TikTok: <svg className="w-4 h-4 fill-black dark:fill-white" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.92-2.46v3.6a6.63 6.63 0 1 0 9.69 5.63V9.01a8.35 8.35 0 0 0 4.84-2.65z"/></svg>,
  Instagram: <svg className="w-4 h-4 fill-pink-600" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>,
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === params.id) || MOCK_CAMPAIGNS[0]
  const [activeTab, setActiveTab] = useState('overview')
  const [showNewDeliverableDialog, setShowNewDeliverableDialog] = useState(false)
  const [showImportUrlsDialog, setShowImportUrlsDialog] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    views: true,
    likes: false,
    comments: false,
    shares: false,
    engagements: true,
    engagementRate: false,
    internalCost: true,
    clientCost: true,
    profitMargin: true,
    internalCpm: false,
    externalCpm: true,
  })

  const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  const chartData = [
    { date: '03.01', YouTube: 1200000, Twitch: 600000, TikTok: 300000, Instagram: 150000 },
    { date: '03.07', YouTube: 1400000, Twitch: 700000, TikTok: 350000, Instagram: 175000 },
    { date: '03.13', YouTube: 1680000, Twitch: 840000, TikTok: 420000, Instagram: 210000 },
    { date: '03.19', YouTube: 1920000, Twitch: 960000, TikTok: 480000, Instagram: 240000 },
  ]

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="p-6 space-y-6 overflow-auto flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Campaign Reports</span>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="font-semibold text-foreground">Q1 Gaming Push</span>
          </div>

          {/* Title & Progress */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Q1 Gaming Push</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                </div>
                <span className="text-xs text-muted-foreground">7/7 deliverables completed</span>
              </div>
            </div>
            {/* Action Bar */}
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-border">
                <RefreshCw size={13} /> Refresh Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowImportUrlsDialog(true)}
                className="h-8 gap-1.5 text-xs border-border"
              >
                <Upload size={13} /> Import URLs
              </Button>
              <Button size="sm" onClick={() => setShowNewDeliverableDialog(true)} className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs font-medium px-3">
                <Plus size={13} /> New Deliverable
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                'pb-3 text-xs font-semibold border-b-2 transition-colors',
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={cn(
                'pb-3 text-xs font-semibold border-b-2 transition-colors',
                activeTab === 'analytics'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              Analytics
            </button>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI ROW — 5 Cards */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Views</p>
                  <p className="text-2xl font-bold text-foreground font-mono">2,781,450</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Engagements</p>
                  <p className="text-2xl font-bold text-foreground font-mono">158,900</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Pieces of Content</p>
                  <p className="text-2xl font-bold text-foreground font-mono">24</p>
                </div>

                <div className={cn("bg-card border border-border rounded-xl p-5", presentationMode && "opacity-40")}>
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Client Cost</p>
                  <p className="text-2xl font-bold text-foreground font-mono">{presentationMode ? '••••••' : '$128,450'}</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground font-medium mb-2">External CPM</p>
                  <p className="text-2xl font-bold text-foreground font-mono">$46.18</p>
                </div>
              </div>

              {/* Vertical padding spacer (24px) */}
              <div className="h-6" />

              {/* DELIVERABLES TABLE — Full Width */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                  <h3 className="text-sm font-semibold text-foreground">Deliverables</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs px-2">
                        <Settings size={12} /> Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase">Performance</div>
                      <DropdownMenuCheckboxItem checked={visibleColumns.views} onCheckedChange={() => toggleColumnVisibility('views')}>Views</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.likes} onCheckedChange={() => toggleColumnVisibility('likes')}>Likes</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.comments} onCheckedChange={() => toggleColumnVisibility('comments')}>Comments</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.shares} onCheckedChange={() => toggleColumnVisibility('shares')}>Shares</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.engagements} onCheckedChange={() => toggleColumnVisibility('engagements')}>Engagements</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.engagementRate} onCheckedChange={() => toggleColumnVisibility('engagementRate')}>Engagement Rate (ER%)</DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase">Financials</div>
                      <DropdownMenuCheckboxItem checked={visibleColumns.internalCost} onCheckedChange={() => toggleColumnVisibility('internalCost')}>Internal Cost</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.clientCost} onCheckedChange={() => toggleColumnVisibility('clientCost')}>Client Cost</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.profitMargin} onCheckedChange={() => toggleColumnVisibility('profitMargin')}>Profit Margin</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.internalCpm} onCheckedChange={() => toggleColumnVisibility('internalCpm')}>Internal CPM</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={visibleColumns.externalCpm} onCheckedChange={() => toggleColumnVisibility('externalCpm')}>External CPM</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 bg-secondary/30">
                        <th className="text-center px-4 py-3 text-muted-foreground font-medium text-xs">Platform</th>
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Creator</th>
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Type</th>
                        {visibleColumns.views && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">Views</th>}
                        {visibleColumns.likes && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">Likes</th>}
                        {visibleColumns.comments && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">Comments</th>}
                        {visibleColumns.shares && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">Shares</th>}
                        {visibleColumns.engagements && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">Engagements</th>}
                        {visibleColumns.engagementRate && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">ER%</th>}
                        {visibleColumns.internalCost && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">{presentationMode ? <Lock size={10} /> : 'Int. Cost'}</th>}
                        {visibleColumns.clientCost && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">{presentationMode ? <Lock size={10} /> : 'Client Cost'}</th>}
                        {visibleColumns.profitMargin && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">{presentationMode ? <Lock size={10} /> : 'Profit'}</th>}
                        {visibleColumns.internalCpm && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">{presentationMode ? <Lock size={10} /> : 'Int. CPM'}</th>}
                        {visibleColumns.externalCpm && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">Ext. CPM</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DELIVERABLES.slice(0, 7).map((d, idx) => {
                        const views = d.youtube?.avg30dLong || d.tiktok?.views || 250000 + idx * 50000
                        const likes = Math.floor(views * 0.042)
                        const comments = Math.floor(views * 0.008)
                        const shares = Math.floor(views * 0.004)
                        const engagements = likes + comments + shares
                        const engagementRate = ((engagements / views) * 100).toFixed(2)
                        const internalCost = d.internalPrice
                        const clientCost = d.clientPrice
                        const profit = clientCost - internalCost
                        const internalCpm = ((internalCost / views) * 1000).toFixed(2)
                        const externalCpm = ((clientCost / views) * 1000).toFixed(2)

                        return (
                          <tr key={idx} className="border-b border-border/50 hover:bg-secondary/40 transition-colors text-xs">
                            <td className="text-center px-4 py-3">
                              {PLATFORM_ICONS[d.creator.platform] || PLATFORM_ICONS.YouTube}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                                  <span className="text-primary text-[8px] font-bold">{d.creator.avatar}</span>
                                </div>
                                <p className="font-medium text-foreground truncate">{d.creator.handle.replace('@', '')}</p>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-muted-foreground">{d.contentType}</td>
                            {visibleColumns.views && <td className="text-right px-4 py-3 font-mono font-bold text-foreground">{views.toLocaleString()}</td>}
                            {visibleColumns.likes && <td className="text-right px-4 py-3 font-mono text-foreground">{likes.toLocaleString()}</td>}
                            {visibleColumns.comments && <td className="text-right px-4 py-3 font-mono text-foreground">{comments.toLocaleString()}</td>}
                            {visibleColumns.shares && <td className="text-right px-4 py-3 font-mono text-foreground">{shares.toLocaleString()}</td>}
                            {visibleColumns.engagements && <td className="text-right px-4 py-3 font-mono font-bold text-foreground">{engagements.toLocaleString()}</td>}
                            {visibleColumns.engagementRate && <td className="text-right px-4 py-3 font-mono text-foreground">{engagementRate}%</td>}
                            {visibleColumns.internalCost && (
                              <td className="text-right px-4 py-3 font-mono text-foreground">
                                {presentationMode ? <span className="text-muted-foreground blur-sm select-none">$••••</span> : `$${internalCost.toLocaleString()}`}
                              </td>
                            )}
                            {visibleColumns.clientCost && (
                              <td className="text-right px-4 py-3 font-mono text-foreground">
                                {presentationMode ? <span className="text-muted-foreground blur-sm select-none">$••••</span> : `$${clientCost.toLocaleString()}`}
                              </td>
                            )}
                            {visibleColumns.profitMargin && (
                              <td className="text-right px-4 py-3 font-mono font-semibold text-emerald-600">
                                {presentationMode ? <span className="text-muted-foreground blur-sm select-none">$••••</span> : `$${profit.toLocaleString()}`}
                              </td>
                            )}
                            {visibleColumns.internalCpm && (
                              <td className="text-right px-4 py-3 font-mono text-foreground">
                                {presentationMode ? <span className="text-muted-foreground blur-sm select-none">$••</span> : `$${internalCpm}`}
                              </td>
                            )}
                            {visibleColumns.externalCpm && <td className="text-right px-4 py-3 font-mono text-foreground">${externalCpm}</td>}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Performance Over Time Chart */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-5">Performance Over Time</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                      labelStyle={{ color: '#1F2937', fontSize: '11px' }}
                      formatter={(value) => `${(value as number / 1000000).toFixed(1)}M`}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="YouTube" fill="#FF0000" stackId="platform" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Twitch" fill="#9146FF" stackId="platform" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="TikTok" fill="#000000" stackId="platform" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Instagram" fill="#E1306C" stackId="platform" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* View Growth Velocity */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-5">View Growth Velocity</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Daily Average Growth</span>
                    <span className="text-sm font-bold text-foreground">+234,500 views/day</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-lg bg-secondary/40">
                      <p className="text-xs text-muted-foreground mb-1">Peak Day</p>
                      <p className="text-lg font-bold text-foreground">+456,200</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/40">
                      <p className="text-xs text-muted-foreground mb-1">Slowest Day</p>
                      <p className="text-lg font-bold text-foreground">+89,300</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/40">
                      <p className="text-xs text-muted-foreground mb-1">Volatility</p>
                      <p className="text-lg font-bold text-foreground">±18.2%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Deliverable Dialog */}
      <Dialog open={showNewDeliverableDialog} onOpenChange={setShowNewDeliverableDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Deliverable</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new deliverable for this campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Deliverable Type</label>
              <Select>
                <SelectTrigger className="bg-secondary/60 border-border text-xs">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="dedicated-video">Dedicated Video</SelectItem>
                  <SelectItem value="youtube-short">YouTube Short</SelectItem>
                  <SelectItem value="sponsorship">Sponsorship</SelectItem>
                  <SelectItem value="stream">Stream/Live Event</SelectItem>
                  <SelectItem value="collab">Collaboration</SelectItem>
                  <SelectItem value="review">Product Review</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">URL</label>
              <Input
                placeholder="https://youtube.com/watch?v=..."
                className="bg-secondary/60 border-border text-xs placeholder:text-muted-foreground/60"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Creator Name</label>
              <Input
                placeholder="Enter creator name"
                className="bg-secondary/60 border-border text-xs placeholder:text-muted-foreground/60"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Platform</label>
              <Select>
                <SelectTrigger className="bg-secondary/60 border-border text-xs">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitch">Twitch</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">Internal Cost</label>
                <Input
                  type="number"
                  placeholder="$0.00"
                  className="bg-secondary/60 border-border text-xs placeholder:text-muted-foreground/60"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">External Cost</label>
                <Input
                  type="number"
                  placeholder="$0.00"
                  className="bg-secondary/60 border-border text-xs placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowNewDeliverableDialog(false)} className="border-border text-xs h-8">
              Cancel
            </Button>
            <Button onClick={() => setShowNewDeliverableDialog(false)} className="bg-primary text-primary-foreground text-xs h-8">
              Add Deliverable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import URLs Dialog */}
      <Dialog open={showImportUrlsDialog} onOpenChange={setShowImportUrlsDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Import URLs</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Paste multiple URLs (one per line) to bulk import deliverables.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Textarea
              placeholder="https://youtube.com/watch?v=...&#10;https://tiktok.com/@creator/video/...&#10;https://twitch.tv/..."
              className="bg-secondary/60 border-border text-xs placeholder:text-muted-foreground/60 min-h-32"
            />
            <p className="text-[10px] text-muted-foreground">
              Supported: YouTube, TikTok, Twitch, Instagram links. Creator names will be extracted automatically when possible.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowImportUrlsDialog(false)} className="border-border text-xs h-8">
              Cancel
            </Button>
            <Button onClick={() => setShowImportUrlsDialog(false)} className="bg-primary text-primary-foreground text-xs h-8">
              Import URLs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
