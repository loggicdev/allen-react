import { createClient } from "@supabase/supabase-js"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Debug logs
console.log("🔍 Supabase Debug Info:")
console.log("URL:", supabaseUrl ? "✅ Present" : "❌ Missing")
console.log("Key:", supabaseAnonKey ? "✅ Present" : "❌ Missing")
console.log("Environment:", process.env.NODE_ENV)

// Validate environment variables
if (!supabaseUrl) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Create client only if we have valid credentials
let supabaseClient: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    console.log("✅ Supabase client created successfully")
  } catch (error) {
    console.error("❌ Error creating Supabase client:", error)
  }
} else {
  console.warn("⚠️ Supabase not configured, using fallback mode")
}

export const supabase = supabaseClient

// Singleton pattern for client-side Supabase client
let clientInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase configuration is missing. Using fallback mode.")
    throw new Error("Supabase configuration is missing. Please check your environment variables.")
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey)
      console.log("✅ Supabase singleton client created")
    } catch (error) {
      console.error("❌ Error creating Supabase singleton client:", error)
      throw error
    }
  }
  return clientInstance
}

// Helper function to check if Supabase is configured
let configLoggedOnce = false
export const isSupabaseConfigured = () => {
  const configured = !!(supabaseUrl && supabaseAnonKey)
  // Only log once per session
  if (!configLoggedOnce) {
    console.log("🔧 Supabase configured:", configured)
    console.log("🔧 supabaseUrl:", supabaseUrl ? "✅ Present" : "❌ Missing", supabaseUrl?.slice(0, 30) + "...")
    console.log("🔧 supabaseAnonKey:", supabaseAnonKey ? "✅ Present" : "❌ Missing", supabaseAnonKey?.slice(0, 30) + "...")
    configLoggedOnce = true
  }
  return configured
}

// Helper function to check if Supabase admin is configured
export const isSupabaseAdminConfigured = () => {
  const configured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log("🔧 Supabase admin configured:", configured)
  return configured
}
