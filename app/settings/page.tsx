'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Key, LogOut } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const [copied, setCopied] = useState(false)
  const apiKey = 'vantage_sk_1234567890abcdefghijklmnop'

  function copyToClipboard() {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppShell>
      <div className="p-6 space-y-8 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and API keys</p>
        </div>

        {/* Profile Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Full Name</label>
              <Input
                type="text"
                placeholder="Robert Miller"
                className="bg-secondary border-border h-9 text-sm"
                defaultValue="Robert Miller"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Email</label>
              <Input
                type="email"
                placeholder="robert@cherrypicktalent.com"
                className="bg-secondary border-border h-9 text-sm"
                defaultValue="robert@cherrypicktalent.com"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Agency Name</label>
              <Input
                type="text"
                placeholder="Cherry Pick Talent"
                className="bg-secondary border-border h-9 text-sm"
                defaultValue="Cherry Pick Talent"
              />
            </div>

            <div className="pt-2">
              <Button size="sm" className="bg-primary text-primary-foreground h-8 text-xs">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">API Keys</h2>
            <p className="text-xs text-muted-foreground mb-4">Use API keys to access Vantage programmatically.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-secondary/50 border border-border rounded-lg p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Key size={16} className="text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Production Key</div>
                  <div className="font-mono text-xs text-foreground truncate mt-0.5">
                    {apiKey}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border h-7 text-xs gap-1.5 flex-shrink-0"
                onClick={copyToClipboard}
              >
                <Copy size={12} />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-primary/10 border border-primary/20 rounded-lg p-3">
              Keep your API key secret. Do not share it publicly or commit it to version control.
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="border-border h-8 text-xs">
              Generate New Key
            </Button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Current Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-secondary border-border h-9 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-secondary border-border h-9 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-secondary border-border h-9 text-sm"
              />
            </div>

            <div className="pt-2">
              <Button size="sm" className="bg-primary text-primary-foreground h-8 text-xs">
                Update Password
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-destructive-foreground mb-1">Sign Out</h2>
            <p className="text-xs text-muted-foreground">Sign out of your Vantage account on this device.</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-destructive/20 text-destructive-foreground h-8 text-xs gap-1.5"
          >
            <LogOut size={12} />
            Sign Out
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
