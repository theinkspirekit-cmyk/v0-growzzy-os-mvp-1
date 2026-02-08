"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      // For now, allow demo mode - in production, redirect to /auth
      console.log("[v0] No user, but allowing demo mode access")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f5f3]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#f97316] animate-spin" />
          <p className="text-[#37322f]/60">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
