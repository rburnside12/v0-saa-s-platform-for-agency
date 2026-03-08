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
  const [visibleColumns, setVisibleColumns] = useState({
    views: true,
    internalCost: true,
    externalCost: true,
    cpm: true,
    profit: true,
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

          {/* Title & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Q1 Gaming Push</h1>
            </div>
            {/* Action Bar with Ghost Buttons */}
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Download size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <MessageSquare size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Filter size={14} />
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
              {/* KPI ROW — 4 Cards (Performance Focus) */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-5 font-[family-name:var(--font-inter)]">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Views</p>
                  <p className="text-3xl font-bold text-foreground font-mono">2,781,450</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 font-[family-name:var(--font-inter)]">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Pieces of Content</p>
                  <p className="text-3xl font-bold text-foreground font-mono">24</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 font-[family-name:var(--font-inter)]">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Current CPM</p>
                  <p className="text-3xl font-bold text-foreground font-mono">$42.15</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 font-[family-name:var(--font-inter)]">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Total Engagements</p>
                  <p className="text-3xl font-bold text-foreground font-mono">158,900</p>
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
                        <Settings size={12} /> View Settings
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.views}
                        onCheckedChange={() => toggleColumnVisibility('views')}
                      >
                        Views
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.internalCost}
                        onCheckedChange={() => toggleColumnVisibility('internalCost')}
                      >
                        Internal Cost
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.externalCost}
                        onCheckedChange={() => toggleColumnVisibility('externalCost')}
                      >
                        External Cost (Client Price)
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.cpm}
                        onCheckedChange={() => toggleColumnVisibility('cpm')}
                      >
                        CPM
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.profit}
                        onCheckedChange={() => toggleColumnVisibility('profit')}
                      >
                        Profit
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 bg-secondary/30">
                        <th className="text-center px-4 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center justify-center gap-1">Platform <ChevronRight size={10} /></div>
                        </th>
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1">Creator <ChevronRight size={10} /></div>
                        </th>
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center gap-1">Type <ChevronRight size={10} /></div>
                        </th>
                        {visibleColumns.views && (
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                            <div className="flex items-center justify-end gap-1">Views <ChevronRight size={10} /></div>
                          </th>
                        )}
                        <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                          <div className="flex items-center justify-end gap-1">Engagements <ChevronRight size={10} /></div>
                        </th>
                        {visibleColumns.cpm && (
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                            <div className="flex items-center justify-end gap-1">CPM <ChevronRight size={10} /></div>
                          </th>
                        )}
                        {!presentationMode && visibleColumns.internalCost && (
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                            <div className="flex items-center justify-end gap-1">Int. Cost <ChevronRight size={10} /></div>
                          </th>
                        )}
                        {!presentationMode && visibleColumns.externalCost && (
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                            <div className="flex items-center justify-end gap-1">Ext. Cost <ChevronRight size={10} /></div>
                          </th>
                        )}
                        {!presentationMode && visibleColumns.profit && (
                          <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                            <div className="flex items-center justify-end gap-1">Profit <ChevronRight size={10} /></div>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DELIVERABLES.slice(0, 6).map((d, idx) => {
                        const views = d.youtube?.avg30dLong || d.tiktok?.views || 0
                        const engagements = Math.floor((views * 0.054))
                        const cpm = d.cpm || 42.15

                        return (
                          <tr key={idx} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                            <td className="text-center px-4 py-3">
                              {d.creator.platform === 'YouTube' && PLATFORM_ICONS.YouTube}
                              {d.creator.platform === 'Twitch' && PLATFORM_ICONS.Twitch}
                              {d.creator.platform === 'TikTok' && PLATFORM_ICONS.TikTok}
                              {d.creator.platform === 'Instagram' && PLATFORM_ICONS.Instagram}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                                  <span className="text-primary text-[8px] font-bold">{d.creator.avatar}</span>
                                </div>
                                <p className="font-medium text-foreground text-xs truncate">{d.creator.handle.replace('@', '')}</p>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">{d.contentType}</td>
                            {visibleColumns.views && (
                              <td className="text-right px-5 py-3 font-mono font-bold text-foreground">
                                {views.toLocaleString()}
                              </td>
                            )}
                            <td className="text-right px-5 py-3 font-mono font-bold text-foreground">
                              {engagements.toLocaleString()}
                            </td>
                            {visibleColumns.cpm && (
                              <td className="text-right px-5 py-3 font-mono font-bold text-foreground">
                                ${cpm.toFixed(2)}
                              </td>
                            )}
                            {!presentationMode && visibleColumns.internalCost && (
                              <td className="text-right px-5 py-3 font-mono text-foreground">
                                ${d.internalPrice.toLocaleString()}
                              </td>
                            )}
                            {!presentationMode && visibleColumns.externalCost && (
                              <td className="text-right px-5 py-3 font-mono text-foreground">
                                ${d.clientPrice.toLocaleString()}
                              </td>
                            )}
                            {!presentationMode && visibleColumns.profit && (
                              <td className="text-right px-5 py-3 font-mono font-semibold text-emerald-600">
                                ${(d.clientPrice - d.internalPrice).toLocaleString()}
                              </td>
                            )}
                            {presentationMode && (visibleColumns.internalCost || visibleColumns.externalCost || visibleColumns.profit) && (
                              <>
                                {visibleColumns.internalCost && <td className="text-right px-5 py-3"><Lock size={12} className="text-muted-foreground" /></td>}
                                {visibleColumns.externalCost && <td className="text-right px-5 py-3"><Lock size={12} className="text-muted-foreground" /></td>}
                                {visibleColumns.profit && <td className="text-right px-5 py-3"><Lock size={12} className="text-muted-foreground" /></td>}
                              </>
                            )}
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
    </AppShell>
  )
}
