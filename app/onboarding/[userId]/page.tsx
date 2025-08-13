"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import FitnessOnboarding from "../page"

export default function OnboardingWithUserId() {
  const params = useParams()
  const userIdFromPath = typeof params.userId === "string" ? params.userId : Array.isArray(params.userId) ? params.userId[0] : ""

  // Renderiza o componente principal, passando o userId como prop
  return <FitnessOnboarding userIdFromPath={userIdFromPath} />
}
