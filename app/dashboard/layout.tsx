import type React from "react"
import { FloatingAIChat } from "@/components/floating-ai-chat"
import { ProtectedRoute } from "@/components/protected-route"

export const metadata = {
  title: "Dashboard | Growzzy OS",
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <>
        {children}
        <FloatingAIChat />
      </>
    </ProtectedRoute>
  )
}
