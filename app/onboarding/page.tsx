"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
  Heart,
  User,
  Target,
  Dumbbell,
  Apple,
  Camera,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  UserPlus,
  Mail,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  getOnboardingQuestions,
  getUserResponses,
  getUserResponsesClient,
  getLeadByIdClient, // Importar função para obter dados do lead
  // Removed saveResponseAndUpdateProfile from here
  shouldShowQuestion,
  validateResponse,
  type OnboardingQuestion,
} from "@/lib/onboarding"
import { useAuth } from "@/components/auth-provider"
import {
  completeOnboarding,
  signUpAndCreateProfile,
  saveOnboardingResponses,
  saveIndividualOnboardingResponseAndProfile, // Import new server action
} from "@/app/auth-actions"
import { DebugPanel } from "@/components/debug-panel"
import { supabase } from "@/lib/supabase"

const iconMap: Record<string, any> = {
  User,
  Target,
  Dumbbell,
  Apple,
  Camera,
}

export default function OnboardingPage({ userIdFromPath }: { userIdFromPath?: string }) {
  // Only log once per render cycle to avoid spam
  const renderRef = React.useRef(0)
  renderRef.current++
  
  if (renderRef.current === 1) {
    console.log("🚀 Onboarding page loaded - Opção C enabled")
  }

  const router = useRouter()
  const { user, isConfigured } = useAuth()

  // Function to get user's last answered question
  const getUserProgress = useCallback(async (userId: string) => {
    try {
      console.log("🔍 Checking user progress for:", userId)
      
      // Import supabase here to avoid circular dependency
      const { supabase } = await import("@/lib/supabase")
      
      if (!supabase) {
        console.error("❌ Supabase client not available")
        return null
      }
      
      // 1. Primeiro buscar todas as respostas do usuário com JOIN para pegar field_name
      const { data: responses, error } = await supabase
        .from('onboarding_responses')
        .select(`
          question_id, 
          response_value, 
          completed_at,
          onboarding_questions(field_name, step_number)
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })

      if (error) {
        console.error("❌ Error fetching user progress:", error)
        return null
      }

      console.log("📊 User responses found:", responses?.length || 0)
      
      if (!responses || responses.length === 0) {
        console.log("📋 No previous responses found")
        return null
      }

      // 2. Buscar a última pergunta respondida (pela completed_at mais recente)
      const lastResponse = responses[0] // Já ordenado por completed_at desc
      console.log("📍 Last answered question_id:", lastResponse.question_id)
      console.log("📝 Last answered question details:", lastResponse.onboarding_questions)

      // Type assertion para contornar o problema de tipagem do JOIN
      const questionData = lastResponse.onboarding_questions as any

      return { 
        responses, 
        lastQuestionOrder: questionData?.step_number as number,
        lastQuestionId: lastResponse.question_id,
        lastQuestionFieldName: questionData?.field_name
      }
    } catch (error) {
      console.error("❌ Error in getUserProgress:", error)
      return null
    }
  }, [])

  // Check if the user in the path is valid (only used for logging, not blocking access)
  const isValidUserPath = useCallback(() => {
    if (!userIdFromPath) return true // No path param, allow normal flow
    if (!user) return true // UUID access allowed without authentication
    return user.id === userIdFromPath // Check if path matches authenticated user
  }, [userIdFromPath, user])

  if (renderRef.current === 1) {
    console.log("👤 User:", user ? "Logged in" : "Not logged in")
    console.log("⚙️ Supabase configured:", isConfigured)
  }

  const [currentStep, setCurrentStep] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([])
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [visibleQuestions, setVisibleQuestions] = useState<OnboardingQuestion[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userCreated, setUserCreated] = useState(false)
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(true) // Adicionar estado para controlar loading de auth

  // Effect to monitor auth loading state
  useEffect(() => {
    // Give some time for auth to load, then mark as loaded
    const timer = setTimeout(() => {
      setAuthLoading(false)
    }, 2000) // Wait 2 seconds for auth to load

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (questionsLoaded || authLoading) return // Prevent multiple loads or loading while auth is loading
    
    console.log("🔎 Loading onboarding questions...")
    
    const loadInitialData = async () => {
      try {
        const qs = await getOnboardingQuestions()
        console.log("[ONBOARDING] Perguntas carregadas:", qs)
        setQuestions(qs)
        
        // Opção C: Always check for existing user progress when UUID is provided
        if (userIdFromPath && userIdFromPath.length > 0) {
          console.log("🔍 Checking for onboarding progress for UUID:", userIdFromPath)
          
          try {
            // Primeiro, tentar carregar do Supabase se possível
            let userProgress = null
            if (supabase) {
              userProgress = await getUserProgress(userIdFromPath)
            }
            
            // Se não conseguiu carregar do Supabase, tentar localStorage como fallback
            if (!userProgress || !userProgress.responses || userProgress.responses.length === 0) {
              console.log("🔍 No Supabase progress found, checking localStorage...")
              const localStorageKey = `onboarding_progress_${userIdFromPath}`
              const localData = localStorage.getItem(localStorageKey)
              
              if (localData) {
                try {
                  const parsedData = JSON.parse(localData)
                  console.log("💾 Found local progress for UUID:", parsedData)
                  
                  // Criar um objeto de progresso simulado
                  userProgress = {
                    responses: Object.keys(parsedData).map((fieldName, index) => ({
                      field_name: fieldName,
                      response_value: typeof parsedData[fieldName] === 'object' 
                        ? JSON.stringify(parsedData[fieldName]) 
                        : parsedData[fieldName],
                      question_id: `local_${index}`
                    })),
                    lastQuestionOrder: Object.keys(parsedData).length - 1
                  }
                } catch (e) {
                  console.error("❌ Error parsing local storage data:", e)
                }
              }
            }
            
            if (userProgress && userProgress.responses && userProgress.responses.length > 0) {
              console.log("✅ User has existing progress, setting up user session")
              
              // Se há respostas, assumir que o usuário existe e criar um objeto temporário
              const tempUser = {
                id: userIdFromPath,
                email: null,
                name: null
              }
              
              // Procurar o nome e email nas respostas existentes
              userProgress.responses.forEach((response: any) => {
                const questionData = response.onboarding_questions as any
                const fieldName = questionData?.field_name
                if (fieldName === 'name') {
                  tempUser.name = response.response_value
                }
                if (fieldName === 'email') {
                  tempUser.email = response.response_value
                }
              })
              
              setCurrentUser(tempUser)
              
              // Convert responses to the format expected by the component
              const progressResponses: Record<string, any> = {}
              userProgress.responses.forEach((response: any) => {
                const questionData = response.onboarding_questions as any
                const fieldName = questionData?.field_name
                if (fieldName && response.response_value) {
                  try {
                    // Try to parse JSON, if it fails, use as string
                    progressResponses[fieldName as string] = JSON.parse(response.response_value as string)
                  } catch {
                    progressResponses[fieldName as string] = response.response_value
                  }
                }
              })
              
              console.log("📊 Restored user responses:", progressResponses)
              setResponses(progressResponses)
              
              // 4. Encontrar o próximo step baseado no número de respostas ou step_number
              let nextStepIndex = 0
              if (userProgress.lastQuestionOrder !== undefined) {
                console.log("📍 Last question step_number:", userProgress.lastQuestionOrder)
                
                // Encontrar o índice da próxima pergunta no array de questions
                for (let i = 0; i < qs.length; i++) {
                  // Se a pergunta atual tem step_number maior que a última respondida, é a próxima
                  if (qs[i].step_number && qs[i].step_number > userProgress.lastQuestionOrder) {
                    nextStepIndex = i
                    break
                  }
                  // Se chegou ao final, todas as perguntas foram respondidas
                  if (i === qs.length - 1) {
                    nextStepIndex = qs.length
                  }
                }
              } else {
                // Fallback: basear no número de respostas
                const answeredQuestions = Object.keys(progressResponses)
                for (let i = 0; i < qs.length; i++) {
                  if (!answeredQuestions.includes(qs[i].field_name)) {
                    nextStepIndex = i
                    break
                  }
                  if (i === qs.length - 1) {
                    nextStepIndex = qs.length
                  }
                }
              }
              
              setCurrentStep(nextStepIndex)
              console.log(`🎯 Resuming from step ${nextStepIndex + 1}/${qs.length}`)
              
              // Se há progresso, iniciar automaticamente o questionário
              setIsStarted(true)
            } else {
              console.log("📋 No previous progress found for UUID:", userIdFromPath)
              console.log("🎯 UUID access allowed for new user - Opção C")
              // For Opção C: Allow access but don't set currentUser yet
              // They will create account when completing onboarding
              setCurrentUser(null)
              setIsStarted(false) // Start fresh
            }
          } catch (error) {
            console.error("❌ Error checking user progress:", error)
            console.log("🎯 Error occurred, but allowing access for Opção C")
            setCurrentUser(null)
            setIsStarted(false)
          }
        }
        
        setQuestionsLoaded(true)
        setLoading(false)
      } catch (error) {
        console.error("Error loading questions:", error)
        setLoading(false)
      }
    }
    
    loadInitialData()
  }, [questionsLoaded, userIdFromPath, user, isValidUserPath, getUserProgress, router, authLoading])

  useEffect(() => {
    if (questions.length > 0) {
      const visible = questions.filter((question) => shouldShowQuestion(question, responses))
      console.log("[ONBOARDING] Perguntas visíveis:", visible)
      setVisibleQuestions(visible)
    }
  }, [questions, responses])

  useEffect(() => {
    if (visibleQuestions.length > 0) {
      setProgress((currentStep / visibleQuestions.length) * 100)
    }
  }, [currentStep, visibleQuestions.length])

  const loadOnboardingData = async () => {
    try {
      const questionsData = await getOnboardingQuestions()
      setQuestions(questionsData)

      if (user) {
        setCurrentUser(user)
        setUserCreated(true)
        const userResponses = await getUserResponses(user.id)
        const responsesMap: Record<string, any> = {}

        userResponses.forEach((response: any) => {
          const question = response.onboarding_questions
          if (question) {
            responsesMap[question.field_name] = response.response_array || response.response_value
          }
        })

        setResponses(responsesMap)
      }
    } catch (error) {
      console.error("Error loading onboarding data:", error)
    } finally {
      setLoading(false
      )
    }
  }

  const loadOnboardingDataWithUserId = async (userId: string) => {
    try {
      console.log("[ONBOARDING] Iniciando loadOnboardingDataWithUserId para:", userId)
      const questionsData = await getOnboardingQuestions()
      console.log("[ONBOARDING] Perguntas carregadas:", questionsData.map(q => q.field_name))
      setQuestions(questionsData)
      const userResponses = await getUserResponsesClient(userId)
      console.log("[ONBOARDING] Respostas do usuário:", userResponses)
      const responsesMap: Record<string, any> = {}
      userResponses.forEach((response: any) => {
        const question = response.onboarding_questions
        if (question) {
          responsesMap[question.field_name] = response.response_array || response.response_value
        }
      })
      console.log("[ONBOARDING] responsesMap gerado:", responsesMap)
      setResponses(responsesMap)
      setCurrentUser({ id: userId })
      setUserCreated(true)
      // Encontrar o próximo step não respondido
      const nextStepIndex = questionsData.findIndex(q => !(q.field_name in responsesMap))
      setCurrentStep(nextStepIndex === -1 ? questionsData.length : nextStepIndex)
      setIsStarted(true) // inicia o onboarding automaticamente
    } catch (error) {
      console.error("Error loading onboarding data with userId:", error)
    } finally {
      setLoading(false)
    }
  }

  // Nova função para carregar dados do lead e pré-preencher respostas do onboarding
  const loadOnboardingDataWithLeadId = async (leadId: string) => {
    try {
      console.log("[ONBOARDING] Iniciando loadOnboardingDataWithLeadId para:", leadId)
      const leadData = await getLeadByIdClient(leadId)
      console.log("[ONBOARDING] Dados do lead:", leadData)
      const questionsData = await getOnboardingQuestions()
      setQuestions(questionsData)
      // Pré-preencher respostas com dados do lead
      const responsesMap: Record<string, any> = {}
      if (leadData) {
        if (leadData.name) responsesMap["name"] = leadData.name
        if (leadData.phone) responsesMap["phone"] = leadData.phone
        // Adicione outros campos conforme necessário
      }
      setResponses(responsesMap)
      setCurrentUser({ id: leadData?.user_id || leadId })
      setUserCreated(false)
    } catch (error) {
      console.error("Error loading onboarding data with leadId:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateVisibleQuestions = () => {
    const visible = questions.filter((question) => shouldShowQuestion(question, responses))
    setVisibleQuestions(visible)
  }

  const updateResponse = (fieldName: string, value: any) => {
    const newResponses = { ...responses, [fieldName]: value }
    setResponses(newResponses)

    // Clear any existing error for this field
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }

    // Save locally if Supabase is not configured
    if (!isConfigured) {
      localStorage.setItem("onboardingData", JSON.stringify(newResponses))
    }
  }

  const handleArrayUpdate = (fieldName: string, value: string, checked: boolean) => {
    const currentArray = (responses[fieldName] as string[]) || []
    let newArray: string[]

    if (checked) {
      newArray = [...currentArray, value]
    } else {
      newArray = currentArray.filter((item) => item !== value)
    }

    updateResponse(fieldName, newArray)
  }

  const nextStep = async () => {
    const currentQuestion = visibleQuestions[currentStep]
    if (!currentQuestion) return

    const value = responses[currentQuestion.field_name]
    const validation = validateResponse(currentQuestion, value)

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.field_name]: validation.error || "Invalid input",
      }))
      return
    }

    // Validação adicional para senha e telefone quando for questão de email
    if (currentQuestion.field_name === "email") {
      const password = responses.password
      const phone = responses.phone
      
      if (!password) {
        setErrors((prev) => ({
          ...prev,
          password: "Password is required",
        }))
        return
      }
      if (password.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters long",
        }))
        return
      }
      
      if (!phone) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number is required",
        }))
        return
      }
      
      // Validar se o telefone tem pelo menos 10 dígitos (formato internacional)
      const phoneDigits = phone.replace(/\D/g, '')
      if (phoneDigits.length < 10) {
        setErrors((prev) => ({
          ...prev,
          phone: "Please enter a valid phone number",
        }))
        return
      }
    }

    // Logic to create user and save all previous responses when email is submitted
    if (currentQuestion.field_name === "email" && !userCreated) {
      try {
        console.log("📧 Email, phone and password provided, attempting to create user on NEXT click...")
        const emailValue = responses.email as string
        const passwordValue = responses.password as string
        const phoneValue = responses.phone as string
        
        if (!emailValue) {
          setErrors((prev) => ({ ...prev, [currentQuestion.field_name]: "Email is required." }))
          return
        }
        if (!passwordValue) {
          setErrors((prev) => ({ ...prev, password: "Password is required." }))
          return
        }
        if (!phoneValue) {
          setErrors((prev) => ({ ...prev, phone: "Phone is required." }))
          return
        }

        // Formatar o telefone removendo todos os caracteres não numéricos para o formato ddiddphone
        const formattedPhone = phoneValue.replace(/\D/g, '')
        console.log("📱 Formatted phone (numbers only):", formattedPhone)

        // Incluir o telefone formatado nas respostas antes de criar o usuário
        const responsesWithPhoneAndPassword = { 
          ...responses, 
          password: passwordValue,
          phone: formattedPhone // Salvar apenas números: exemplo 5511994072477
        }
        
        // Para Opção C: sempre tentar criar usuário, independente do isConfigured
        try {
          const userData = await signUpAndCreateProfile(emailValue, responsesWithPhoneAndPassword, passwordValue)
          const createdUser = userData?.data?.user
          if (createdUser) {
            setCurrentUser(createdUser)
            setUserCreated(true)
            console.log("✅ User created successfully via Server Action:", createdUser.id)

            await saveOnboardingResponses(createdUser.id, responsesWithPhoneAndPassword, questions)
            console.log("✅ All previous responses saved to Supabase via Server Action.")
            
            // Redirecionar para URL com UUID do usuário se não estiver já na URL correta
            if (!userIdFromPath || userIdFromPath !== createdUser.id) {
              console.log("🔄 Redirecting to URL with user ID:", createdUser.id)
              // Usar replace em vez de push para evitar loop de redirecionamento
              window.location.replace(`/onboarding/${createdUser.id}`)
              return
            }
          } else {
            console.error("❌ Error: User not created. userData:", userData)
            if (userData?.error) {
              console.error("❌ Supabase error:", userData.error)
            }
          }
        } catch (error: any) {
          console.error("❌ Error creating user, but saving locally for Opção C:", error)
          // Para Opção C: mesmo com erro, continuar localmente
          setCurrentUser({ id: userIdFromPath || 'temp-' + Date.now(), ...responsesWithPhoneAndPassword })
          setUserCreated(true)
          localStorage.setItem("onboardingData", JSON.stringify(responsesWithPhoneAndPassword))
          console.log("💾 Data saved locally as fallback")
        }
      } catch (error: any) {
        console.error("❌ Error creating user on NEXT click:", error)
        setErrors((prev) => ({
          ...prev,
          [currentQuestion.field_name]: `Failed to create account: ${error.message || "Unknown error"}`,
        }))
        return
      }
    }
    // For users accessed via UUID (no authentication required), save responses directly
    else if (userIdFromPath && currentUser?.id === userIdFromPath) {
      try {
        console.log("💾 Saving response for UUID user:", userIdFromPath)
        // Para Opção C: tentar salvar no Supabase, mas continuar se falhar
        try {
          await saveIndividualOnboardingResponseAndProfile(
            currentUser.id,
            currentQuestion.id,
            currentQuestion.field_name,
            value,
          )
          console.log("✅ Response saved to Supabase for UUID user")
        } catch (error) {
          console.error("❌ Error saving to Supabase, saving locally:", error)
          // Fallback para localStorage
          const localData = JSON.parse(localStorage.getItem("onboardingData") || "{}")
          localData[currentQuestion.field_name] = value
          localStorage.setItem("onboardingData", JSON.stringify(localData))
          console.log("💾 Response saved locally as fallback")
        }
      } catch (error) {
        console.error("❌ Error saving response for UUID user:", error)
      }
    }
    // For authenticated users, save individual response
    else if (currentUser && userCreated && user && user.id === currentUser.id) {
      try {
        // Call the new Server Action for individual response and profile updates
        await saveIndividualOnboardingResponseAndProfile(
          currentUser.id,
          currentQuestion.id,
          currentQuestion.field_name,
          value,
        )
      } catch (error) {
        console.error("❌ Error saving response after user created:", error)
      }
    }

    if (currentStep < visibleQuestions.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleExistingAccount = () => {
    router.push("/auth/signin")
  }

  const handleCompleteOnboarding = async () => {
    try {
      const userToComplete = currentUser || user

      // If user accessed via UUID (not authenticated), redirect to login
      if (userIdFromPath && !user) {
        console.log("🔐 UUID user needs to authenticate to access platform")
        router.push("/auth/signin")
        return
      }

      if (userToComplete && isConfigured) {
        await completeOnboarding(userToComplete.id, {
          name: responses.name,
          phone: responses.phone,
          nickname: responses.nickname,
          email: responses.email,
        })
        console.log("✅ Onboarding completed for user:", userToComplete.id)
      } else if (!isConfigured) {
        localStorage.setItem("onboardingData", JSON.stringify(responses))
        console.log("💾 Data stored locally")
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("❌ Error completing onboarding:", error)
      if (isConfigured) {
        alert("Error completing onboarding. Please try again.")
      } else {
        localStorage.setItem("onboardingData", JSON.stringify(responses))
        router.push("/dashboard")
      }
    }
  }

  const canProceed = () => {
    const currentQuestion = visibleQuestions[currentStep]
    if (!currentQuestion) return true

    const value = responses[currentQuestion.field_name]
    const validation = validateResponse(currentQuestion, value)

    // Validação adicional para senha quando for questão de email
    if (currentQuestion.field_name === "email") {
      const password = responses.password
      if (!password || password.length < 6) {
        return false
      }
    }

    return validation.isValid
  }

  const renderQuestion = (question: OnboardingQuestion) => {
    const IconComponent = question.icon ? iconMap[question.icon] : null
    const value = responses[question.field_name]
    const error = errors[question.field_name]
    const isEmailQuestion = question.field_name === "email"

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          {question.emoji ? (
            <div className="text-4xl mb-4">{question.emoji}</div>
          ) : IconComponent ? (
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          ) : null}
          <h2 className="text-2xl font-bold text-black mb-2">{question.title}</h2>
          {question.subtitle && <p className="text-gray-600">{question.subtitle}</p>}

          {/* Mostrar status especial para pergunta do email */}
          {isEmailQuestion && !userCreated && isConfigured && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Mail className="h-3 w-3 mr-1" />
                Your account will be created after this step
              </Badge>
            </div>
          )}

          {/* Mostrar status de salvamento após usuário criado */}
          {userCreated && isConfigured && (
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                <UserPlus className="h-3 w-3 mr-1" />
                Account created - Auto-saving responses
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {question.question_type === "text" && (
            <>
              <Label htmlFor={question.field_name} className="text-black font-medium">
                {question.title}
              </Label>
              <Input
                id={question.field_name}
                value={value || ""}
                onChange={(e) => updateResponse(question.field_name, e.target.value)}
                placeholder={question.placeholder || ""}
                className={`border-2 ${error ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 py-3`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}

          {question.question_type === "number" && (
            <>
              <Label htmlFor={question.field_name} className="text-black font-medium">
                {question.title}
              </Label>
              <Input
                id={question.field_name}
                type="number"
                value={value || ""}
                onChange={(e) => updateResponse(question.field_name, e.target.value)}
                placeholder={question.placeholder || ""}
                className={`border-2 ${error ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 py-3`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}

          {question.question_type === "email" && (
            <>
              <Label htmlFor={question.field_name} className="text-black font-medium">
                {question.title}
              </Label>
              <Input
                id={question.field_name}
                type="email"
                value={value || ""}
                onChange={(e) => updateResponse(question.field_name, e.target.value)}
                placeholder={question.placeholder || ""}
                className={`border-2 ${error ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 py-3`}
              />
              
              {/* Campo de telefone para questões de email */}
              <div className="mt-4">
                <Label htmlFor="phone" className="text-black font-medium">
                  Phone number
                </Label>
                <div className="relative">
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="BR"
                    value={responses.phone || ""}
                    onChange={(value) => updateResponse("phone", value || "")}
                    className={`w-full border-2 ${errors.phone ? "border-red-500" : "border-gray-200"} rounded-md focus:border-black text-black bg-white`}
                    style={{
                      '--PhoneInputCountryFlag-height': '1em',
                      '--PhoneInputCountryFlag-borderColor': 'transparent',
                      '--PhoneInputCountrySelectArrow-color': '#6b7280',
                      '--PhoneInput-color--focus': '#000000',
                    } as any}
                    inputComponent={Input}
                    numberInputProps={{
                      className: "border-0 bg-transparent focus:ring-0 focus:border-0 pl-2",
                      style: { outline: 'none', boxShadow: 'none' }
                    }}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              {/* Campo de senha para questões de email */}
              <div className="mt-4">
                <Label htmlFor="password" className="text-black font-medium">
                  Create your password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={responses.password || ""}
                    onChange={(e) => updateResponse("password", e.target.value)}
                    placeholder="Enter a secure password"
                    className={`border-2 ${errors.password ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 py-3 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {isEmailQuestion && !userCreated && (
                <p className="text-sm text-blue-600 mt-2">
                  💡 After entering your email, phone and password, we'll create your account with all the information you've provided so
                  far.
                </p>
              )}
            </>
          )}

          {question.question_type === "textarea" && (
            <>
              <Label htmlFor={question.field_name} className="text-black font-medium">
                {question.title}
              </Label>
              <Textarea
                id={question.field_name}
                value={value || ""}
                onChange={(e) => updateResponse(question.field_name, e.target.value)}
                placeholder={question.placeholder || ""}
                className={`border-2 ${error ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 min-h-[120px]`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}

          {question.question_type === "radio" && question.options && (
            <RadioGroup value={value || ""} onValueChange={(newValue) => updateResponse(question.field_name, newValue)}>
              <div className="space-y-3">
                {/* Fix: Access the options array correctly */}
                {(() => {
                  let optionsArray: string[] = [];
                  if (Array.isArray(question.options)) {
                    optionsArray = question.options;
                  } else if (question.options && typeof question.options === 'object' && 'options' in question.options) {
                    optionsArray = Array.isArray((question.options as any).options) ? (question.options as any).options : [];
                  }
                  return optionsArray.map((option: string) => (
                    <div
                      key={option}
                      className={`flex items-center space-x-3 p-4 border-2 ${error ? "border-red-500" : "border-gray-200"} rounded-lg hover:border-gray-300 transition-colors`}
                    >
                      <RadioGroupItem value={option.toLowerCase()} id={option} className="border-2 border-gray-400" />
                      <Label htmlFor={option} className="text-black cursor-pointer flex-1 font-medium">
                        {option}
                      </Label>
                    </div>
                  ));
                })()}
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </RadioGroup>
          )}

          {question.question_type === "checkbox" && question.options && (
            <div className="space-y-3">
              {(() => {
                let optionsArray: string[] = [];
                if (Array.isArray(question.options)) {
                  optionsArray = question.options;
                } else if (question.options && typeof question.options === 'object' && 'options' in question.options) {
                  optionsArray = Array.isArray((question.options as any).options) ? (question.options as any).options : [];
                }
                return optionsArray.map((option: string) => (
                  <div
                    key={option}
                    className={`flex items-center space-x-3 p-4 border-2 ${error ? "border-red-500" : "border-gray-200"} rounded-lg hover:border-gray-300 transition-colors`}
                  >
                    <Checkbox
                      id={option}
                      checked={((value as string[]) || []).includes(option)}
                      onCheckedChange={(checked) => handleArrayUpdate(question.field_name, option, checked as boolean)}
                      className="border-2 border-gray-400"
                    />
                    <Label htmlFor={option} className="text-black cursor-pointer flex-1 font-medium">
                      {option}
                    </Label>
                  </div>
                ));
              })()}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? "Loading authentication..." : "Loading onboarding..."}
          </p>
        </div>
      </div>
    )
  }

  if (!isStarted) {
    // Check if user accessed via UUID
    const isUuidAccess = userIdFromPath && currentUser?.id === userIdFromPath

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              
              {isUuidAccess ? (
                <>
                  <h1 className="text-3xl font-bold text-black mb-3">Welcome back!</h1>
                  <p className="text-gray-600 text-lg">Continue your personalized fitness questionnaire</p>
                  <div className="mt-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Heart className="h-3 w-3 mr-1" />
                      Progress automatically saved
                    </Badge>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-black mb-3">Welcome to FitJourney</h1>
                  <p className="text-gray-600 text-lg">Let's create your personalized fitness plan together</p>
                  {isConfigured && (
                    <div className="mt-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Mail className="h-3 w-3 mr-1" />
                        Account created after email step
                      </Badge>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setIsStarted(true)}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 text-lg shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isUuidAccess ? "Continue Questionnaire" : "I am new - Let's start!"}
              </Button>

              {!isUuidAccess && (
                <Button
                  onClick={handleExistingAccount}
                  variant="outline"
                  className="w-full border-2 border-gray-300 text-black hover:bg-gray-50 py-4 text-lg transition-all duration-200 bg-transparent"
                >
                  I already have an account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <DebugPanel />
      </div>
    )
  }

  if (currentStep >= visibleQuestions.length) {
    // Check if user accessed via UUID and is not authenticated
    const isUuidUserNotAuthenticated = userIdFromPath && !user

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-md">
          <Card className="bg-white border-2 border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              
              {isUuidUserNotAuthenticated ? (
                <>
                  <h2 className="text-3xl font-bold text-black mb-3">Great! You've completed the questionnaire!</h2>
                  <p className="text-gray-600 text-lg mb-8">
                    Thank you for completing your profile, {responses.name}!
                    <span className="block mt-4 text-blue-600 font-medium">
                      🔐 To access your personalized fitness plan and start your journey, please sign in to the platform.
                    </span>
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={handleCompleteOnboarding}
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 text-lg shadow-lg"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Sign In to Access Platform
                    </Button>
                    <p className="text-gray-500 text-sm">Your responses have been saved. Sign in to view your custom plan!</p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-black mb-3">Welcome to your fitness journey!</h2>
                  <p className="text-gray-600 text-lg mb-8">
                    Thank you for completing your profile, {responses.name}!
                    {userCreated && isConfigured && (
                      <span className="block mt-2 text-sm text-green-600">
                        ✅ Your account has been created and all responses saved!
                      </span>
                    )}
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={handleCompleteOnboarding}
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 text-lg shadow-lg"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Start My Journey
                    </Button>
                    <p className="text-gray-500 text-sm">You'll receive your custom plan within 24 hours!</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <DebugPanel />
      </div>
    )
  }

  const currentQuestion = visibleQuestions[currentStep]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm font-medium">Progress</span>
            <span className="text-gray-600 text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <Badge variant="secondary" className="bg-black text-white">
              Step {currentStep + 1} of {visibleQuestions.length}
            </Badge>
            <span className="text-gray-500 text-xs">{visibleQuestions.length - currentStep - 1} questions left</span>
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-white border-2 border-gray-200 shadow-lg mb-8">
          <CardContent className="p-8">{currentQuestion && renderQuestion(currentQuestion)}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-2 border-gray-300 text-black hover:bg-gray-50 disabled:opacity-50 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-black hover:bg-gray-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === visibleQuestions.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <DebugPanel />
      </div>
    </div>
  )
}
