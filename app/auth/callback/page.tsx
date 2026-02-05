"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the code from URL
        const code = searchParams.get("code")
        
        if (!code) {
          setStatus("error")
          setMessage("Invalid verification link. Please try signing up again.")
          return
        }

        // Exchange the code for a session
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Verification failed")
        }

        setStatus("success")
        setMessage("Your email has been verified! You can now sign in.")
        
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push("/auth")
        }, 3000)
      } catch (error: any) {
        console.error("[v0] Verification error:", error)
        setStatus("error")
        setMessage(error.message || "Verification failed. Please try again.")
      }
    }

    handleEmailVerification()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 animate-spin text-[#f97316]" />
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {status === "success" && (
            <Button asChild className="bg-[#37322f] hover:bg-[#37322f]/90">
              <Link href="/auth">Go to Sign In</Link>
            </Button>
          )}
          {status === "error" && (
            <Button asChild variant="outline">
              <Link href="/auth">Back to Sign In</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
