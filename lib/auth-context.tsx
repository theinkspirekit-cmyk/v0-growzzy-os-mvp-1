"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  emailVerified: boolean
  verificationEmailSent: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationEmailSent, setVerificationEmailSent] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      if (!supabase) {
        console.error("[v0] Supabase client not initialized")
        setLoading(false)
        return
      }

      try {
        console.log("[v0] Initializing auth...")
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("[v0] Session error:", sessionError)
        }

        const currentUser = data.session?.user || null
        console.log("[v0] Current user:", currentUser?.email)
        setUser(currentUser)

        if (currentUser) {
          setEmailVerified(currentUser.email_confirmed_at !== null)
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log("[v0] Auth state changed:", _event)
          const user = session?.user || null
          setUser(user)
          if (user) {
            setEmailVerified(user.email_confirmed_at !== null)
          }
        })

        return () => subscription?.unsubscribe()
      } catch (error) {
        console.error("[v0] Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) throw new Error("Supabase client not initialized")

    try {
      console.log("[v0] Signing up user:", email)
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/verify-email`,
        },
      })

      if (error) {
        console.error("[v0] Sign up error:", error)
        throw new Error(error.message)
      }

      console.log("[v0] Sign up successful")
      if (data.user) {
        setVerificationEmailSent(true)
        try {
          const verifyResponse = await fetch("/api/auth/verify-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: data.user.id, email }),
          })

          if (verifyResponse.ok) {
            console.log("[v0] User auto-verified after signup")
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setUser(data.user)
            setEmailVerified(true)
            console.log("[v0] User set, ready for dashboard redirect")
            return
          }
        } catch (e) {
          console.log("[v0] Auto-verification failed:", e)
        }
      }
    } catch (error: any) {
      console.error("[v0] Sign up exception:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase client not initialized")

    try {
      console.log("[v0] Signing in user:", email)
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Sign in error:", error.message)
        throw new Error(
          error.message === "Invalid login credentials"
            ? "Invalid email or password. Make sure you signed up first."
            : error.message,
        )
      }

      console.log("[v0] Sign in successful")
      if (data.user) {
        setUser(data.user)
        setEmailVerified(data.user.email_confirmed_at !== null)
      }
    } catch (error: any) {
      console.error("[v0] Sign in exception:", error.message)
      throw error
    }
  }

  const signOut = async () => {
    if (!supabase) throw new Error("Supabase client not initialized")

    try {
      console.log("[v0] Signing out")
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setEmailVerified(false)
      setVerificationEmailSent(false)
      console.log("[v0] Sign out successful")
    } catch (error: any) {
      console.error("[v0] Sign out error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        emailVerified,
        verificationEmailSent,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
