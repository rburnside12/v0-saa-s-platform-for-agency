'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Plus,
  Plug,
  CheckCircle2,
  Circle,
  Send,
  Trash2,
} from 'lucide-react'
import { useTheme } from '@/contexts/theme'
import { cn } from '@/lib/utils'

const INTEGRATIONS = [
  { name: 'TikTok API', connected: false, icon: '🎵' },
  { name: 'YouTube Data API', connected: false, icon: '▶️' },
  { name: 'Instagram Graph API', connected: false, icon: '📷' },
  { name: 'Twitch API', connected: false, icon: '🎮' },
  { name: 'Apify Scraper', connected: true, icon: '🔧' },
  { name: 'Slack', connected: false, icon: '💬' },
  { name: 'Google Sheets', connected: true, icon: '📊' },
  { name: 'Canva', connected: false, icon: '🎨' },
]

const TEAM_MEMBERS = [
  { id: 1, name: 'Robert Burnside', email: 'robert@cherrypicktalent.com', role: 'Super Admin', lastActive: '2 mins ago', roleColor: 'bg-primary/15 text-primary' },
  { id: 2, name: 'Sarah Kim', email: 'sarah@cherrypicktalent.com', role: 'Campaign Manager', lastActive: '1 hour ago', roleColor: 'bg-blue-500/15 text-blue-400' },
  { id: 3, name: 'Jessica Taylor', email: 'jessica@cherrypicktalent.com', role: 'Campaign Manager', lastActive: 'Yesterday', roleColor: 'bg-blue-500/15 text-blue-400' },
  { id: 4, name: 'Marcus Webb', email: 'marcus@cherrypicktalent.com', role: 'Account Executive', lastActive: '2 days ago', roleColor: 'bg-emerald-500/15 text-emerald-400' },
  { id: 5, name: 'Priya Patel', email: 'priya@cherrypicktalent.com', role: 'Coordinator', lastActive: '1 week ago', roleColor: 'bg-secondary text-muted-foreground' },
]

const NOTIFICATIONS = [
  { id: 1, label: 'Content approval requests', description: 'Get notified when new content is submitted for review', enabled: true },
  { id: 2, label: 'Overdue payments', description: 'Alert when a payment passes its due date', enabled: true },
  { id: 3, label: 'Campaign status changes', description: 'Notify when a campaign moves to a new phase', enabled: true },
  { id: 4, label: 'Weekly performance summary', description: 'Receive a weekly digest every Monday morning', enabled: false },
  { id: 5, label: 'Anomaly alerts', description: 'Real-time alerts when statistical outliers are detected', enabled: true },
  { id: 6, label: 'New team member joins', description: 'Notify when someone accepts a workspace invitation', enabled: false },
]

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <AppShell>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your workspace and preferences</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* TAB: General */}
          <TabsContent value="general" className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Agency Name</label>
                <Input
                  type="text"
                  defaultValue="Cherry Pick Talent"
                  className="bg-secondary border-border h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Default Currency</label>
                <Select defaultValue="usd">
                  <SelectTrigger className="bg-secondary border-border h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="gbp" className="text-xs">GBP (£)</SelectItem>
                    <SelectItem value="usd" className="text-xs">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Outlier Threshold</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Exclude posts above</span>
                  <Input
                    type="number"
                    defaultValue="3"
                    min="1"
                    max="10"
                    step="0.5"
                    className="bg-secondary border-border h-8 text-xs w-16"
                  />
                  <span className="text-xs text-muted-foreground">× creator average</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Timezone</label>
                <Select defaultValue="utc">
                  <SelectTrigger className="bg-secondary border-border h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="utc" className="text-xs">UTC</SelectItem>
                    <SelectItem value="gmt" className="text-xs">GMT</SelectItem>
                    <SelectItem value="est" className="text-xs">EST</SelectItem>
                    <SelectItem value="pst" className="text-xs">PST</SelectItem>
                    <SelectItem value="cet" className="text-xs">CET</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Theme</label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => theme === 'dark' && toggleTheme()}
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => theme === 'light' && toggleTheme()}
                  >
                    Dark
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button className="bg-primary text-primary-foreground h-8 text-xs">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* TAB: Team */}
          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-foreground">Team Members</h3>
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary text-primary-foreground h-7 text-xs gap-1">
                    <Plus size={12} /> Invite
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-sm">Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1.5">Email</label>
                      <Input placeholder="email@example.com" className="bg-secondary border-border h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1.5">Role</label>
                      <Select>
                        <SelectTrigger className="bg-secondary border-border h-8 text-xs">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="super-admin" className="text-xs">Super Admin</SelectItem>
                          <SelectItem value="manager" className="text-xs">Campaign Manager</SelectItem>
                          <SelectItem value="exec" className="text-xs">Account Executive</SelectItem>
                          <SelectItem value="coord" className="text-xs">Coordinator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground h-8 text-xs" onClick={() => setInviteOpen(false)}>
                      <Send size={12} className="mr-1" /> Send Invite
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="space-y-0">
                {TEAM_MEMBERS.map((member, i) => (
                  <div
                    key={member.id}
                    className={cn(
                      'flex items-center justify-between p-4 text-xs',
                      i < TEAM_MEMBERS.length - 1 && 'border-b border-border/50'
                    )}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{member.name}</div>
                      <div className="text-muted-foreground">{member.email}</div>
                    </div>
                    <div className={cn('px-2 py-1 rounded', member.roleColor)}>
                      {member.role}
                    </div>
                    <div className="text-muted-foreground w-24 text-right">{member.lastActive}</div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive ml-2">
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB: Integrations */}
          <TabsContent value="integrations" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {INTEGRATIONS.map((integration) => (
                <div
                  key={integration.name}
                  className={cn(
                    'bg-card border rounded-xl p-4 flex items-start gap-3',
                    integration.connected ? 'border-emerald-500/20' : 'border-border'
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg flex-shrink-0">
                    {integration.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground">{integration.name}</div>
                    <Badge
                      variant={integration.connected ? 'default' : 'secondary'}
                      className={cn(
                        'mt-2 h-5 text-[10px]',
                        integration.connected ? 'bg-emerald-500/15 text-emerald-400' : 'bg-secondary text-muted-foreground'
                      )}
                    >
                      {integration.connected ? (
                        <>
                          <CheckCircle2 size={10} className="mr-1" /> Connected
                        </>
                      ) : (
                        <>
                          <Circle size={10} className="mr-1" /> Not connected
                        </>
                      )}
                    </Badge>
                  </div>
                  <Button
                    variant={integration.connected ? 'outline' : 'outline'}
                    size="sm"
                    className="h-7 text-xs"
                  >
                    {integration.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB: Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border/50">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{notif.label}</div>
                    <div className="text-xs text-muted-foreground">{notif.description}</div>
                  </div>
                  <Switch
                    checked={notif.enabled}
                    onCheckedChange={(checked) => {
                      setNotifications(prev =>
                        prev.map(n => n.id === notif.id ? { ...n, enabled: checked } : n)
                      )
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button className="bg-primary text-primary-foreground h-8 text-xs">
                Save Preferences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
