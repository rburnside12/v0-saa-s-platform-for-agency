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
  ChevronUp,
  Lock,
  Settings,
  X,
  RefreshCw,
  Upload,
  FileSpreadsheet,
  FileText,
  Calendar,
  ArrowUpDown,
  Pencil,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import Link from 'next/link'

// Real social media brand icons
const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  YouTube: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Twitch: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#9146FF" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  ),
  TikTok: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  Instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80"/>
          <stop offset="25%" stopColor="#FCAF45"/>
          <stop offset="50%" stopColor="#F77737"/>
          <stop offset="75%" stopColor="#F56040"/>
          <stop offset="100%" stopColor="#C13584"/>
        </linearGradient>
      </defs>
      <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  X: (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { presentationMode } = usePresentationMode()
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === params.id) || MOCK_CAMPAIGNS[0]
  const [activeTab, setActiveTab] = useState('overview')
  const [showNewDeliverableDialog, setShowNewDeliverableDialog] = useState(false)
  const [showImportUrlsDialog, setShowImportUrlsDialog] = useState(false)
  const [showEditCampaignDialog, setShowEditCampaignDialog] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [dateRange, setDateRange] = useState('all')
  const [deliverableFilter, setDeliverableFilter] = useState('all')
  const [visibleColumns, setVisibleColumns] = useState({
    datePosted: true,
    views: true,
    likes: false,
    comments: false,
    shares: false,
    engagements: true,
    engagementRate: false,
    vodViews: false,
    avgCcv: false,
    maxCcv: false,
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
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

  const chartData = [
    { date: '03.01', YouTube: 1200000, Twitch: 600000, TikTok: 300000, Instagram: 150000 },
    { date: '03.07', YouTube: 1400000, Twitch: 700000, TikTok: 350000, Instagram: 175000 },
    { date: '03.13', YouTube: 1680000, Twitch: 840000, TikTok: 420000, Instagram: 210000 },
    { date: '03.19', YouTube: 1920000, Twitch: 960000, TikTok: 480000, Instagram: 240000 },
  ]

  // Pie chart data for Analytics
  const topCreatorsData = [
    { name: 'MrBeast', value: 892000, color: '#7C3AED' },
    { name: 'Pokimane', value: 654000, color: '#9146FF' },
    { name: 'Ninja', value: 521000, color: '#10B981' },
    { name: 'xQc', value: 412000, color: '#F59E0B' },
    { name: 'Others', value: 302450, color: '#6B7280' },
  ]

  const viewsBreakdownData = [
    { name: 'YouTube', value: 1450000, color: '#FF0000' },
    { name: 'Twitch', value: 680000, color: '#9146FF' },
    { name: 'TikTok', value: 451450, color: '#000000' },
    { name: 'Instagram', value: 200000, color: '#E1306C' },
  ]

  const costBreakdownData = [
    { name: 'YouTube', value: 52000, color: '#FF0000' },
    { name: 'Twitch', value: 38000, color: '#9146FF' },
    { name: 'TikTok', value: 24450, color: '#000000' },
    { name: 'Instagram', value: 14000, color: '#E1306C' },
  ]

  const topPostsData = [
    { name: 'MrBeast - Dedicated', value: 456000, color: '#7C3AED' },
    { name: 'Pokimane - Stream', value: 324000, color: '#9146FF' },
    { name: 'Ninja - Short', value: 287000, color: '#10B981' },
    { name: 'xQc - Sponsor', value: 198000, color: '#F59E0B' },
    { name: 'Others', value: 516450, color: '#6B7280' },
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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Q1 Gaming Push</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowEditCampaignDialog(true)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Pencil size={13} />
                </Button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '87.5%' }} />
                </div>
                <span className="text-xs text-muted-foreground">35/40 deliverables completed</span>
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
                  <p className="text-xs text-muted-foreground font-medium mb-2">Engagement Rate</p>
                  <p className="text-2xl font-bold text-foreground font-mono">5.71%</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Content Deliverables</p>
                  <p className="text-2xl font-bold text-foreground font-mono">35/40</p>
                  <div className="w-full h-1 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '87.5%' }} />
                  </div>
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
                {/* Unified Toolbar */}
                <div className="px-6 py-4 border-b border-border/50">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-foreground shrink-0">Deliverables</h3>
                    
                    {/* All controls in a single row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Date Range Selector */}
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="h-7 w-36 text-xs border-border bg-background">
                          <Calendar size={12} className="mr-1.5 shrink-0" />
                          <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="7d">Last 7 Days</SelectItem>
                          <SelectItem value="30d">Last 30 Days</SelectItem>
                          <SelectItem value="90d">Last 90 Days</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Deliverable Type Filter */}
                      <Select value={deliverableFilter} onValueChange={setDeliverableFilter}>
                        <SelectTrigger className="h-7 w-40 text-xs border-border bg-background">
                          <SelectValue placeholder="All Deliverables" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Deliverables</SelectItem>
                          <SelectItem value="dedicated">Dedicated Videos</SelectItem>
                          <SelectItem value="short">YouTube Shorts</SelectItem>
                          <SelectItem value="sponsorship">Sponsorships</SelectItem>
                          <SelectItem value="stream">Livestreams</SelectItem>
                          <SelectItem value="collab">Collaborations</SelectItem>
                          <SelectItem value="review">Product Reviews</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="w-px h-5 bg-border" />

                      {/* Columns Popover */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs px-2.5 border-border">
                            <Settings size={12} /> Columns
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-3">
                          <div className="space-y-3">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">General</p>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-xs cursor-pointer">
                                <Checkbox checked={visibleColumns.datePosted} onCheckedChange={() => toggleColumnVisibility('datePosted')} />
                                Date Posted
                              </label>
                            </div>
                            <div className="border-t border-border pt-3">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Performance</p>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.views} onCheckedChange={() => toggleColumnVisibility('views')} />
                                  Views
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.likes} onCheckedChange={() => toggleColumnVisibility('likes')} />
                                  Likes
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.comments} onCheckedChange={() => toggleColumnVisibility('comments')} />
                                  Comments
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.shares} onCheckedChange={() => toggleColumnVisibility('shares')} />
                                  Shares
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.engagements} onCheckedChange={() => toggleColumnVisibility('engagements')} />
                                  Engagements
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.engagementRate} onCheckedChange={() => toggleColumnVisibility('engagementRate')} />
                                  Engagement Rate (ER%)
                                </label>
                              </div>
                            </div>
                            <div className="border-t border-border pt-3">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Livestream</p>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.vodViews} onCheckedChange={() => toggleColumnVisibility('vodViews')} />
                                  VOD Views
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.avgCcv} onCheckedChange={() => toggleColumnVisibility('avgCcv')} />
                                  Average CCV
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.maxCcv} onCheckedChange={() => toggleColumnVisibility('maxCcv')} />
                                  Max CCV
                                </label>
                              </div>
                            </div>
                            <div className="border-t border-border pt-3">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Financials</p>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.internalCost} onCheckedChange={() => toggleColumnVisibility('internalCost')} />
                                  Internal Cost
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.clientCost} onCheckedChange={() => toggleColumnVisibility('clientCost')} />
                                  Client Cost
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.profitMargin} onCheckedChange={() => toggleColumnVisibility('profitMargin')} />
                                  Profit Margin
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.internalCpm} onCheckedChange={() => toggleColumnVisibility('internalCpm')} />
                                  Internal CPM
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox checked={visibleColumns.externalCpm} onCheckedChange={() => toggleColumnVisibility('externalCpm')} />
                                  External CPM
                                </label>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Export Button */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs px-2.5 border-border">
                            <Download size={12} /> Export <ChevronDown size={10} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
                            <FileSpreadsheet size={12} /> Google Sheets
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
                            <FileText size={12} /> CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
                            <FileText size={12} /> PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 bg-secondary/30">
                        <th className="text-center px-4 py-3 text-muted-foreground font-medium text-xs">Platform</th>
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">
                          <SortableHeader column="creator" label="Creator" />
                        </th>
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">
                          <SortableHeader column="type" label="Type" />
                        </th>
                        {visibleColumns.datePosted && <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="datePosted" label="Date Posted" /></th>}
                        {visibleColumns.views && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="views" label="Views" /></th>}
                        {visibleColumns.likes && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="likes" label="Likes" /></th>}
                        {visibleColumns.comments && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="comments" label="Comments" /></th>}
                        {visibleColumns.shares && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="shares" label="Shares" /></th>}
                        {visibleColumns.engagements && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="engagements" label="Engagements" /></th>}
                        {visibleColumns.engagementRate && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="engagementRate" label="ER%" /></th>}
                        {visibleColumns.vodViews && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="vodViews" label="VOD Views" /></th>}
                        {visibleColumns.avgCcv && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="avgCcv" label="Avg CCV" /></th>}
                        {visibleColumns.maxCcv && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="maxCcv" label="Max CCV" /></th>}
                        {visibleColumns.internalCost && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">{presentationMode ? <Lock size={10} /> : <SortableHeader column="internalCost" label="Int. Cost" />}</th>}
                        {visibleColumns.clientCost && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">{presentationMode ? <Lock size={10} /> : <SortableHeader column="clientCost" label="Client Cost" />}</th>}
                        {visibleColumns.profitMargin && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">{presentationMode ? <Lock size={10} /> : <SortableHeader column="profitMargin" label="Profit" />}</th>}
                        {visibleColumns.internalCpm && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs">{presentationMode ? <Lock size={10} /> : <SortableHeader column="internalCpm" label="Int. CPM" />}</th>}
                        {visibleColumns.externalCpm && <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs"><SortableHeader column="externalCpm" label="Ext. CPM" /></th>}
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
                        // Livestream metrics (simulated for streams)
                        const isLivestream = d.contentType === 'Stream' || d.creator.platform === 'Twitch'
                        const vodViews = isLivestream ? Math.floor(views * 0.35) : null
                        const avgCcv = isLivestream ? Math.floor(12000 + idx * 3500) : null
                        const maxCcv = isLivestream ? Math.floor((avgCcv || 0) * 1.8) : null
                        // Simulated date posted (within last 30 days)
                        const datePosted = new Date(Date.now() - (idx * 4 + 2) * 24 * 60 * 60 * 1000)
                        const formattedDate = datePosted.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

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
                            {visibleColumns.datePosted && <td className="text-left px-4 py-3 text-muted-foreground">{formattedDate}</td>}
                            {visibleColumns.views && <td className="text-right px-4 py-3 font-mono font-bold text-foreground">{views.toLocaleString()}</td>}
                            {visibleColumns.likes && <td className="text-right px-4 py-3 font-mono text-foreground">{likes.toLocaleString()}</td>}
                            {visibleColumns.comments && <td className="text-right px-4 py-3 font-mono text-foreground">{comments.toLocaleString()}</td>}
                            {visibleColumns.shares && <td className="text-right px-4 py-3 font-mono text-foreground">{shares.toLocaleString()}</td>}
                            {visibleColumns.engagements && <td className="text-right px-4 py-3 font-mono font-bold text-foreground">{engagements.toLocaleString()}</td>}
                            {visibleColumns.engagementRate && <td className="text-right px-4 py-3 font-mono text-foreground">{engagementRate}%</td>}
                            {visibleColumns.vodViews && <td className="text-right px-4 py-3 font-mono text-foreground">{vodViews ? vodViews.toLocaleString() : '—'}</td>}
                            {visibleColumns.avgCcv && <td className="text-right px-4 py-3 font-mono text-foreground">{avgCcv ? avgCcv.toLocaleString() : '—'}</td>}
                            {visibleColumns.maxCcv && <td className="text-right px-4 py-3 font-mono text-foreground">{maxCcv ? maxCcv.toLocaleString() : '—'}</td>}
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
                <ResponsiveContainer width="100%" height={300}>
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

              {/* Pie Charts Grid - 2x2 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Top Creators */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Top Creators</h2>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie
                          data={topCreatorsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {topCreatorsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${(value as number / 1000).toFixed(0)}K views`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {topCreatorsData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-foreground">{item.name}</span>
                          </div>
                          <span className="font-mono text-muted-foreground">{(item.value / 1000).toFixed(0)}K</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Views Breakdown */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Views Breakdown</h2>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie
                          data={viewsBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {viewsBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${(value as number / 1000000).toFixed(2)}M views`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {viewsBreakdownData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-foreground">{item.name}</span>
                          </div>
                          <span className="font-mono text-muted-foreground">{(item.value / 1000000).toFixed(2)}M</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Performing Posts */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Top Performing Posts</h2>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie
                          data={topPostsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {topPostsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${(value as number / 1000).toFixed(0)}K views`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {topPostsData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-foreground truncate max-w-24">{item.name}</span>
                          </div>
                          <span className="font-mono text-muted-foreground">{(item.value / 1000).toFixed(0)}K</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cost / CPM Breakdown */}
                <div className={cn("bg-card border border-border rounded-xl p-5", presentationMode && "opacity-40")}>
                  <h2 className="text-sm font-semibold text-foreground mb-4">Cost Breakdown by Platform</h2>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => presentationMode ? '••••' : `$${(value as number).toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {costBreakdownData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-foreground">{item.name}</span>
                          </div>
                          <span className="font-mono text-muted-foreground">
                            {presentationMode ? '••••' : `$${(item.value / 1000).toFixed(0)}K`}
                          </span>
                        </div>
                      ))}
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

      {/* Edit Campaign Dialog */}
      <Dialog open={showEditCampaignDialog} onOpenChange={setShowEditCampaignDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Campaign</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Update campaign details and settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Campaign Name</label>
              <Input
                defaultValue="Q1 Gaming Push"
                className="bg-secondary/60 border-border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Client</label>
              <Input
                defaultValue="Epic Games"
                className="bg-secondary/60 border-border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">Total Deliverables</label>
                <Input
                  type="number"
                  defaultValue={40}
                  className="bg-secondary/60 border-border text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">Target Budget</label>
                <Input
                  type="number"
                  defaultValue={150000}
                  className="bg-secondary/60 border-border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Campaign Status</label>
              <Select defaultValue="active">
                <SelectTrigger className="bg-secondary/60 border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Notes</label>
              <Textarea
                placeholder="Add campaign notes..."
                className="bg-secondary/60 border-border text-xs placeholder:text-muted-foreground/60 min-h-20"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditCampaignDialog(false)} className="border-border text-xs h-8">
              Cancel
            </Button>
            <Button onClick={() => setShowEditCampaignDialog(false)} className="bg-primary text-primary-foreground text-xs h-8">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
