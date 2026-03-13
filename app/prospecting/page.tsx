'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_INFLUENCERS, MOCK_LISTS } from '@/lib/mock-data'
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
  ArrowLeft,
  FolderOpen,
  Calendar,
  Download,
  FileText,
  Eye,
  ToggleLeft,
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Master Lists View
function MasterListsView({ onSelectList }: { onSelectList: (listId: string) => void }) {
  const [search, setSearch] = useState('')
  const [showNewListDialog, setShowNewListDialog] = useState(false)

  const filteredLists = MOCK_LISTS.filter(list =>
    list.name.toLowerCase().includes(search.toLowerCase()) ||
    list.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">List Builder</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Organize and manage your creator prospecting lists</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowNewListDialog(true)}
          className="h-7 text-xs bg-primary text-primary-foreground gap-1.5"
        >
          <Plus size={12} /> New List
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lists..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs bg-secondary border-border"
          />
        </div>
        <span className="text-xs text-muted-foreground">{filteredLists.length} lists</span>
      </div>

      {/* Lists Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLists.map(list => (
          <div
            key={list.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectList(list.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectList(list.id) }}
            className="bg-card border border-border rounded-lg p-4 text-left hover:border-primary/50 hover:bg-secondary/30 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FolderOpen size={18} className="text-primary" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border w-36">
                  <DropdownMenuItem className="text-xs gap-2">
                    <FileSpreadsheet size={11} /> Export to Sheets
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2">
                    <Share2 size={11} /> Generate Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem className="text-xs gap-2 text-destructive-foreground">
                    <Trash2 size={11} /> Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">{list.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{list.description}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users size={10} />
                {list.creatorCount} creators
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {formatDate(list.lastUpdated)}
              </span>
            </div>
            <div className="flex gap-1 mt-3">
              {list.platforms.map(p => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New List Dialog */}
      <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm text-foreground flex items-center gap-2">
              <Plus size={15} className="text-primary" />
              Create New List
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a new prospecting list to organize creators.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">List Name</label>
              <Input placeholder="e.g., Gaming Creators Q2" className="h-9 text-xs bg-secondary border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Description (optional)</label>
              <Input placeholder="Brief description of this list" className="h-9 text-xs bg-secondary border-border" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewListDialog(false)} className="border-border text-muted-foreground">
              Cancel
            </Button>
            <Button size="sm" onClick={() => setShowNewListDialog(false)} className="bg-primary text-primary-foreground">
              <CheckCircle size={12} className="mr-1.5" /> Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// List Detail View (Influencer Table)
function ListDetailView({ listId, onBack }: { listId: string; onBack: () => void }) {
  const list = MOCK_LISTS.find(l => l.id === listId)
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
  const [autoExcludeOutliers, setAutoExcludeOutliers] = useState(false)
  const [showCopyForCanva, setShowCopyForCanva] = useState(false)
  const [canvaCopied, setCanvaCopied] = useState(false)

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

  // Calculate outliers (top/bottom 5% by performance)
  const calculateOutliers = (influencers: Influencer[]) => {
    const performances = influencers.map(i => i.platform === 'Twitch' ? (i.twitch?.avgCCV ?? 0) : i.avg30d).sort((a, b) => a - b)
    const lowThreshold = performances[Math.floor(performances.length * 0.05)] || 0
    const highThreshold = performances[Math.floor(performances.length * 0.95)] || Infinity
    
    return influencers.map(i => {
      const perf = i.platform === 'Twitch' ? (i.twitch?.avgCCV ?? 0) : i.avg30d
      return perf < lowThreshold || perf > highThreshold
    })
  }

  // Auto-exclude outliers effect
  const applyAutoOutliers = () => {
    if (!autoExcludeOutliers) return
    const outlierFlags = calculateOutliers(influencers)
    setInfluencers(prev => prev.map((inf, idx) => ({
      ...inf,
      excludeOutlier: outlierFlags[idx]
    })))
  }

  const totalSpend = nonOutlierInfluencers.reduce((a, i) => a + i.anticipatedSpend, 0)
  const totalViews = nonOutlierInfluencers.reduce((a, i) => a + i.anticipatedViews, 0)
  const estimatedCPM = totalViews > 0 ? ((totalSpend / totalViews) * 1000).toFixed(2) : '—'
  const outlierCount = influencers.filter(i => i.excludeOutlier).length

  // Canva export text format
  const generateCanvaText = () => {
    let text = `${list?.name || 'Influencer List'}\n`
    text += `${list?.description || ''}\n\n`
    text += `Total Creators: ${nonOutlierInfluencers.length}\n`
    text += `Estimated CPM: $${estimatedCPM}\n\n`
    text += `CREATORS:\n`
    text += '─'.repeat(40) + '\n'
    
    nonOutlierInfluencers.forEach(inf => {
      text += `\n${inf.handle} (${inf.platform})\n`
      text += `${inf.name}\n`
      if (inf.platform === 'Twitch') {
        text += `Avg CCV: ${inf.twitch?.avgCCV?.toLocaleString() ?? 'N/A'}\n`
      } else {
        text += `30D Avg Views: ${inf.avg30d >= 1000000 ? `${(inf.avg30d / 1000000).toFixed(1)}M` : `${(inf.avg30d / 1000).toFixed(0)}K`}\n`
      }
      text += `ER: ${inf.er}%\n`
      text += `Tags: ${inf.tags.join(', ')}\n`
    })
    
    return text
  }

  const handleCopyCanva = () => {
    navigator.clipboard.writeText(generateCanvaText())
    setCanvaCopied(true)
    setTimeout(() => setCanvaCopied(false), 2000)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`https://app.cherrypicktalent.com/lists/share/${listId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} />
            </button>
            <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px]">List</Badge>
          </div>
          <h1 className="text-lg font-semibold text-foreground">{list?.name || 'Influencer List'}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{list?.description || 'Influencer prospecting list'} · {influencers.length} creators</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                <Download size={12} /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border w-56">
              <DropdownMenuItem className="text-xs gap-2">
                <FileSpreadsheet size={12} /> Export to Google Sheets
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-xs gap-2">
                <FileText size={12} /> Download Internal PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2">
                <Eye size={12} /> Download External PDF
                <span className="text-muted-foreground ml-auto text-[10px]">Pricing masked</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-xs gap-2" onClick={handleCopyCanva}>
                <Copy size={12} /> {canvaCopied ? 'Copied!' : 'Copy for Canva'}
                <span className="text-muted-foreground ml-auto text-[10px]">Text format</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <div className="grid grid-cols-5 gap-3">
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
        
        {/* Auto-Exclude Outliers Toggle */}
        <div className="bg-card border border-border rounded-lg px-4 py-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between gap-2 h-full">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Info size={13} className="text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">Auto-Exclude</div>
                    <div className="text-xs font-medium text-foreground">Top/Bottom 5%</div>
                  </div>
                </div>
                <Switch
                  checked={autoExcludeOutliers}
                  onCheckedChange={(checked) => {
                    setAutoExcludeOutliers(checked)
                    if (checked) {
                      applyAutoOutliers()
                    } else {
                      setInfluencers(prev => prev.map(inf => ({ ...inf, excludeOutlier: false })))
                    }
                  }}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-xs bg-card border-border max-w-64">
              Automatically exclude creators in the top/bottom 5% of performance to get more conservative averages.
            </TooltipContent>
          </Tooltip>
        </div>
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
              https://app.cherrypicktalent.com/lists/share/{listId}
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
  )
}

export default function ProspectingPage() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  return (
    <AppShell>
      <TooltipProvider delayDuration={200}>
        {selectedListId ? (
          <ListDetailView
            listId={selectedListId}
            onBack={() => setSelectedListId(null)}
          />
        ) : (
          <MasterListsView onSelectList={setSelectedListId} />
        )}
      </TooltipProvider>
    </AppShell>
  )
}
