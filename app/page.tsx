'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/app-shell'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { usePresentationMode } from '@/contexts/presentation-mode'
import {
  TrendingUp,
  DollarSign,
  Eye,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Calendar,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

type SortKey = 'client' | 'startDate' | 'endDate' | 'name'
type SortDir = 'asc' | 'desc'
type StatusFilter = 'all' | 'active' | 'completed' | 'draft'

const ALL_CLIENTS = Array.from(new Set(MOCK_CAMPAIGNS.map(c => c.client)))

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  prefix = '',
  hidden = false,
}: {
  label: string
  value: string
  change?: number
  icon: React.ElementType
  prefix?: string
  hidden?: boolean
}) {
  if (hidden) return null
  const positive = (change ?? 0) >= 0
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
          <Icon size={14} className="text-primary" />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold font-mono tabular-nums text-foreground">{prefix}{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs mt-1 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}% vs last quarter
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function OverviewPage() {
  const { presentationMode } = usePresentationMode()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [clientFilter, setClientFilter] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('startDate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter(c => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      const matchClient = !clientFilter || c.client === clientFilter
      return matchStatus && matchClient
    })
  }, [statusFilter, clientFilter])

  // Sort campaigns
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'client') {
        cmp = a.client.localeCompare(b.client)
      } else if (sortKey === 'startDate') {
        cmp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      } else if (sortKey === 'endDate') {
        cmp = new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      } else if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filteredCampaigns, sortKey, sortDir])

  // Calculate KPIs
  const activeCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'active')
  const totalClientSpend = MOCK_CAMPAIGNS.reduce((a, c) => a + c.budget, 0)
  
  // Calculate profit (budget * marginPct / 100)
  const totalProfit = MOCK_CAMPAIGNS.reduce((a, c) => a + (c.budget * c.marginPct / 100), 0)
  
  // Calculate average CPM across all campaigns
  const totalViews = MOCK_CAMPAIGNS.reduce((a, c) => a + c.totalViews, 0)
  const avgCPM = totalViews > 0 ? ((totalClientSpend / totalViews) * 1000).toFixed(2) : '0'

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Agency Overview</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Q1 2025 Performance Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs">
              <Activity size={10} className="mr-1" />
              {activeCampaigns.length} Active Campaigns
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Active Campaigns" 
            value={String(activeCampaigns.length)} 
            change={12.5} 
            icon={Megaphone} 
          />
          <StatCard 
            label="Total Client Spend" 
            value={`${(totalClientSpend / 1000).toFixed(0)}K`} 
            prefix="$" 
            change={18.4} 
            icon={DollarSign} 
          />
          <StatCard 
            label="Total Agency Profit" 
            value={`${(totalProfit / 1000).toFixed(0)}K`} 
            prefix="$" 
            change={22.1} 
            icon={TrendingUp}
            hidden={presentationMode}
          />
          <StatCard 
            label="Average CPM" 
            value={avgCPM} 
            prefix="$" 
            change={-4.2} 
            icon={Eye} 
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                <Filter size={11} />
                Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <ChevronDown size={10} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border w-32">
              {(['all', 'active', 'completed', 'draft'] as const).map(s => (
                <DropdownMenuItem
                  key={s}
                  className={`text-xs cursor-pointer ${statusFilter === s ? 'text-primary' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Client Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                <Filter size={11} />
                Client: {clientFilter || 'All'}
                <ChevronDown size={10} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border w-36">
              <DropdownMenuItem
                className={`text-xs cursor-pointer ${!clientFilter ? 'text-primary' : ''}`}
                onClick={() => setClientFilter(null)}
              >
                All Clients
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              {ALL_CLIENTS.map(c => (
                <DropdownMenuItem
                  key={c}
                  className={`text-xs cursor-pointer ${clientFilter === c ? 'text-primary' : ''}`}
                  onClick={() => setClientFilter(c)}
                >
                  {c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1.5">
                <ArrowUpDown size={11} />
                Sort: {sortKey === 'client' ? 'Client' : sortKey === 'startDate' ? 'Start Date' : sortKey === 'endDate' ? 'End Date' : 'Name'}
                <ChevronDown size={10} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border w-32">
              {[
                { key: 'client', label: 'Client' },
                { key: 'startDate', label: 'Start Date' },
                { key: 'endDate', label: 'End Date' },
                { key: 'name', label: 'Name' },
              ].map(({ key, label }) => (
                <DropdownMenuItem
                  key={key}
                  className={`text-xs cursor-pointer ${sortKey === key ? 'text-primary' : ''}`}
                  onClick={() => handleSort(key as SortKey)}
                >
                  {label} {sortKey === key && (sortDir === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-xs text-muted-foreground ml-2">
            {sortedCampaigns.length} campaign{sortedCampaigns.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Campaigns Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">Campaigns</h2>
            <Link href="/campaigns" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Campaign</th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Client</th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">Status</th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      Start
                    </div>
                  </th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      End
                    </div>
                  </th>
                  <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Views</th>
                  {!presentationMode && <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Budget</th>}
                  {!presentationMode && <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Profit</th>}
                  {!presentationMode && <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Margin</th>}
                  <th className="text-right text-muted-foreground font-medium px-4 py-2.5">ER%</th>
                </tr>
              </thead>
              <tbody>
                {sortedCampaigns.map(c => {
                  const profit = c.budget * c.marginPct / 100
                  return (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
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
                      <td className="px-4 py-3 text-muted-foreground">{c.client}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-[10px] ${
                            c.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                            c.status === 'completed' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' :
                            'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                          }`}
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono tabular-nums text-[11px]">
                        {formatDate(c.startDate)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono tabular-nums text-[11px]">
                        {formatDate(c.endDate)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                        {c.totalViews > 0 ? `${(c.totalViews / 1000000).toFixed(1)}M` : '—'}
                      </td>
                      {!presentationMode && (
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                          ${(c.budget / 1000).toFixed(0)}K
                        </td>
                      )}
                      {!presentationMode && (
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-400">
                          ${(profit / 1000).toFixed(0)}K
                        </td>
                      )}
                      {!presentationMode && (
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-400">
                          {c.marginPct}%
                        </td>
                      )}
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                        {c.avgEngagementRate > 0 ? `${c.avgEngagementRate}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
