'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, RefreshCw } from 'lucide-react'

export default function ConnectionsPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts/list')
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('[v0] Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: string) => {
    try {
      const response = await fetch('/api/accounts/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      })
      const data = await response.json()
      window.location.href = data.authUrl
    } catch (error) {
      console.error('[v0] Error connecting account:', error)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    try {
      await fetch(`/api/accounts/list?id=${accountId}`, { method: 'DELETE' })
      fetchAccounts()
    } catch (error) {
      console.error('[v0] Error disconnecting account:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connected Accounts</h1>
        <p className="text-slate-500 mt-2">Manage your ad platform connections</p>
      </div>

      {/* Connected Accounts */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Connected Platforms</h3>
        <div className="space-y-2">
          {accounts.map((account: any) => (
            <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{account.account_name}</p>
                <p className="text-sm text-slate-500">{account.platform.toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Active</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisconnect(account.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Available Connections */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Connect New Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['meta', 'google', 'tiktok'].map((platform) => (
            <Button
              key={platform}
              variant="outline"
              onClick={() => handleConnect(platform)}
              className="h-auto py-4"
            >
              <div className="text-center">
                <p className="font-medium capitalize">{platform} Ads</p>
                <p className="text-sm text-slate-500">Click to connect</p>
              </div>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
