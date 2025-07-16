"use client"
import { useEffect } from "react"
import { redirectIfNotAuthenticated } from "@/lib/auth"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    redirectIfNotAuthenticated()
  }, [])
  return <>{children}</>
} 