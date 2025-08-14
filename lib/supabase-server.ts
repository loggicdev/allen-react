import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export const createServerClient = async () => {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("🔍 Server-side Supabase config:")
  console.log("URL:", supabaseUrl ? "✅ Present" : "❌ Missing")
  console.log("Key:", supabaseAnonKey ? "✅ Present" : "❌ Missing")

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing on server side")
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          return cookieStore.get(key)?.value || null
        },
        setItem: (key: string, value: string) => {
          cookieStore.set(key, value)
        },
        removeItem: (key: string) => {
          cookieStore.delete(key)
        },
      },
    },
  })
}
