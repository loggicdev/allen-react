"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Target, Dumbbell, Apple, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Heart className="h-12 w-12 text-black" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            FitJourney
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
            Transform your fitness journey with personalized training plans, 
            nutrition guidance, and AI-powered coaching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 font-semibold shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Your Journey
              </Button>
            </Link>
            
            <Link href="/auth/signin">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4 font-semibold transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Everything you need to succeed
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Personalized Plans</h3>
                <p className="text-gray-400">
                  AI-powered workout and nutrition plans tailored specifically to your goals, 
                  fitness level, and preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Smart Training</h3>
                <p className="text-gray-400">
                  Progressive workouts that adapt to your progress, with detailed exercise 
                  instructions and video demonstrations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Apple className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Nutrition Guidance</h3>
                <p className="text-gray-400">
                  Custom meal plans, calorie tracking, and nutritional guidance to fuel 
                  your fitness goals effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            Join thousands who transformed their lives
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-white text-lg">Personalized workout plans</span>
            </div>
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-white text-lg">Progress tracking & analytics</span>
            </div>
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-white text-lg">24/7 AI fitness coach</span>
            </div>
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-white text-lg">Custom nutrition plans</span>
            </div>
          </div>

          <Link href="/onboarding">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 text-xl px-12 py-6 font-bold shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-black" />
          </div>
          <p className="text-gray-400 mb-4">
            © 2025 FitJourney. Your personal fitness companion.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/auth/signin" className="text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/onboarding" className="text-gray-400 hover:text-white transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
