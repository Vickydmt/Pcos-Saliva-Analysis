"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AnalysisForm } from "@/components/analysis-form"
import { AnalysisResults } from "@/components/analysis-results"
import { useAuth } from "@/components/auth-context"
import { type PCOSProfile, type RiskResult, DEMO_PROFILES, calculatePCOSRisk, saveReport } from "@/lib/pcos-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

function AnalyzeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [step, setStep] = useState<"form" | "results">("form")
  const [profile, setProfile] = useState<PCOSProfile | null>(null)
  const [result, setResult] = useState<RiskResult | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      setIsDemo(true)
    }
  }, [searchParams])

  // Redirect to account page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Login Required
              </CardTitle>
              <CardDescription>
                You need to be logged in to save your analysis results to the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Please log in or create an account to start your PCOS risk analysis. Your results will be saved to your dashboard for tracking over time.
              </p>
              <Button onClick={() => router.push("/account")} className="w-full">
                Go to Login/Register
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const handleSubmit = (data: PCOSProfile) => {
    setProfile(data)
    const riskResult = calculatePCOSRisk(data)
    setResult(riskResult)
    saveReport(data, riskResult)
    setStep("results")
  }

  const handleReset = () => {
    setProfile(null)
    setResult(null)
    setStep("form")
    router.push("/analyze")
  }

  const handleLoadDemo = (type: "normal" | "borderline" | "likelyPCOS") => {
    const demoProfile = DEMO_PROFILES[type] as PCOSProfile
    setProfile(demoProfile)
    const riskResult = calculatePCOSRisk(demoProfile)
    setResult(riskResult)
    saveReport(demoProfile, riskResult)
    setStep("results")
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {step === "form" ? (
          <AnalysisForm onSubmit={handleSubmit} onLoadDemo={handleLoadDemo} showDemoOptions={isDemo} />
        ) : (
          <AnalysisResults profile={profile!} result={result!} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AnalyzeContent />
    </Suspense>
  )
}
