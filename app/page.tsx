'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AppShell } from '@/components/app-shell'
import { useUserRole } from '@/contexts/user-role'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { MOCK_CAMPAIGNS, MOCK_CREATORS, MOCK_DELIVERABLES } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Eye,
  Heart,
  TrendingUp,
  ExternalLink,
  Flame,
  Calendar,
  Gamepad2,
  Tv,
  Newspaper,
  Instagram,
} from 'lucide-react'

// Instagram-style carousel posts from Cherry Pick Talent
const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: '/images/instagram/cp-post-1.jpg',
    caption: 'Behind the scenes with @Ninja for the Fortnite campaign',
    likes: 2847,
    type: 'image',
  },
  {
    id: 2,
    image: '/images/instagram/cp-post-2.jpg',
    caption: 'Our creators killed it at TwitchCon this year',
    likes: 4123,
    type: 'image',
  },
  {
    id: 3,
    image: '/images/instagram/cp-post-3.jpg',
    caption: 'New partnership announcement coming soon...',
    likes: 1892,
    type: 'image',
  },
  {
    id: 4,
    image: '/images/instagram/cp-post-4.jpg',
    caption: 'Team Cherry Pick at the Gaming Awards',
    likes: 3567,
    type: 'image',
  },
  {
    id: 5,
    image: '/images/instagram/cp-post-5.jpg',
    caption: 'Creator spotlight: @Valkyrae',
    likes: 5234,
    type: 'image',
  },
]

// Videos gone live this week
const LIVE_THIS_WEEK = [
  {
    id: 1,
    creator: 'SypherPK',
    handle: '@SypherPK',
    title: 'Fortnite Chapter 5 Season 2 - FIRST LOOK',
    platform: 'YouTube',
    views: 2800000,
    likes: 142000,
    er: 5.4,
    thumbnail: '/images/thumbnails/sypher-fortnite.jpg',
    postedAt: '2 days ago',
    campaign: 'Fortnite Q1',
    trending: true,
  },
  {
    id: 2,
    creator: 'Ninja',
    handle: '@Ninja',
    title: '24 Hour Fortnite Stream Highlights',
    platform: 'Twitch',
    views: 1200000,
    likes: 89000,
    er: 7.4,
    thumbnail: '/images/thumbnails/ninja-stream.jpg',
    postedAt: '3 days ago',
    campaign: 'Fortnite Q1',
    trending: true,
  },
  {
    id: 3,
    creator: 'Pokimane',
    handle: '@Pokimane',
    title: 'Trying on the NEW Nike Collection',
    platform: 'YouTube',
    views: 980000,
    likes: 67000,
    er: 6.8,
    thumbnail: '/images/thumbnails/poki-nike.jpg',
    postedAt: '1 day ago',
    campaign: 'Nike Spring',
    trending: false,
  },
  {
    id: 4,
    creator: 'Shroud',
    handle: '@Shroud',
    title: 'Valorant New Agent Breakdown',
    platform: 'YouTube',
    views: 1500000,
    likes: 98000,
    er: 6.5,
    thumbnail: '/images/thumbnails/shroud-valorant.jpg',
    postedAt: '4 days ago',
    campaign: 'Valorant Act III',
    trending: true,
  },
  {
    id: 5,
    creator: 'Valkyrae',
    handle: '@Valkyrae',
    title: 'Epic Games Collab Reveal',
    platform: 'TikTok',
    views: 4200000,
    likes: 380000,
    er: 9.0,
    thumbnail: '/images/thumbnails/rae-epic.jpg',
    postedAt: '5 days ago',
    campaign: 'Fortnite Q1',
    trending: true,
  },
]

