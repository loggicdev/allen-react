"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { signInClient } from "@/lib/auth"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signInClient(email, password)
      // Supabase auth state change will be handled by AuthProvider
      // Redirect will happen automatically via auth guard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign in error:", error)
      setError(error.message || "An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-black mb-2">Welcome Back!</CardTitle>
        <CardDescription className="text-gray-600">Sign in to continue your fitness journey.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-black text-black placeholder:text-gray-400 py-3"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-black text-black placeholder:text-gray-400 py-3"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 text-base shadow-lg transition-all duration-200 hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 space-y-2">
          <Link href="/auth/forgot-password" className="underline hover:text-black">
            Forgot your password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link href="/onboarding" className="underline hover:text-black">
              Start Onboarding
            </Link>
          </p>
          <p>
            Didn't receive confirmation email?{" "}
            <Link href="/auth/resend-confirmation" className="underline hover:text-black">
              Resend it
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
