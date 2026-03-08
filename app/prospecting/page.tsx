'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_INFLUENCERS } from '@/lib/mock-data'
import {
  Plus,
  Search,
  Link2,
  FileSpreadsheet,
  Share2,
  Trash2,
  CheckCircle,
  ExternalLink,
  Users,
  TrendingUp,
  MoreHorizontal,
  Copy,
  Check,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Influencer = typeof MOCK_INFLUENCERS[0] & {
  anticipatedSpend: number
  anticipatedViews: number
  excludeOutlier: boolean
}

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'bg-red-500/15 text-red-400 border-red-500/20',
  TikTok: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Twitch: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  X: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
}

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${PLATFORM_COLORS[platform] ?? 'bg-secondary text-muted-foreground'}`}>
      {platform}
    </span>
  )
}

function MetricCell({ value }: { value: number }) {
  if (!value) return <span className="text-muted-foreground/40">—</span>
  const formatted = value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toLocaleString()
  return <span className="font-mono tabular-nums">{formatted}</span>
}

export default function ProspectingPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>(
    MOCK_INFLUENCERS.map(i => ({ 
      ...i, 
      anticipatedSpend: i.anticipatedSpend, 
      anticipatedViews: i.anticipatedViews,
      excludeOutlier: false,
    }))
  )
  const [linkInput, setLinkInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')
  const [listName] = useState('Epic Games Q2 Prospects')

  const filtered = influencers.filter(i =>
    i.handle.toLowerCase().includes(search.toLowerCase()) ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  // Filter out outliers when calculating totals
  const nonOutlierInfluencers = influencers.filter(i => !i.excludeOutlier)

  async function handleAddLink() {
    if (!linkInput.trim()) return
    setAdding(true)
    await new Promise(r => setTimeout(r, 900))
    const newInfluencer: Influencer = {
      id: String(Date.now()),
      handle: '@NewCreator',
      name: 'Extracted Creator',
      avatar: 'NC',
      platform: 'YouTube',
      mainLink: linkInput,
      subscribers: 1200000,
      avg30d: 480000,
      anticipatedSpend: 0,
      anticipatedViews: 0,
      tags: ['Gaming'],
      er: 3.2,
      excludeOutlier: false,
    }
    setInfluencers(prev => [...prev, newInfluencer])
    setLinkInput('')
    setAdding(false)
  }

  function updateInfluencer(id: string, field: string, value: string | number | boolean) {
    setInfluencers(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  function removeInfluencer(id: string) {
    setInfluencers(prev => prev.filter(i => i.id !== id))
  }

  const totalSpend = nonOutlierInfluencers.reduce((a, i) => a + i.anticipatedSpend, 0)
  const totalViews = nonOutlierInfluencers.reduce((a, i) => a + i.anticipatedViews, 0)
  const estimatedCPM = totalViews > 0 ? ((totalSpend / totalViews) * 1000).toFixed(2) : '—'
  const outlierCount = influencers.filter(i => i.excludeOutlier).length

  function handleCopyLink() {
    navigator.clipboard.writeText('https://app.cherrypicktalent.com/lists/share/abc123xyz')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppShell>
      <TooltipProvider delayDuration={200}>
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-foreground">{listName}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Influencer prospecting list · {influencers.length} creators</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-border gap-1.5"
              >
                <FileSpreadsheet size={12} /> Export to Sheets
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs bg-primary text-primary-foreground gap-1.5"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 size={12} /> Generate Client Link
              </Button>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Creators', value: nonOutlierInfluencers.length.toString(), icon: Users },
              { label: 'Anticipated Spend', value: `$${(totalSpend / 1000).toFixed(0)}K`, icon: TrendingUp },
              { label: 'Est. CPM', value: `$${estimatedCPM}`, icon: TrendingUp },
              { label: 'Excluded Outliers', value: outlierCount.toString(), icon: Info },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-primary" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">{label}</div>
                  <div className="text-sm font-semibold font-mono tabular-nums text-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add link input */}
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Link2 size={14} className="text-primary shrink-0" />
            <Input
              placeholder="Paste social media profile link (YouTube, TikTok, Twitch, Instagram, X...)"
              value={linkInput}
              onChange={e => setLinkInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddLink()}
              className="flex-1 h-8 text-xs bg-secondary border-border"
            />
            <Button
              size="sm"
              onClick={handleAddLink}
              disabled={!linkInput.trim() || adding}
              className="h-8 text-xs bg-primary text-primary-foreground gap-1.5 shrink-0"
            >
              {adding ? (
                <><span className="animate-spin text-sm">◌</span> Extracting...</>
              ) : (
                <><Plus size={12} /> Add Creator</>
              )}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search creators, tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-7 pl-8 text-xs bg-secondary border-border w-52"
              />
            </div>
            <span className="text-xs text-muted-foreground">{filtered.length} results</span>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Creator</th>
                    <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Platform</th>
                    <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Tags</th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Subscribers</th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-2.5">30D Avg Views</th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-2.5">ER%</th>
                    <th className="text-center text-muted-foreground font-medium px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        Excl. Outlier
                        <Tooltip>
                          <TooltipTrigger><Info size={10} /></TooltipTrigger>
                          <TooltipContent className="text-xs bg-card border-border max-w-56">
                            Outliers = creators with views {'>'} 2.5x the median of their last 10 posts. Excluding them gives more conservative projections.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Ant. Spend</th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Ant. Views</th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Est. CPM</th>
                    <th className="w-8 px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inf => {
                    const estCPM = inf.anticipatedViews > 0
                      ? ((inf.anticipatedSpend / inf.anticipatedViews) * 1000).toFixed(2)
                      : null

                    return (
                      <tr 
                        key={inf.id} 
                        className={`border-b border-border/50 hover:bg-secondary/30 transition-colors group ${inf.excludeOutlier ? 'opacity-50' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <span className="text-primary text-[10px] font-bold">{inf.avatar}</span>
                            </div>
                            <div>
                              <div className="text-foreground font-medium">{inf.handle}</div>
                              <div className="text-muted-foreground text-[10px]">{inf.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <PlatformBadge platform={inf.platform} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {inf.tags.map(t => (
                              <span key={t} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">
                          <MetricCell value={inf.subscribers} />
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">
                          {inf.platform === 'Twitch' ? (
                            <div className="text-right">
                              <div className="text-purple-400"><MetricCell value={inf.twitch?.avgCCV ?? 0} /> CCV</div>
                            </div>
                          ) : (
                            <MetricCell value={inf.avg30d} />
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-mono tabular-nums ${inf.er > 5 ? 'text-emerald-400' : 'text-foreground'}`}>{inf.er}%</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex">
                                <Switch
                                  checked={inf.excludeOutlier}
                                  onCheckedChange={v => updateInfluencer(inf.id, 'excludeOutlier', v)}
                                  className="scale-75 data-[state=checked]:bg-yellow-500"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs bg-card border-border max-w-48">
                              {inf.excludeOutlier 
                                ? 'This creator is excluded from totals' 
                                : 'Toggle to exclude this creator from calculations'}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="relative inline-block">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[11px]">$</span>
                            <Input
                              value={inf.anticipatedSpend > 0 ? inf.anticipatedSpend.toLocaleString() : ''}
                              onChange={e => updateInfluencer(inf.id, 'anticipatedSpend', Number(e.target.value.replace(/,/g, '')))}
                              placeholder="0"
                              className="h-6 pl-5 text-[11px] bg-secondary border-border font-mono w-24 text-right"
                              disabled={inf.excludeOutlier}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="relative inline-block">
                            <Input
                              value={inf.anticipatedViews > 0 ? inf.anticipatedViews.toLocaleString() : ''}
                              onChange={e => updateInfluencer(inf.id, 'anticipatedViews', Number(e.target.value.replace(/,/g, '')))}
                              placeholder="0"
                              className="h-6 text-[11px] bg-secondary border-border font-mono w-28 text-right"
                              disabled={inf.excludeOutlier}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">
                          {estCPM ? <span className="text-foreground">${estCPM}</span> : <span className="text-muted-foreground/40">—</span>}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={inf.mainLink} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                  <ExternalLink size={12} />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent className="text-xs bg-card border-border">Open profile</TooltipContent>
                            </Tooltip>
                            <button onClick={() => removeInfluencer(inf.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Share Link Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm text-foreground">
                  <Share2 size={16} className="text-primary" />
                  Client-Facing Influencer List
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  This link shows a clean, public view of this influencer list. Internal pricing and agency data are automatically stripped.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="bg-secondary rounded p-3 text-xs font-mono text-muted-foreground break-all">
                  https://app.cherrypicktalent.com/lists/share/abc123xyz
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs bg-primary text-primary-foreground gap-1.5"
                    onClick={handleCopyLink}
                  >
                    {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs border-border gap-1.5">
                    <ExternalLink size={12} /> Preview
                  </Button>
                </div>
                <div className="border border-border/50 rounded p-3 space-y-1.5 text-xs">
                  <div className="text-muted-foreground font-medium">Included in client view:</div>
                  {[
                    'Creator handles & profiles',
                    '30-day average viewership',
                    'Engagement rates',
                    'Platform & audience tags',
                    'Anticipated performance (if set)',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle size={10} className="text-emerald-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                  <div className="text-muted-foreground font-medium mt-2 pt-2 border-t border-border/50">Hidden from client view:</div>
                  {['Anticipated spend / budget', 'Internal agency notes', 'CPM calculations'].map(item => (
                    <div key={item} className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TooltipProvider>
    </AppShell>
  )
}
