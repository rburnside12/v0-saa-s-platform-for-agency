'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { useUserRole } from '@/contexts/user-role'
import { usePresentationMode } from '@/contexts/presentation-mode'
import { MOCK_CAMPAIGNS } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'

export default function ClientsPage() {
  const { role } = useUserRole()
  const { presentationMode } = usePresentationMode()
  const [search, setSearch] = useState('')

  // Derive clients from campaigns
  const clients = Array.from(new Set(MOCK_CAMPAIGNS.map(c => c.client))).map(clientName => {
    const campaigns = MOCK_CAMPAIGNS.filter(c => c.client === clientName)
    return {
      name: clientName,
      campaigns: campaigns.length,
      totalSpend: campaigns.reduce((a, c) => a + c.spent, 0),
      totalViews: campaigns.reduce((a, c) => a + c.totalViews, 0),
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    }
  })

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const showFinancial = role === 'super_admin' && !presentationMode

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clients</h1>
            <p className="text-sm text-muted-foreground mt-1">{clients.length} clients</p>
          </div>
          <Button className="bg-primary text-primary-foreground h-8 text-xs gap-1">
            <Plus size={12} /> Add Client
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-2.5 top-2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-secondary border-border"
          />
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(client => {
            const slug = client.name.toLowerCase().replace(/\s+/g, '-')
            return (
              <Link key={client.name} href={`/clients/${slug}`}>
                <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors cursor-pointer h-full">
                  {/* Logo Placeholder */}
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-primary font-bold text-sm">
                      {client.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Client Name */}
                  <h3 className="text-base font-semibold text-foreground mb-2">{client.name}</h3>

                  {/* Industry Tag */}
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 mb-3">
                    {['Gaming', 'Lifestyle', 'Tech'][Math.floor(Math.random() * 3)]}
                  </Badge>

                  {/* Stats */}
                  <div className="space-y-1 mb-3 text-[10px] text-muted-foreground font-mono">
                    <div>{client.campaigns} campaigns</div>
                    <div>{(client.totalViews / 1000000).toFixed(1)}M views</div>
                    {showFinancial && <div>${(client.totalSpend / 1000).toFixed(0)}K spent</div>}
                  </div>

                  {/* Status */}
                  {client.activeCampaigns > 0 ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">No active campaigns</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