// Top performing creators this month
const TOP_CREATORS = [
  { name: 'SypherPK', handle: '@SypherPK', avatar: 'SP', views: 12400000, er: 5.8, trend: '+18%', platform: 'YouTube' },
  { name: 'Ninja', handle: '@Ninja', avatar: 'NJ', views: 8900000, er: 7.2, trend: '+24%', platform: 'Twitch' },
  { name: 'Valkyrae', handle: '@Valkyrae', avatar: 'VR', views: 7600000, er: 8.1, trend: '+31%', platform: 'YouTube' },
  { name: 'Pokimane', handle: '@Pokimane', avatar: 'PK', views: 5200000, er: 6.4, trend: '+12%', platform: 'YouTube' },
  { name: 'Shroud', handle: '@Shroud', avatar: 'SH', views: 4800000, er: 5.9, trend: '+8%', platform: 'Twitch' },
]

// Gaming & Entertainment News
const INDUSTRY_NEWS = [
  {
    id: 1,
    title: 'Epic Games Announces $2B Creator Fund for 2026',
    source: 'The Verge',
    category: 'Gaming',
    timeAgo: '2 hours ago',
    url: '#',
    icon: Gamepad2,
  },
  {
    id: 2,
    title: 'TikTok Gaming Category Surpasses 50B Views',
    source: 'TechCrunch',
    category: 'Social',
    timeAgo: '5 hours ago',
    url: '#',
    icon: Tv,
  },
  {
    id: 3,
    title: 'Twitch Updates Creator Monetization Policies',
    source: 'Polygon',
    category: 'Streaming',
    timeAgo: '8 hours ago',
    url: '#',
    icon: Tv,
  },
  {
    id: 4,
    title: 'Valorant Champions Tour 2026 Format Revealed',
    source: 'Esports Insider',
    category: 'Esports',
    timeAgo: '1 day ago',
    url: '#',
    icon: Gamepad2,
  },
  {
    id: 5,
    title: 'YouTube Shorts Overtakes Reels in Gaming Content',
    source: 'Bloomberg',
    category: 'Social',
    timeAgo: '1 day ago',
    url: '#',
    icon: Newspaper,
  },
]

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K`
  }
  return views.toString()
}

export default function HomePage() {
  const { role } = useUserRole()
  const { presentationMode } = usePresentationMode()
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCarouselIndex(Math.max(0, carouselIndex - 1))
    } else {
      setCarouselIndex(Math.min(INSTAGRAM_POSTS.length - 3, carouselIndex + 1))
    }
  }

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <AppShell>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, Robert</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here's what's happening at Cherry Pick Talent this week
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Calendar size={12} className="mr-1" />
              Week of Mar 10, 2026
            </Badge>
          </div>
        </div>

        {/* Instagram Carousel Section */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Instagram size={18} className="text-pink-500" />
              <h2 className="text-sm font-semibold text-foreground">@cherrypicktalent</h2>
              <Badge variant="secondary" className="text-[10px]">Instagram</Badge>
            </div>
            <a 
              href="https://www.instagram.com/cherrypicktalent/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View Profile <ExternalLink size={10} />
            </a>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex gap-4 transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${carouselIndex * (100 / 3 + 1.33)}%)` }}
              >
                {INSTAGRAM_POSTS.map((post) => (
                  <div 
                    key={post.id} 
                    className="flex-shrink-0 w-[calc(33.333%-11px)] aspect-square rounded-lg bg-secondary/50 overflow-hidden group cursor-pointer relative"
                  >
                    {/* Placeholder gradient background */}
                    <div className={cn(
                      "w-full h-full",
                      post.id % 3 === 0 ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20" :
                      post.id % 3 === 1 ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20" :
                      "bg-gradient-to-br from-orange-500/20 to-red-500/20"
                    )} />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center gap-4 text-white text-sm">
                        <span className="flex items-center gap-1">
                          <Heart size={16} fill="white" /> {post.likes.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white/80 text-xs px-4 text-center line-clamp-2">{post.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            {carouselIndex > 0 && (
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            {carouselIndex < INSTAGRAM_POSTS.length - 3 && (
              <button
                onClick={() => scrollCarousel('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Two Column Layout: Videos + Creators/News */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Videos Gone Live This Week (2 cols) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play size={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Live This Week</h2>
                <Badge className="bg-emerald-500/15 text-emerald-400 text-[10px]">
                  {LIVE_THIS_WEEK.length} videos
                </Badge>
              </div>
              <Link href="/campaigns">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  View All <ChevronRight size={12} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {LIVE_THIS_WEEK.slice(0, 4).map((video) => (
                <div 
                  key={video.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-secondary/50">
                    <div className={cn(
                      "w-full h-full",
                      video.id % 4 === 0 ? "bg-gradient-to-br from-red-500/30 to-orange-500/30" :
                      video.id % 4 === 1 ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30" :
                      video.id % 4 === 2 ? "bg-gradient-to-br from-blue-500/30 to-cyan-500/30" :
                      "bg-gradient-to-br from-green-500/30 to-teal-500/30"
                    )} />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                        <Play size={20} className="text-white ml-1" fill="white" />
                      </div>
                    </div>

                    {/* Trending badge */}
                    {video.trending && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-orange-500/90 text-white text-[10px] gap-1">
                          <Flame size={10} /> Trending
                        </Badge>
                      </div>
                    )}

                    {/* Platform badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-[10px] bg-black/60 text-white border-0">
                        {video.platform}
                      </Badge>
                    </div>

                    {/* Views overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                      {formatViews(video.views)} views
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-foreground line-clamp-1 mb-1">
                      {video.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[8px] font-bold text-primary">
                          {video.creator.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[11px] text-muted-foreground">{video.handle}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{video.postedAt}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart size={10} /> {formatViews(video.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={10} className="text-emerald-400" /> {video.er}% ER
                      </span>
                      <Badge variant="secondary" className="text-[9px] ml-auto">{video.campaign}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Top Creators + News */}
          <div className="space-y-6">
            {/* Top Performing Creators */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-foreground">Top Performers</h3>
              </div>

              <div className="space-y-3">
                {TOP_CREATORS.map((creator, idx) => (
                  <Link 
                    key={creator.handle} 
                    href={`/creators/${creator.handle.replace('@', '').toLowerCase()}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors -mx-2"
                  >
                    <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                      {creator.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{creator.name}</p>
                      <p className="text-[10px] text-muted-foreground">{formatViews(creator.views)} views</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-emerald-400">{creator.trend}</p>
                      <p className="text-[10px] text-muted-foreground">{creator.er}% ER</p>
                    </div>
                  </Link>
                ))}
              </div>

              <Link href="/creators">
                <Button variant="outline" size="sm" className="w-full mt-4 h-7 text-xs">
                  View All Creators
                </Button>
              </Link>
            </div>

            {/* Industry News */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper size={14} className="text-blue-400" />
                <h3 className="text-sm font-semibold text-foreground">Industry News</h3>
              </div>

              <div className="space-y-0">
                {INDUSTRY_NEWS.slice(0, 4).map((news, idx) => (
                  <a 
                    key={news.id}
                    href={news.url}
                    className={cn(
                      "block py-3 hover:bg-secondary/30 -mx-2 px-2 rounded transition-colors",
                      idx < INDUSTRY_NEWS.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <news.icon size={12} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug">
                          {news.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">{news.source}</span>
                          <span className="text-[10px] text-muted-foreground/50">•</span>
                          <span className="text-[10px] text-muted-foreground">{news.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] text-muted-foreground mb-1">Active Campaigns</p>
            <p className="text-xl font-bold font-mono">
              {MOCK_CAMPAIGNS.filter(c => c.status === 'active').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] text-muted-foreground mb-1">Videos Live This Week</p>
            <p className="text-xl font-bold font-mono">{LIVE_THIS_WEEK.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] text-muted-foreground mb-1">Total Views This Week</p>
            <p className="text-xl font-bold font-mono">
              {formatViews(LIVE_THIS_WEEK.reduce((a, v) => a + v.views, 0))}
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-[10px] text-muted-foreground mb-1">Avg Engagement Rate</p>
            <p className="text-xl font-bold font-mono text-emerald-400">
              {(LIVE_THIS_WEEK.reduce((a, v) => a + v.er, 0) / LIVE_THIS_WEEK.length).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
