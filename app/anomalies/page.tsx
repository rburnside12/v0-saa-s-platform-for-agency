'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, AlertCircle } from 'lucide-react'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'

const ANOMALY_TYPES: Record<string, string> = {
  'Viral Spike': 'bg-emerald-500/15 text-emerald-400',
  'Underperformance': 'bg-red-500/15 text-red-400',
  'Engagement Anomaly': 'bg-amber-500/15 text-amber-400',
}

const MOCK_ANOMALIES = [
  { id: 1, creator: '@SypherPK', campaign: 'epic-games-q1', platform: 'YouTube', date: '2025-03-08', views: 8400000, avgViews: 2800000, variance: 200, type: 'Viral Spike' },
  { id: 2, creator: '@Clix', campaign: 'epic-games-q1', platform: 'TikTok', date: '2025-03-07', views: 1200000, avgViews: 8400000, variance: -86, type: 'Underperformance' },
  { id: 3, creator: '@Pokimane', campaign: 'nike-spring', platform: 'Twitch', date: '2025-03-06', views: 45000, avgViews: 18000, variance: 150, type: 'Viral Spike' },
  { id: 4, creator: '@Valkyrae', campaign: 'nike-spring', platform: 'YouTube', date: '2025-03-05', views: 3200000, avgViews: 1200000, variance: 167, type: 'Viral Spike' },
  { id: 5, creator: '@TenZ', campaign: 'riot-games-val', platform: 'YouTube', date: '2025-03-04', views: 580000, avgViews: 1500000, variance: -61, type: 'Underperformance' },
  { id: 6, creator: '@Shroud', campaign: 'riot-games-val', platform: 'Twitch', date: '2025-03-03', views: 72000, avgViews: 42000, variance: 71, type: 'Engagement Anomaly' },
  { id: 7, creator: '@NightOwlGG', campaign: 'epic-games-q1', platform: 'YouTube', date: '2025-03-02', views: 1200000, avgViews: 420000, variance: 186, type: 'Viral Spike' },
  { id: 8, creator: '@PixelKingdom', campaign: 'nike-spring', platform: 'TikTok', date: '2025-03-01', views: 480000, avgViews: 2100000, variance: -77, type: 'Underperformance' },
]

export default function AnomaliesPage() {
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('month')

  const filteredAnomalies = MOCK_ANOMALIES.filter(a => {
    if (campaignFilter !== 'all' && a.campaign !== campaignFilter) return false
    if (platformFilter !== 'all' && a.platform !== platformFilter) return false
    return true
  })

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Anomalies</h1>
          <p className="text-sm text-muted-foreground mt-1">Posts flagged as statistical outliers across active campaigns</p>
        </div>

        {/* Info Callout */}
        <div className="bg-amber-950/20 border-l-4 border-amber-500 rounded-lg p-4 flex gap-3">
          <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-400 mb-1">Outlier Detection</p>
            <p className="text-xs text-amber-400/80">
              Outliers are posts exceeding 3× the creator's 30-day rolling average. Excluding them gives cleaner benchmarks.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="h-8 w-40 text-xs border-border bg-background">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {MOCK_CAMPAIGNS.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="h-8 w-40 text-xs border-border bg-background">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Twitch">Twitch</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="h-8 w-40 text-xs border-border bg-background">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Creator</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Campaign</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Platform</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Post Date</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Post Views</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Creator Avg</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Variance</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnomalies.map(anomaly => (
                <tr key={anomaly.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{anomaly.creator}</td>
                  <td className="px-4 py-3 text-muted-foreground text-[11px]">
                    {MOCK_CAMPAIGNS.find(c => c.id === anomaly.campaign)?.name.split(' —')[0]}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px]">{anomaly.platform}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(anomaly.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                    {anomaly.views >= 1000000 ? `${(anomaly.views / 1000000).toFixed(1)}M` : `${(anomaly.views / 1000).toFixed(0)}K`}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    {anomaly.avgViews >= 1000000 ? `${(anomaly.avgViews / 1000000).toFixed(1)}M` : `${(anomaly.avgViews / 1000).toFixed(0)}K`}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp size={12} className={anomaly.variance > 0 ? 'text-emerald-400' : 'text-red-400'} />
                      <span className={`font-mono font-semibold ${anomaly.variance > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {anomaly.variance > 0 ? '+' : ''}{anomaly.variance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`text-[10px] ${ANOMALY_TYPES[anomaly.type]}`}>
                      {anomaly.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="outline" size="sm" className="h-7 text-xs border-border">
                      Exclude
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}
