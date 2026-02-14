import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { OnboardingEnforcer } from "@/components/onboarding-enforcer"

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
      <OnboardingEnforcer>
        {children}
      </OnboardingEnforcer>
    </ProtectedRoute>
  )
}
