'use client'

import { AppShell } from '@/components/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Building2, TrendingUp, DollarSign, Megaphone } from 'lucide-react'

const CLIENTS = [
  { name: 'Epic Games', campaigns: 2, totalSpend: 700000, status: 'active', industry: 'Gaming' },
  { name: 'Riot Games', campaigns: 1, totalSpend: 220000, status: 'active', industry: 'Gaming' },
  { name: 'Nike', campaigns: 1, totalSpend: 350000, status: 'active', industry: 'Lifestyle' },
  { name: 'AMD', campaigns: 1, totalSpend: 175000, status: 'draft', industry: 'Technology' },
]

export default function ClientsPage() {
  return (
    <AppShell>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Clients</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{CLIENTS.length} clients · Agency Portal</p>
          </div>
          <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground gap-1.5">
            <Plus size={12} /> Add Client
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLIENTS.map(client => (
            <div key={client.name} className="bg-card border border-border rounded-lg p-4 space-y-4 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Building2 size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{client.name}</div>
                    <div className="text-[10px] text-muted-foreground">{client.industry}</div>
                  </div>
                </div>
                <Badge className={`text-[10px] ${client.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'}`}>
                  {client.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Megaphone size={9} /> Campaigns</div>
                  <div className="text-sm font-mono tabular-nums font-semibold text-foreground">{client.campaigns}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1"><DollarSign size={9} /> Total Spend</div>
                  <div className="text-sm font-mono tabular-nums font-semibold text-foreground">${(client.totalSpend / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
