'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Play,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Campaign Analytics',
    description: 'Real-time performance tracking across YouTube, TikTok, Twitch, and Instagram with automated reporting.',
  },
  {
    icon: Users,
    title: 'Influencer Prospecting',
    description: 'Build and vet creator lists with automated stats extraction and CPM calculations.',
  },
  {
    icon: Zap,
    title: 'Deliverable Tracking',
    description: 'Manage every piece of content with progress bars, target views, and live metrics.',
  },
  {
    icon: Shield,
    title: 'Presentation Mode',
    description: 'One-click client-safe view that hides internal pricing and agency margins instantly.',
  },
  {
    icon: TrendingUp,
    title: 'Conservative Forecasting',
    description: 'Built-in 80% multiplier for realistic performance projections clients can trust.',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'YouTube, TikTok, Twitch, Instagram, and X — all unified in a single dashboard.',
  },
]

const stats = [
  { value: '$2.4B+', label: 'Campaign spend managed' },
  { value: '12,000+', label: 'Creators tracked' },
  { value: '340+', label: 'Agency partners' },
  { value: '99.9%', label: 'Platform uptime' },
]

const testimonials = [
  {
    quote: 'CherryPick transformed how we manage influencer campaigns. The presentation mode alone saves us hours every week.',
    author: 'Sarah Chen',
    role: 'Head of Partnerships',
    company: 'Gaming Agency Co.',
  },
  {
    quote: 'Finally, a platform built by people who actually understand agency workflows. The margin tracking is a game-changer.',
    author: 'Marcus Rodriguez',
    role: 'CEO',
    company: 'Influence Labs',
  },
]

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              <Sparkles size={12} className="mr-1.5" />
              Now with AI-powered creator discovery
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Turn Data into{' '}
              <span className="text-primary">Agency ROI</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              The all-in-one platform for influencer marketing agencies. Manage campaigns, track deliverables, and close deals — all while keeping your margins private.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-8">
                  Get Started <ArrowRight size={16} />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2 text-base border-border">
                <Play size={16} /> Watch Demo
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. Free 14-day trial.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 sm:mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-8">
                  <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-sm mx-auto">
                    app.cherrypicktalent.com/campaigns
                  </div>
                </div>
              </div>
              {/* Dashboard content preview */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-32 bg-foreground/10 rounded" />
                    <div className="h-3 w-24 bg-muted-foreground/10 rounded mt-2" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-20 bg-primary/20 rounded" />
                    <div className="h-7 w-24 bg-primary rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-secondary/50 rounded-lg p-4">
                      <div className="h-3 w-20 bg-muted-foreground/10 rounded mb-2" />
                      <div className="h-5 w-16 bg-foreground/10 rounded" />
                    </div>
                  ))}
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                        <div className="flex-1 h-3 bg-foreground/10 rounded" />
                        <div className="w-16 h-3 bg-muted-foreground/10 rounded" />
                        <div className="w-12 h-3 bg-emerald-500/20 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground font-mono">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything your agency needs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Purpose-built for influencer marketing agencies who need to move fast and protect their margins.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
              <div
                key={feature.title}
                className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="customers" className="py-20 sm:py-28 bg-secondary/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Loved by agencies worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map(t => (
              <div key={t.author} className="bg-card border border-border rounded-xl p-6">
                <p className="text-foreground leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm font-bold">{t.author[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary/10 border border-primary/20 p-8 sm:p-12 text-center">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to transform your agency?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join 340+ agencies already using CherryPick to manage campaigns, track ROI, and close bigger deals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    Start Free Trial <ArrowRight size={16} />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-border">
                  Schedule a Demo
                </Button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                {['No credit card required', '14-day free trial', 'Cancel anytime'].map(item => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">CP</span>
              </div>
              <span className="font-semibold text-foreground">CherryPick Talent</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              2026 CherryPick Talent. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
