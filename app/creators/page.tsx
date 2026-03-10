'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { MOCK_CREATORS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Flag,
  MessageSquare,
  Plus,
  Download,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'bg-red-500/15 text-red-400 border-red-500/20',
  TikTok: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Twitch: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  X: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  green: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Reliable' },
  yellow: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Caution' },
  red: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Risk' },
}

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${PLATFORM_COLORS[platform] ?? 'bg-secondary text-muted-foreground'}`}>
      {platform}
    </span>
  )
}

function StatusFlag({ status, note }: { status: string; note?: string }) {
  const config = STATUS_COLORS[status] || STATUS_COLORS.green
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${config.bg}`}>
            <Flag size={10} className={config.text} />
            <span className={`text-[10px] font-medium ${config.text}`}>{config.label}</span>
            {note && <MessageSquare size={9} className={`${config.text} opacity-60`} />}
          </div>
        </TooltipTrigger>
        {note && (
          <TooltipContent className="max-w-xs text-xs bg-card border-border">
            <p className="font-medium mb-1">Team Note:</p>
            <p className="text-muted-foreground">{note}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

function formatNumber(value: number) {
  if (!value) return '—'
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toLocaleString()
}

function formatCurrency(value: number) {
  if (!value) return '—'
  return `$${value.toLocaleString()}`
}

export default function CreatorLibraryPage() {
  const router = useRouter()
  const { presentationMode } = usePresentationMode()
  const [search, setSearch] = useState('')
  const [managementFilter, setManagementFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const SortableHeader = ({ column, label }: { column: string; label: string }) => (
    <button 
      onClick={() => handleSort(column)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      {sortColumn === column ? (
        sortDirection === 'desc' ? <ChevronDown size={10} /> : <ChevronUp size={10} />
      ) : (
        <ArrowUpDown size={10} className="opacity-40" />
      )}
    </button>
  )

  const filteredCreators = useMemo(() => {
    let filtered = MOCK_CREATORS.filter(creator => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch = 
          creator.handle.toLowerCase().includes(searchLower) ||
          creator.name.toLowerCase().includes(searchLower) ||
          creator.category.some(c => c.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }
      
      // Management filter
      if (managementFilter !== 'all') {
        if (managementFilter === 'managed' && creator.managementCompany === 'Unmanaged') return false
        if (managementFilter === 'unmanaged' && creator.managementCompany !== 'Unmanaged') return false
      }
      
      // Region filter
      if (regionFilter !== 'all' && creator.region !== regionFilter) return false
      
      // Platform filter
      if (platformFilter !== 'all' && creator.platform !== platformFilter) return false
      
      // Status filter
      if (statusFilter !== 'all' && creator.status !== statusFilter) return false
      
      return true
    })

    // Sort
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: string | number
        let bVal: string | number

        switch (sortColumn) {
          case 'handle':
            aVal = a.handle.toLowerCase()
            bVal = b.handle.toLowerCase()
            break
          case 'lastPaidFee':
            aVal = a.lastPaidFee
            bVal = b.lastPaidFee
            break
          case 'avgPerformance':
            aVal = a.isTwitch ? (a.avgCCV || 0) : a.avgPerformance
            bVal = b.isTwitch ? (b.avgCCV || 0) : b.avgPerformance
            break
          case 'totalFeesPaid':
            aVal = a.totalFeesPaid
            bVal = b.totalFeesPaid
            break
          default:
            return 0
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
      })
    }

    return filtered
  }, [search, managementFilter, regionFilter, platformFilter, statusFilter, sortColumn, sortDirection])

  const uniqueRegions = [...new Set(MOCK_CREATORS.map(c => c.region))]
  const uniquePlatforms = [...new Set(MOCK_CREATORS.map(c => c.platform))]

  return (
    <AppShell>
      <TooltipProvider>
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Creator Library</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filteredCreators.length} creators in your database
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                <Download size={12} /> Export
              </Button>
              <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground gap-1.5">
                <Plus size={12} /> Add Creator
              </Button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search creators, tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-secondary border-border"
              />
            </div>

            <Select value={managementFilter} onValueChange={setManagementFilter}>
              <SelectTrigger className="h-8 w-32 text-xs border-border bg-background">
                <SelectValue placeholder="Management" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="managed">Managed</SelectItem>
                <SelectItem value="unmanaged">Unmanaged</SelectItem>
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="h-8 w-28 text-xs border-border bg-background">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {uniqueRegions.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="h-8 w-28 text-xs border-border bg-background">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {uniquePlatforms.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-28 text-xs border-border bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="green">Reliable</SelectItem>
                <SelectItem value="yellow">Caution</SelectItem>
                <SelectItem value="red">Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* High-Density Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left text-muted-foreground font-medium px-4 py-2.5">
                      <SortableHeader column="handle" label="Creator" />
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Management</th>
                    <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Region</th>
                    <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Category</th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-2.5">
                      <SortableHeader column="lastPaidFee" label="Last Fee" />
                    </th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-2.5">
                      <SortableHeader column="avgPerformance" label="Avg. Performance" />
                    </th>
                    <th className="text-center text-muted-foreground font-medium px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCreators.map(creator => (
                    <tr 
                      key={creator.id}
                      onClick={() => router.push(`/creators/${creator.id}`)}
                      className="border-b border-border/50 hover:bg-secondary/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                            <span className="text-primary text-[9px] font-bold">{creator.avatar}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{creator.handle}</span>
                              <PlatformBadge platform={creator.platform} />
                            </div>
                            <span className="text-muted-foreground text-[10px]">{creator.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {creator.managementCompany}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                          {creator.region}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1 flex-wrap">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {creator.category}
                          </span>
                          {creator.niche && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground truncate max-w-[120px]">
                              {creator.niche}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                        {presentationMode ? (
                          <span className="text-muted-foreground blur-sm select-none">$••,•••</span>
                        ) : (
                          <span className="text-foreground">{formatCurrency(creator.lastPaidFee)}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                        {creator.isTwitch ? (
                          <span className="text-purple-400">{formatNumber(creator.avgCCV || 0)} CCV</span>
                        ) : (
                          <span className="text-foreground">{formatNumber(creator.avgPerformance)}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-center">
                          <StatusFlag status={creator.status} note={creator.statusNote} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCreators.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Users size={32} className="text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No creators found</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
    </AppShell>
  )
}
