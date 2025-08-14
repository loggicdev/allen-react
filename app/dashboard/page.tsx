"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  Dumbbell,
  Calendar,
  Camera,
  CreditCard,
  Apple,
  Play,
  TrendingUp,
  Award,
  Zap,
  Instagram,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function FitnessDashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  // All hooks must be declared before any conditional returns
  const [activeTab, setActiveTab] = useState("summary")
  const [userData, setUserData] = useState<any>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [selectedHistoryWorkout, setSelectedHistoryWorkout] = useState<any>(null)
  const [currentHistoryPage, setCurrentHistoryPage] = useState(0)
  const [showWeightUpdate, setShowWeightUpdate] = useState(false)
  const [newWeight, setNewWeight] = useState("")
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [currentWeightPage, setCurrentWeightPage] = useState(0)
  const [weightUpdates, setWeightUpdates] = useState([
    { weight: "72.5", date: "Today", change: -0.5, hasPhoto: true },
    { weight: "73.0", date: "3 days ago", change: -1.0, hasPhoto: false },
    { weight: "74.0", date: "1 week ago", change: -0.8, hasPhoto: true },
    { weight: "74.8", date: "2 weeks ago", change: -1.2, hasPhoto: false },
    { weight: "76.0", date: "3 weeks ago", change: -0.5, hasPhoto: true },
    { weight: "76.5", date: "1 month ago", change: -0.7, hasPhoto: false },
    { weight: "77.2", date: "5 weeks ago", change: -0.8, hasPhoto: true },
  ])

  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false)
  const [selectedDay, setSelectedDay] = useState("monday")
  const [selectedMeal, setSelectedMeal] = useState<any>(null)

  // Estado de carregamento para o avatar
  const [showFinalAvatar, setShowFinalAvatar] = useState(false);

  const [progressPhotos, setProgressPhotos] = useState([
    { date: "2024-01-01", weight: "74.0", image: "/placeholder.svg?height=200&width=150" },
    { date: "2024-01-15", weight: "73.2", image: "/placeholder.svg?height=200&width=150" },
    { date: "2024-02-01", weight: "72.8", image: "/placeholder.svg?height=200&width=150" },
    { date: "2024-02-15", weight: "72.4", image: "/placeholder.svg?height=200&width=150" },
  ])
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const savedData = localStorage.getItem("onboardingData")
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
  }, [])

  // Efeito para detectar quando o perfil está totalmente carregado
  useEffect(() => {
    if (profile?.name && profile.name !== "Usuário" && !loading) {
      // Pequeno delay para garantir estabilidade
      const timer = setTimeout(() => {
        setShowFinalAvatar(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowFinalAvatar(false);
    }
  }, [profile?.name, loading]);

  // Loading state: só renderiza o dashboard quando temos o perfil carregado
  if (loading || !user || !profile?.name || profile.name === "Usuário") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  // Função para gerar iniciais do usuário
  const getUserInitials = (name: string) => {
    const words = name.trim().split(" ").filter(word => word.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return "";
  };

  const userObj = {
    name: profile.name,
    initials: getUserInitials(profile.name),
    avatar: null,
    subscriptionStatus: "active",
    nextRenewal: "2024-02-15",
    goals: [
      { name: "Weight Loss", progress: 75, target: "10 lbs", current: "7.5 lbs" },
      { name: "Muscle Gain", progress: 60, target: "5 lbs", current: "3 lbs" },
      { name: "Cardio Endurance", progress: 85, target: "30 min", current: "25.5 min" },
    ],
  }

  const currentWorkout = [
    {
      name: "Push-ups",
      sets: 3,
      reps: "12-15",
      weight: "Bodyweight",
      icon: "💪",
      videoId: "IODxDxX7oi4",
    },
    {
      name: "Squats",
      sets: 4,
      reps: "10-12",
      weight: "135 lbs",
      icon: "🦵",
      videoId: "aclHkVaku9U",
    },
    {
      name: "Bench Press",
      sets: 3,
      reps: "8-10",
      weight: "185 lbs",
      icon: "🏋️",
      videoId: "rT7DgCr-3pg",
    },
  ]

  const weeklyMealPlan = {
    monday: {
      day: "Monday",
      totalCalories: 1450,
      meals: [
        {
          meal: "Breakfast",
          calories: 450,
          protein: "25g",
          carbs: "45g",
          fat: "18g",
          foods: ["2 eggs", "1 slice whole grain bread", "1/2 avocado", "1 cup coffee"],
        },
        {
          meal: "Lunch",
          calories: 520,
          protein: "35g",
          carbs: "40g",
          fat: "22g",
          foods: ["150g grilled chicken", "100g brown rice", "Mixed vegetables", "1 tbsp olive oil"],
        },
        {
          meal: "Dinner",
          calories: 480,
          protein: "30g",
          carbs: "35g",
          fat: "20g",
          foods: ["120g salmon", "150g sweet potato", "Green salad", "1 tbsp dressing"],
        },
      ],
    },
    tuesday: {
      day: "Tuesday",
      totalCalories: 1420,
      meals: [
        {
          meal: "Breakfast",
          calories: 420,
          protein: "22g",
          carbs: "48g",
          fat: "16g",
          foods: ["1 cup oatmeal", "1 banana", "1 tbsp almond butter", "1 cup green tea"],
        },
        {
          meal: "Lunch",
          calories: 540,
          protein: "38g",
          carbs: "42g",
          fat: "24g",
          foods: ["150g turkey breast", "100g quinoa", "Roasted vegetables", "1 tbsp tahini"],
        },
        {
          meal: "Dinner",
          calories: 460,
          protein: "28g",
          carbs: "38g",
          fat: "18g",
          foods: ["120g white fish", "150g roasted potatoes", "Steamed broccoli", "Lemon dressing"],
        },
      ],
    },
    wednesday: {
      day: "Wednesday",
      totalCalories: 1480,
      meals: [
        {
          meal: "Breakfast",
          calories: 480,
          protein: "28g",
          carbs: "42g",
          fat: "20g",
          foods: ["Greek yogurt", "Mixed berries", "Granola", "1 tbsp honey"],
        },
        {
          meal: "Lunch",
          calories: 500,
          protein: "32g",
          carbs: "45g",
          fat: "20g",
          foods: ["150g lean beef", "100g pasta", "Tomato sauce", "Parmesan cheese"],
        },
        {
          meal: "Dinner",
          calories: 500,
          protein: "35g",
          carbs: "30g",
          fat: "25g",
          foods: ["150g chicken thigh", "Mixed green salad", "Nuts", "Olive oil dressing"],
        },
      ],
    },
    thursday: {
      day: "Thursday",
      totalCalories: 1440,
      meals: [
        {
          meal: "Breakfast",
          calories: 440,
          protein: "24g",
          carbs: "46g",
          fat: "18g",
          foods: ["Protein smoothie", "1 banana", "Spinach", "Almond milk"],
        },
        {
          meal: "Lunch",
          calories: 520,
          protein: "36g",
          carbs: "38g",
          fat: "22g",
          foods: ["150g pork tenderloin", "100g wild rice", "Asparagus", "Herb butter"],
        },
        {
          meal: "Dinner",
          calories: 480,
          protein: "30g",
          carbs: "40g",
          fat: "18g",
          foods: ["120g cod", "150g mashed cauliflower", "Green beans", "Lemon"],
        },
      ],
    },
    friday: {
      day: "Friday",
      totalCalories: 1460,
      meals: [
        {
          meal: "Breakfast",
          calories: 460,
          protein: "26g",
          carbs: "44g",
          fat: "19g",
          foods: ["2 whole grain pancakes", "Greek yogurt", "Blueberries", "Maple syrup"],
        },
        {
          meal: "Lunch",
          calories: 510,
          protein: "34g",
          carbs: "41g",
          fat: "21g",
          foods: ["150g grilled shrimp", "100g couscous", "Mediterranean vegetables", "Feta cheese"],
        },
        {
          meal: "Dinner",
          calories: 490,
          protein: "32g",
          carbs: "36g",
          fat: "22g",
          foods: ["120g lamb", "Roasted root vegetables", "Mint sauce", "Side salad"],
        },
      ],
    },
    saturday: {
      day: "Saturday",
      totalCalories: 1500,
      meals: [
        {
          meal: "Breakfast",
          calories: 500,
          protein: "30g",
          carbs: "40g",
          fat: "22g",
          foods: ["Veggie omelet", "2 eggs", "Cheese", "Whole grain toast"],
        },
        {
          meal: "Lunch",
          calories: 530,
          protein: "38g",
          carbs: "38g",
          fat: "24g",
          foods: ["150g chicken breast", "Quinoa salad", "Avocado", "Lime dressing"],
        },
        {
          meal: "Dinner",
          calories: 470,
          protein: "28g",
          carbs: "42g",
          fat: "18g",
          foods: ["120g sea bass", "150g jasmine rice", "Stir-fried vegetables", "Ginger sauce"],
        },
      ],
    },
    sunday: {
      day: "Sunday",
      totalCalories: 1420,
      meals: [
        {
          meal: "Breakfast",
          calories: 420,
          protein: "22g",
          carbs: "48g",
          fat: "16g",
          foods: ["Chia pudding", "Coconut milk", "Fresh fruits", "Almonds"],
        },
        {
          meal: "Lunch",
          calories: 540,
          protein: "36g",
          carbs: "40g",
          fat: "24g",
          foods: ["150g turkey", "Sweet potato", "Brussels sprouts", "Cranberry sauce"],
        },
        {
          meal: "Dinner",
          calories: 460,
          protein: "30g",
          carbs: "35g",
          fat: "18g",
          foods: ["120g tuna steak", "Quinoa", "Grilled zucchini", "Herb oil"],
        },
      ],
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-black text-white"
      case "trial":
        return "bg-gray-600 text-white"
      case "blocked":
        return "bg-gray-800 text-white"
      case "paused":
        return "bg-gray-400 text-white"
      case "canceled":
        return "bg-gray-300 text-black"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-black font-bold text-lg">Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border-2 border-gray-200 shadow-sm">
            <TabsTrigger
              value="summary"
              className="text-xs font-medium data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="text-xs font-medium data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Training
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="text-xs font-medium data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="nutrition"
              className="text-xs font-medium data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Nutrition
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            {/* User Header */}
            <Card className="bg-black text-white border-2 border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gray-500 text-white font-bold text-lg border-2 border-white">
                      {showFinalAvatar ? (
                        userObj.initials
                      ) : (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        </div>
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{userObj.name}</h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getStatusColor(userObj.subscriptionStatus)}>
                        {getStatusText(userObj.subscriptionStatus)}
                      </Badge>
                      <span className="text-sm opacity-90">Renews: {userObj.nextRenewal}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workouts This Month & Day Streak */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-black">12</div>
                  <div className="text-sm text-gray-600">Workouts This Month</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-black">7</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions / Welcome Message */}
            <Card className="bg-gray-100 border-2 border-gray-300 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-black font-semibold mb-2">Welcome to your Journey, {userObj.name}! 🎉</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Your personalized fitness plan is being created based on your onboarding responses.
                  </p>
                  <Badge className="bg-black text-white">Plan ready in 24 hours</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Management */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3">
                  Update Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="training" className="space-y-6">
            {/* Training Plan Section */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Dumbbell className="mr-2 h-5 w-5" />
                  Training Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: 1,
                    emoji: "💪",
                    title: "Upper Body Strength",
                    exercises: 6,
                    totalSets: 18,
                    day: "Monday",
                  },
                  {
                    id: 2,
                    emoji: "🦵",
                    title: "Lower Body Power",
                    exercises: 5,
                    totalSets: 15,
                    day: "Wednesday",
                  },
                  {
                    id: 3,
                    emoji: "🏃",
                    title: "Cardio & Core",
                    exercises: 4,
                    totalSets: 12,
                    day: "Friday",
                  },
                ].map((workout) => (
                  <Card
                    key={workout.id}
                    className="bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedWorkout(workout)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{workout.emoji}</span>
                          <div>
                            <h3 className="text-black font-semibold">{workout.title}</h3>
                            <p className="text-gray-600 text-sm">{workout.day}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-black font-medium">{workout.exercises} exercises</div>
                          <div className="text-gray-600 text-sm">{workout.totalSets} total sets</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Training History Section */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Training History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {[
                    {
                      id: 1,
                      emoji: "💪",
                      title: "Upper Body Strength",
                      date: "Today",
                      duration: "45 min",
                      exercises: 6,
                      totalSets: 18,
                      completed: true,
                    },
                    {
                      id: 2,
                      emoji: "🦵",
                      title: "Lower Body Power",
                      date: "Yesterday",
                      duration: "38 min",
                      exercises: 5,
                      totalSets: 15,
                      completed: true,
                    },
                    {
                      id: 3,
                      emoji: "🏃",
                      title: "Cardio & Core",
                      date: "2 days ago",
                      duration: "30 min",
                      exercises: 4,
                      totalSets: 12,
                      completed: true,
                    },
                    {
                      id: 4,
                      emoji: "💪",
                      title: "Upper Body Strength",
                      date: "4 days ago",
                      duration: "42 min",
                      exercises: 6,
                      totalSets: 18,
                      completed: true,
                    },
                    {
                      id: 5,
                      emoji: "🦵",
                      title: "Lower Body Power",
                      date: "6 days ago",
                      duration: "40 min",
                      exercises: 5,
                      totalSets: 15,
                      completed: true,
                    },
                  ]
                    .slice(currentHistoryPage * 3, (currentHistoryPage + 1) * 3)
                    .map((workout) => (
                      <Card
                        key={workout.id}
                        className="bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setSelectedHistoryWorkout(workout)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{workout.emoji}</span>
                              <div>
                                <h3 className="text-black font-semibold">{workout.title}</h3>
                                <p className="text-gray-600 text-sm">
                                  {workout.date} • {workout.duration}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-black font-medium">{workout.exercises} exercises</div>
                              <div className="text-gray-600 text-sm">{workout.totalSets} sets completed</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentHistoryPage(Math.max(0, currentHistoryPage - 1))}
                    disabled={currentHistoryPage === 0}
                    className="border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-gray-600 text-sm">
                    Page {currentHistoryPage + 1} of {Math.ceil(5 / 3)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentHistoryPage(Math.min(Math.ceil(5 / 3) - 1, currentHistoryPage + 1))}
                    disabled={currentHistoryPage >= Math.ceil(5 / 3) - 1}
                    className="border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="progress" className="space-y-6">
            {/* Weight Progress Section */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Weight Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Weight Display */}
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-black">72.5 kg</div>
                  <div className="text-gray-600">Current Weight</div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span className="text-gray-500">Goal:</span>
                    <span className="text-black font-medium">68 kg</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">Remaining:</span>
                    <span className="text-black font-medium">4.5 kg</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-black font-medium">55% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-black h-3 rounded-full transition-all duration-300" style={{ width: "55%" }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Start: 78 kg</span>
                    <span>Goal: 68 kg</span>
                  </div>
                </div>

                {/* Add Update Button */}
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3"
                  onClick={() => setShowWeightUpdate(true)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Add Weight Update
                </Button>
              </CardContent>
            </Card>

            {/* Recent Weight Updates */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {weightUpdates.slice(currentWeightPage * 3, (currentWeightPage + 1) * 3).map((update, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{update.weight}</span>
                        </div>
                        <div>
                          <div className="text-black font-medium">{update.weight} kg</div>
                          <div className="text-gray-600 text-sm">{update.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${update.change > 0 ? "text-red-600" : update.change < 0 ? "text-green-600" : "text-gray-600"}`}
                        >
                          {update.change > 0 ? "+" : ""}
                          {update.change} kg
                        </div>
                        {update.hasPhoto && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <Camera className="h-3 w-3 mr-1" />
                            Photo added
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for Weight Updates */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeightPage(Math.max(0, currentWeightPage - 1))}
                    disabled={currentWeightPage === 0}
                    className="border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-gray-600 text-sm">
                    Page {currentWeightPage + 1} of {Math.ceil(weightUpdates.length / 3)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentWeightPage(Math.min(Math.ceil(weightUpdates.length / 3) - 1, currentWeightPage + 1))
                    }
                    disabled={currentWeightPage >= Math.ceil(weightUpdates.length / 3) - 1}
                    className="border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Photos */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Progress Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progressPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {progressPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={photo.image || "/placeholder.svg"}
                          alt={`Progress ${photo.date}`}
                          width={100}
                          height={133}
                          className="rounded-lg object-cover w-full aspect-[3/4] border-2 border-gray-200"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 rounded-b-lg">
                          <div>{photo.date}</div>
                          {photo.weight && <div>{photo.weight} kg</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No progress photos yet</p>
                    <p className="text-gray-500 text-sm">Add your first weight update with a photo to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Sharing */}
            <Card className="bg-black text-white border-2 border-gray-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Share Your Progress</h3>
                    <p className="text-sm opacity-90">Inspire others with your journey</p>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-gray-100">
                    <Instagram className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nutrition" className="space-y-6">
            {/* Daily Macro Goals - Destaque para Calorias */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Daily Macro Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Destaque das Calorias */}
                <div className="text-center space-y-2 p-6 bg-black rounded-lg">
                  <div className="text-4xl font-bold text-white">1,450</div>
                  <div className="text-white opacity-90">Daily Calories</div>
                  <div className="text-sm text-white opacity-75">Target for weight loss</div>
                </div>

                {/* Macronutrientes */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-gray-600 text-sm mb-1">Protein</div>
                    <div className="text-2xl font-bold text-black">120</div>
                    <div className="text-gray-500 text-xs">grams</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-gray-600 text-sm mb-1">Carbs</div>
                    <div className="text-2xl font-bold text-black">150</div>
                    <div className="text-gray-500 text-xs">grams</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-gray-600 text-sm mb-1">Fat</div>
                    <div className="text-2xl font-bold text-black">70</div>
                    <div className="text-gray-500 text-xs">grams</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Meal Plan */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Apple className="mr-2 h-5 w-5" />
                  Today's Meal Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyMealPlan.monday.meals.map((meal, index) => (
                  <Card
                    key={index}
                    className="bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-black font-semibold">{meal.meal}</h3>
                        <Badge variant="secondary" className="bg-black text-white">
                          {meal.calories} cal
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                        <div className="text-center">
                          <div className="text-gray-600">Protein</div>
                          <div className="text-black font-medium">{meal.protein}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Carbs</div>
                          <div className="text-black font-medium">{meal.carbs}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Fat</div>
                          <div className="text-black font-medium">{meal.fat}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Click to view details</div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 mt-4"
                  onClick={() => setShowWeeklyPlan(true)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Weekly Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Workout Detail Modal */}
          {selectedWorkout && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{selectedWorkout.emoji}</span>
                      <div>
                        <CardTitle className="text-black">{selectedWorkout.title}</CardTitle>
                        <p className="text-gray-600 text-sm">{selectedWorkout.day}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedWorkout(null)}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    {
                      name: "Push-ups",
                      sets: [
                        { reps: "12", weight: "Bodyweight", completed: false },
                        { reps: "10", weight: "Bodyweight", completed: false },
                        { reps: "8", weight: "Bodyweight", completed: false },
                      ],
                      videoId: "IODxDxX7oi4",
                    },
                    {
                      name: "Bench Press",
                      sets: [
                        { reps: "10", weight: "185 lbs", completed: false },
                        { reps: "8", weight: "185 lbs", completed: false },
                        { reps: "6", weight: "185 lbs", completed: false },
                      ],
                      videoId: "rT7DgCr-3pg",
                    },
                    {
                      name: "Shoulder Press",
                      sets: [
                        { reps: "12", weight: "135 lbs", completed: false },
                        { reps: "10", weight: "135 lbs", completed: false },
                      ],
                      videoId: "qEwKCR5JCog",
                    },
                  ].map((exercise, exerciseIndex) => (
                    <Card key={exerciseIndex} className="bg-gray-50 border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-black font-semibold">{exercise.name}</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Watch Demo
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {exercise.sets.map((set, setIndex) => (
                            <div
                              key={setIndex}
                              className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                            >
                              <span className="text-sm text-gray-600">Set {setIndex + 1}</span>
                              <span className="text-sm text-black font-medium">
                                {set.reps} reps × {set.weight}
                              </span>
                              <Button
                                size="sm"
                                variant={set.completed ? "default" : "outline"}
                                className={
                                  set.completed
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : "border border-gray-300 text-black hover:bg-gray-50 bg-transparent"
                                }
                              >
                                {set.completed ? "✓" : "Complete"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 mt-6"
                    onClick={() => setSelectedWorkout(null)}
                  >
                    Finish Workout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          {/* History Workout Detail Modal */}
          {selectedHistoryWorkout && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{selectedHistoryWorkout.emoji}</span>
                      <div>
                        <CardTitle className="text-black">{selectedHistoryWorkout.title}</CardTitle>
                        <p className="text-gray-600 text-sm">
                          {selectedHistoryWorkout.date} • {selectedHistoryWorkout.duration}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedHistoryWorkout(null)}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    {
                      name: "Push-ups",
                      sets: [
                        { reps: "12", weight: "Bodyweight", completed: true },
                        { reps: "10", weight: "Bodyweight", completed: true },
                        { reps: "8", weight: "Bodyweight", completed: true },
                      ],
                    },
                    {
                      name: "Bench Press",
                      sets: [
                        { reps: "10", weight: "185 lbs", completed: true },
                        { reps: "8", weight: "185 lbs", completed: true },
                        { reps: "6", weight: "185 lbs", completed: true },
                      ],
                    },
                    {
                      name: "Shoulder Press",
                      sets: [
                        { reps: "12", weight: "135 lbs", completed: true },
                        { reps: "10", weight: "135 lbs", completed: true },
                      ],
                    },
                  ].map((exercise, exerciseIndex) => (
                    <Card key={exerciseIndex} className="bg-gray-50 border border-gray-200">
                      <CardContent className="p-4">
                        <h3 className="text-black font-semibold mb-3">{exercise.name}</h3>
                        <div className="space-y-2">
                          {exercise.sets.map((set, setIndex) => (
                            <div
                              key={setIndex}
                              className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                            >
                              <span className="text-sm text-gray-600">Set {setIndex + 1}</span>
                              <span className="text-sm text-black font-medium">
                                {set.reps} reps × {set.weight}
                              </span>
                              <Badge className="bg-black text-white">Completed</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
          {/* Weight Update Modal */}
          {showWeightUpdate && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-xl">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-black">Add Weight Update</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowWeightUpdate(false)
                        setNewWeight("")
                        setNewPhoto(null)
                      }}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Weight Input */}
                  <div className="space-y-3">
                    <Label htmlFor="weight" className="text-black font-medium">
                      Current Weight
                    </Label>
                    <div className="relative">
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        placeholder="72.5"
                        className="border-2 border-gray-200 focus:border-black text-black placeholder:text-gray-400 py-3 pr-12"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-3">
                    <Label className="text-black font-medium">Progress Photo (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {newPhoto ? (
                        <div className="space-y-3">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-black font-medium">{newPhoto.name}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewPhoto(null)}
                            className="border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent"
                          >
                            Remove Photo
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-black font-medium mb-1">Add a progress photo</p>
                            <p className="text-gray-600 text-sm">Capture your transformation journey</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Simulate file selection
                              const fakeFile = new File([""], "progress-photo.jpg", { type: "image/jpeg" })
                              setNewPhoto(fakeFile)
                            }}
                            className="border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent"
                          >
                            Choose Photo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowWeightUpdate(false)
                        setNewWeight("")
                        setNewPhoto(null)
                      }}
                      className="flex-1 border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (newWeight) {
                          const today = new Date().toLocaleDateString()
                          const lastWeight = Number.parseFloat(weightUpdates[0]?.weight || "73")
                          const change = Number.parseFloat(newWeight) - lastWeight

                          const newUpdate = {
                            weight: newWeight,
                            date: "Today",
                            change: Number.parseFloat(change.toFixed(1)),
                            hasPhoto: !!newPhoto,
                          }

                          setWeightUpdates([newUpdate, ...weightUpdates])

                          if (newPhoto) {
                            const newProgressPhoto = {
                              date: today,
                              weight: newWeight,
                              image: "/placeholder.svg?height=200&width=150",
                            }
                            setProgressPhotos([newProgressPhoto, ...progressPhotos])
                          }

                          setShowWeightUpdate(false)
                          setNewWeight("")
                          setNewPhoto(null)
                        }
                      }}
                      disabled={!newWeight}
                      className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Weekly Meal Plan Modal */}
          {showWeeklyPlan && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-black">Weekly Meal Plan</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowWeeklyPlan(false)}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Day Selector */}
                  <div className="mb-6">
                    <div className="grid grid-cols-7 gap-1">
                      {Object.entries(weeklyMealPlan).map(([key, dayData]) => (
                        <Button
                          key={key}
                          variant={selectedDay === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDay(key)}
                          className={
                            selectedDay === key
                              ? "bg-black text-white hover:bg-gray-800 text-xs p-2"
                              : "border border-gray-300 text-black hover:bg-gray-50 bg-transparent text-xs p-2"
                          }
                        >
                          {dayData.day.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Day Details */}
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold text-black mb-1">
                        {weeklyMealPlan[selectedDay as keyof typeof weeklyMealPlan].day}
                      </h3>
                      <div className="text-2xl font-bold text-black">
                        {weeklyMealPlan[selectedDay as keyof typeof weeklyMealPlan].totalCalories} cal
                      </div>
                      <div className="text-sm text-gray-600">Total daily calories</div>
                    </div>

                    {/* Meals for Selected Day */}
                    <div className="space-y-3">
                      {weeklyMealPlan[selectedDay as keyof typeof weeklyMealPlan].meals.map((meal, index) => (
                        <Card
                          key={index}
                          className="bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setSelectedMeal(meal)
                            setShowWeeklyPlan(false)
                          }}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-black font-semibold">{meal.meal}</h4>
                              <Badge variant="secondary" className="bg-black text-white text-xs">
                                {meal.calories} cal
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="text-gray-600">P</div>
                                <div className="text-black font-medium">{meal.protein}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-600">C</div>
                                <div className="text-black font-medium">{meal.carbs}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-600">F</div>
                                <div className="text-black font-medium">{meal.fat}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Meal Detail Modal */}
          {selectedMeal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-xl">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-black">{selectedMeal.meal} Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMeal(null)}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Meal Macros */}
                  <div className="text-center space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-black">{selectedMeal.calories}</div>
                    <div className="text-gray-600">Calories</div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-black">{selectedMeal.protein}</div>
                        <div className="text-sm text-gray-600">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-black">{selectedMeal.carbs}</div>
                        <div className="text-sm text-gray-600">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-black">{selectedMeal.fat}</div>
                        <div className="text-sm text-gray-600">Fat</div>
                      </div>
                    </div>
                  </div>

                  {/* Food List */}
                  <div className="space-y-3">
                    <h4 className="text-black font-semibold">Ingredients:</h4>
                    <div className="space-y-2">
                      {selectedMeal.foods.map((food: string, index: number) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                          <span className="text-black">{food}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedMeal(null)}
                      className="flex-1 border-2 border-gray-300 text-black hover:bg-gray-50 bg-transparent"
                    >
                      Close
                    </Button>
                    <Button className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold">
                      Mark as Eaten
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6">
            <Button
              size="lg"
              className="rounded-full h-14 w-14 bg-black hover:bg-gray-800 shadow-xl border-2 border-gray-200"
            >
              <Heart className="h-6 w-6 text-white" />
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
