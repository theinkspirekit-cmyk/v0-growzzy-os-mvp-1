"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f5f3]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#f97316] animate-spin" />
          <p className="text-[#37322f]/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#f97316]">GROWZZY OS</h1>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/auth" })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-4">Welcome, {session.user?.name || session.user?.email}!</h2>
          <p className="text-gray-600 mb-8">
            You are now logged in to GROWZZY OS. Connect your marketing platforms and start generating reports.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Connect Platforms</h3>
              <p className="text-gray-600">Link your Meta, Google, TikTok, and LinkedIn accounts</p>
            </div>
            <div className="border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">View Campaigns</h3>
              <p className="text-gray-600">See all your campaigns and performance metrics</p>
            </div>
            <div className="border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Generate Reports</h3>
              <p className="text-gray-600">Create advanced analytics reports with AI insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
