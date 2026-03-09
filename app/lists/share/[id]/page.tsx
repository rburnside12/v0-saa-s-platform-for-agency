'use client'

import { use } from 'react'
import { MOCK_INFLUENCERS, MOCK_LISTS } from '@/lib/mock-data'
import {
  ExternalLink,
  Users,
  TrendingUp,
  BarChart3,
  Eye,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'bg-red-500/15 text-red-600 border-red-500/20',
  TikTok: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/20',
  Twitch: 'bg-purple-500/15 text-purple-600 border-purple-500/20',
  Instagram: 'bg-pink-500/15 text-pink-600 border-pink-500/20',
  X: 'bg-slate-500/15 text-slate-600 border-slate-500/20',
}

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${PLATFORM_COLORS[platform] ?? 'bg-gray-100 text-gray-600'}`}>
      {platform}
    </span>
  )
}

function MetricCell({ value }: { value: number }) {
  if (!value) return <span className="text-gray-300">—</span>
  const formatted = value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toLocaleString()
  return <span className="font-mono tabular-nums">{formatted}</span>
}

export default function PublicSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const list = MOCK_LISTS.find(l => l.id === id)
  
  // In a real app, we'd fetch the influencers for this specific list
  const influencers = MOCK_INFLUENCERS.map(i => ({
    ...i,
    anticipatedViews: i.anticipatedViews || 0,
  }))

  const totalCreators = influencers.length
  const totalAnticipatedViews = influencers.reduce((a, i) => a + (i.anticipatedViews || 0), 0)
  const avgER = influencers.reduce((a, i) => a + i.er, 0) / influencers.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="#7C3AED" className="w-7 h-7">
                <polygon points="12,2 20,8 20,20 12,14 4,20 4,8" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Powered by</p>
              <p className="text-sm font-semibold text-gray-900">Trace</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Eye size={12} />
            <span>Client View</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* List Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{list?.name || 'Creator Prospecting List'}</h1>
              <p className="text-sm text-gray-500 mt-1">{list?.description || 'Curated influencer recommendations'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Last updated</span>
              <span className="text-xs font-medium text-gray-600">{list?.lastUpdated ? new Date(list.lastUpdated).toLocaleDateString() : 'Recently'}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Creators', value: totalCreators.toString(), icon: Users, color: 'text-violet-600 bg-violet-100' },
            { label: 'Anticipated Reach', value: `${(totalAnticipatedViews / 1000000).toFixed(1)}M views`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-100' },
            { label: 'Avg. Engagement', value: `${avgER.toFixed(1)}%`, icon: BarChart3, color: 'text-blue-600 bg-blue-100' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color.split(' ')[1])}>
                  <Icon size={18} className={color.split(' ')[0]} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platforms Represented */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-3">Platforms Represented</p>
          <div className="flex gap-2">
            {list?.platforms?.map(p => (
              <PlatformBadge key={p} platform={p} />
            )) || ['YouTube', 'TikTok', 'Twitch'].map(p => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>
        </div>

        {/* Creator Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recommended Creators</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-gray-500 font-medium px-6 py-3">Creator</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3">Platform</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3">Tags</th>
                  <th className="text-right text-gray-500 font-medium px-4 py-3">Subscribers</th>
                  <th className="text-right text-gray-500 font-medium px-4 py-3">30D Avg Views</th>
                  <th className="text-right text-gray-500 font-medium px-4 py-3">ER%</th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {influencers.map(inf => (
                  <tr key={inf.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                          <span className="text-violet-600 text-[10px] font-bold">{inf.avatar}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{inf.handle}</div>
                          <div className="text-gray-400 text-[10px]">{inf.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <PlatformBadge platform={inf.platform} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {inf.tags.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-700">
                      <MetricCell value={inf.subscribers} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      {inf.platform === 'Twitch' ? (
                        <span className="text-purple-600 font-mono tabular-nums">
                          <MetricCell value={(inf as typeof inf & { twitch?: { avgCCV?: number } }).twitch?.avgCCV ?? 0} /> CCV
                        </span>
                      ) : (
                        <span className="text-gray-700"><MetricCell value={inf.avg30d} /></span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={cn("font-mono tabular-nums", inf.er > 5 ? 'text-emerald-600' : 'text-gray-700')}>
                        {inf.er}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <a 
                        href={inf.mainLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-gray-400 hover:text-violet-600 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs text-gray-400">
            This list was prepared by Cherry Pick Talent using Trace Analytics
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
            <CheckCircle size={12} className="text-emerald-500" />
            <span>All data verified as of {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
