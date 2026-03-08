'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    // TODO: Integrate with Supabase Auth
    setTimeout(() => {
      setLoading(false)
      // Redirect to dashboard after auth
      window.location.href = '/'
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/landing">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join Vantage and take control of your campaigns</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Agency Name</label>
            <Input
              type="text"
              placeholder="Your Agency Name"
              value={agencyName}
              onChange={e => setAgencyName(e.target.value)}
              className="bg-secondary border-border h-9 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Email</label>
            <Input
              type="email"
              placeholder="you@agency.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-secondary border-border h-9 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-secondary border-border h-9 text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">At least 8 characters</p>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="bg-secondary border-border h-9 text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !email || !password || !agencyName}
            className="w-full bg-primary text-primary-foreground h-9 text-sm gap-2"
          >
            {loading ? 'Creating account...' : 'Sign Up'} {!loading && <ArrowRight size={14} />}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-background text-muted-foreground">Already have an account?</span>
          </div>
        </div>

        {/* Sign In Link */}
        <Link href="/login">
          <Button variant="outline" className="w-full border-border h-9 text-sm">
            Sign In
          </Button>
        </Link>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>By signing up, you agree to our <Link href="#" className="text-primary hover:text-primary/80">Terms of Service</Link></p>
        </div>
      </div>
    </div>
  )
}
