
"use client"

import { useEffect, useState } from "react"
import { OnboardingModal } from "@/components/onboarding-modal"
import { toast } from "sonner"

export function OnboardingEnforcer({ children }: { children: React.ReactNode }) {
    const [checking, setChecking] = useState(true)
    const [showOnboarding, setShowOnboarding] = useState(false)

    const checkStatus = async () => {
        try {
            const res = await fetch('/api/user/onboarding-status')
            if (res.ok) {
                const data = await res.json()
                // If 0 connected platforms, show onboarding
                if (data.platformCount === 0) {
                    setShowOnboarding(true)
                } else {
                    setShowOnboarding(false)
                }
            }
        } catch (e) {
            console.error("Onboarding check failed", e)
        } finally {
            setChecking(false)
        }
    }

    useEffect(() => {
        checkStatus()
    }, [])

    if (checking) {
        // Optional: Show a full screen loader or just render children with a spinner overlay? 
        // Creating a smooth experience: Render children but maybe blur them?
        // For now, simple return children (optimistic) or null.
        // Let's return null to prevent flash of dashboard content before we know if they are onboarded.
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <>
            {showOnboarding && (
                <div className="fixed inset-0 z-[9990] bg-white/50 backdrop-blur-sm">
                    <OnboardingModal onComplete={() => {
                        setShowOnboarding(false)
                        window.location.reload() // Refresh to load "fresh" data
                    }} />
                </div>
            )}
            <div className={showOnboarding ? "blur-sm pointer-events-none select-none h-screen overflow-hidden" : ""}>
                {children}
            </div>
        </>
    )
}
