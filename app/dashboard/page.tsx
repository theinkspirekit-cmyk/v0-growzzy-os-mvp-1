'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogOut, User, Mail, Calendar, AlertCircle } from 'lucide-react'

interface UserData {
  id: string
  email: string
  name?: string
  createdAt?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real app, you would fetch this from an API endpoint
        // For now, we'll get it from localStorage (set during login)
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        } else {
          // If no user data, redirect to login
          router.push('/auth/login')
        }
      } catch (err) {
        setError('Failed to load user data')
        console.error('[v0] Error loading user:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      localStorage.removeItem('user')
      router.push('/auth/login')
    } catch (err) {
      setError('Logout failed')
      console.error('[v0] Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Growzzy OS</h1>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground">You are successfully logged in!</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="text-lg font-semibold text-foreground">{user.name || 'Not set'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-semibold text-foreground">{user.email}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="text-lg font-semibold text-foreground font-mono text-sm truncate">{user.id}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold text-foreground mb-4">Getting Started</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Authentication is now set up with Supabase
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Passwords are securely hashed with bcrypt
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Sessions are stored in secure HTTP-only cookies
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Protected routes require authentication
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
