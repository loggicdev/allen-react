"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import { getUserProfileClient, getSessionClient } from "@/lib/auth" // Use client-side auth functions
import { signOut } from "@/app/auth-actions" // Import server action for signOut
import type { Database } from "@/lib/database.types"

type UserProfile = Database["public"]["Tables"]["users"]["Row"]

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  isConfigured: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return

    let isCancelled = false

    const initializeAuth = async () => {
      try {
        const isConfigured = isSupabaseConfigured()
        
        if (isCancelled) return
        setConfigured(isConfigured)

        if (!isConfigured) {
          console.warn("Supabase is not configured. Please add your environment variables.")
          if (!isCancelled) {
            setLoading(false)
            setInitialized(true)
          }
          return
        }

        const supabase = getSupabaseClient()

        // Get initial session
        const { user: initialUser } = await getSessionClient()
        
        if (isCancelled) return
        setUser(initialUser)
        
        if (initialUser) {
          console.log("🔍 Fetching profile for user:", initialUser.id, initialUser.email)
          try {
            const userProfile = await getUserProfileClient(initialUser.id)
            console.log("✅ User profile fetched:", userProfile)
            if (!isCancelled) {
              setProfile(userProfile as UserProfile)
            }
          } catch (error) {
            console.error("❌ Error fetching user profile:", error)
            if (!isCancelled) {
              setProfile(null)
            }
          }
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (isCancelled) return
          
          setUser(session?.user ?? null)
          console.log("👤 Auth state changed. User:", session?.user?.email, "ID:", session?.user?.id)
          if (session?.user) {
            try {
              const userProfile = await getUserProfileClient(session.user.id)
              console.log("✅ Profile loaded on auth change:", userProfile)
              if (!isCancelled) {
                setProfile(userProfile as UserProfile)
              }
            } catch (error) {
              console.error("❌ Error fetching user profile on auth change:", error)
              if (!isCancelled) {
                setProfile(null)
              }
            }
          } else {
            console.log("🚪 User signed out")
            if (!isCancelled) {
              setProfile(null)
            }
          }
        })

        if (!isCancelled) {
          setLoading(false)
          setInitialized(true)
        }

        return () => {
          isCancelled = true
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (!isCancelled) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    const cleanup = initializeAuth()
    
    return () => {
      isCancelled = true
      cleanup?.then(cleanupFn => {
        if (cleanupFn && typeof cleanupFn === 'function') {
          cleanupFn()
        }
      })
    }
  }, [])

  const handleSignOut = async () => {
    if (!configured) return

    try {
      await signOut() // Call the server action for sign out
      // After server action, client-side auth state will update via onAuthStateChange
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
        isConfigured: configured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
