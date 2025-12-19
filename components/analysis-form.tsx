"use client"

import { useState, useEffect } from "react"
import { type PCOSProfile, DEMO_PROFILES } from "@/lib/pcos-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { User, Calendar, TestTube, Sparkles, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react"

interface AnalysisFormProps {
  onSubmit: (data: PCOSProfile) => void
  onLoadDemo: (type: "normal" | "borderline" | "likelyPCOS") => void
  showDemoOptions: boolean
}

const defaultProfile: PCOSProfile = {
  age: 25,
  height: 160,
  weight: 60,
  bmi: 23.4,
  familyHistory: false,
  cycleLength: 28,
  irregularPeriods: false,
  missedPeriods: false,
  acneSeverity: 0,
  excessHairGrowth: 0,
  hairFall: false,
  darkPatches: false,
  moodSwings: false,
  testosterone: 40,
  amh: 2.5,
  lh: 6.0,
  fsh: 5.0,
  lhFshRatio: 1.2,
  cortisol: 12.0,
}

export function AnalysisForm({ onSubmit, onLoadDemo, showDemoOptions }: AnalysisFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<PCOSProfile>(defaultProfile)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (profile.height > 0 && profile.weight > 0) {
      const heightM = profile.height / 100
      const bmi = profile.weight / (heightM * heightM)
      setProfile((prev) => ({ ...prev, bmi: Math.round(bmi * 10) / 10 }))
    }
  }, [profile.height, profile.weight])

  // Calculate LH/FSH ratio
  useEffect(() => {
    if (profile.lh > 0 && profile.fsh > 0) {
      const ratio = profile.lh / profile.fsh
      setProfile((prev) => ({ ...prev, lhFshRatio: Math.round(ratio * 100) / 100 }))
    }
  }, [profile.lh, profile.fsh])

  const updateProfile = <K extends keyof PCOSProfile>(key: K, value: PCOSProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: "" }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (profile.age < 15 || profile.age > 60) newErrors.age = "Age must be between 15 and 60"
      if (profile.height < 100 || profile.height > 220) newErrors.height = "Invalid height"
      if (profile.weight < 30 || profile.weight > 200) newErrors.weight = "Invalid weight"
    }

    if (step === 1) {
      if (profile.cycleLength < 15 || profile.cycleLength > 90)
        newErrors.cycleLength = "Cycle length must be between 15 and 90 days"
    }

    if (step === 2) {
      if (profile.testosterone < 0 || profile.testosterone > 200) newErrors.testosterone = "Invalid testosterone value"
      if (profile.amh < 0 || profile.amh > 50) newErrors.amh = "Invalid AMH value"
      if (profile.lh < 0 || profile.lh > 100) newErrors.lh = "Invalid LH value"
      if (profile.fsh < 0 || profile.fsh > 50) newErrors.fsh = "Invalid FSH value"
      if (profile.cortisol < 0 || profile.cortisol > 50) newErrors.cortisol = "Invalid cortisol value"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    if (validateStep(2)) {
      onSubmit(profile)
    }
  }

  const autoFillProfiles: Array<{ name: string; type: "normal" | "borderline" | "likelyPCOS" }> = [
    { name: "Normal", type: "normal" },
    { name: "Borderline", type: "borderline" },
    { name: "Likely PCOS", type: "likelyPCOS" },
  ]

  const autoFillExample = (profileType: "normal" | "borderline" | "likelyPCOS" = "borderline") => {
    const example = DEMO_PROFILES[profileType] as PCOSProfile
    setProfile(example)
  }

  const steps = [
    { title: "Basic Details", icon: User },
    { title: "Clinical Symptoms", icon: Calendar },
    { title: "Hormonal Values", icon: TestTube },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Demo Options */}
      {showDemoOptions && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Demo Mode
            </CardTitle>
            <CardDescription>Try pre-configured profiles to see how the analysis works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => onLoadDemo("normal")}>
                Normal Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => onLoadDemo("borderline")}>
                Borderline Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => onLoadDemo("likelyPCOS")}>
                Likely PCOS Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            return (
              <div key={step.title} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`mt-2 text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-16 sm:w-24 ${isCompleted ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "Enter your basic health information"}
                {currentStep === 1 && "Describe your menstrual cycle and clinical symptoms"}
                {currentStep === 2 && "Enter hormonal values from your saliva test"}
              </CardDescription>
            </div>
            {currentStep === 2 && (
              <div className="flex flex-wrap gap-2">
                {autoFillProfiles.map((item) => (
                  <Button
                    key={item.name}
                    variant="outline"
                    size="sm"
                    onClick={() => autoFillExample(item.type)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 0: Basic Details */}
          {currentStep === 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => updateProfile("age", Number.parseInt(e.target.value) || 0)}
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.age}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => updateProfile("height", Number.parseInt(e.target.value) || 0)}
                    className={errors.height ? "border-destructive" : ""}
                  />
                  {errors.height && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.height}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => updateProfile("weight", Number.parseInt(e.target.value) || 0)}
                    className={errors.weight ? "border-destructive" : ""}
                  />
                  {errors.weight && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.weight}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>BMI (auto-calculated)</Label>
                  <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm">
                    {profile.bmi.toFixed(1)} kg/m²
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Label htmlFor="familyHistory" className="text-base">
                    Family History of PCOS
                  </Label>
                  <p className="text-sm text-muted-foreground">Do any of your close relatives have PCOS?</p>
                </div>
                <Switch
                  id="familyHistory"
                  checked={profile.familyHistory}
                  onCheckedChange={(checked) => updateProfile("familyHistory", checked)}
                />
              </div>
            </>
          )}

          {/* Step 1: Clinical Symptoms */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cycleLength">Menstrual Cycle Length (days)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  value={profile.cycleLength}
                  onChange={(e) => updateProfile("cycleLength", Number.parseInt(e.target.value) || 0)}
                  className={errors.cycleLength ? "border-destructive" : ""}
                />
                {errors.cycleLength && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.cycleLength}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Normal range: 21-35 days</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <Label htmlFor="irregularPeriods">Irregular Periods</Label>
                    <p className="text-xs text-muted-foreground">Varying cycle lengths</p>
                  </div>
                  <Switch
                    id="irregularPeriods"
                    checked={profile.irregularPeriods}
                    onCheckedChange={(checked) => updateProfile("irregularPeriods", checked)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <Label htmlFor="missedPeriods">Missed Periods</Label>
                    <p className="text-xs text-muted-foreground">Skip periods frequently</p>
                  </div>
                  <Switch
                    id="missedPeriods"
                    checked={profile.missedPeriods}
                    onCheckedChange={(checked) => updateProfile("missedPeriods", checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Acne Severity (0-3)</Label>
                    <span className="text-sm font-medium text-primary">{profile.acneSeverity}</span>
                  </div>
                  <Slider
                    value={[profile.acneSeverity]}
                    onValueChange={([value]) => updateProfile("acneSeverity", value)}
                    max={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>None</span>
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Excess Hair Growth (0-4)</Label>
                    <span className="text-sm font-medium text-primary">{profile.excessHairGrowth}</span>
                  </div>
                  <Slider
                    value={[profile.excessHairGrowth]}
                    onValueChange={([value]) => updateProfile("excessHairGrowth", value)}
                    max={4}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>None</span>
                    <span>Minimal</span>
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <Label htmlFor="hairFall">Hair Fall</Label>
                  <Switch
                    id="hairFall"
                    checked={profile.hairFall}
                    onCheckedChange={(checked) => updateProfile("hairFall", checked)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <Label htmlFor="darkPatches">Dark Patches</Label>
                  <Switch
                    id="darkPatches"
                    checked={profile.darkPatches}
                    onCheckedChange={(checked) => updateProfile("darkPatches", checked)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <Label htmlFor="moodSwings">Mood Swings</Label>
                  <Switch
                    id="moodSwings"
                    checked={profile.moodSwings}
                    onCheckedChange={(checked) => updateProfile("moodSwings", checked)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Hormonal Values */}
          {currentStep === 2 && (
            <>
              <div className="rounded-lg border border-border bg-muted/50 p-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  Enter hormonal values from your saliva test. If you don't have actual values, use the "Auto-fill
                  Example" button to see how the analysis works with sample data.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="testosterone">Testosterone (ng/dL)</Label>
                  <Input
                    id="testosterone"
                    type="number"
                    step="0.1"
                    value={profile.testosterone}
                    onChange={(e) => updateProfile("testosterone", Number.parseFloat(e.target.value) || 0)}
                    className={errors.testosterone ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 15-70 ng/dL</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amh">AMH (ng/mL)</Label>
                  <Input
                    id="amh"
                    type="number"
                    step="0.1"
                    value={profile.amh}
                    onChange={(e) => updateProfile("amh", Number.parseFloat(e.target.value) || 0)}
                    className={errors.amh ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 1.0-4.0 ng/mL</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lh">LH (mIU/mL)</Label>
                  <Input
                    id="lh"
                    type="number"
                    step="0.1"
                    value={profile.lh}
                    onChange={(e) => updateProfile("lh", Number.parseFloat(e.target.value) || 0)}
                    className={errors.lh ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 2-15 mIU/mL</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fsh">FSH (mIU/mL)</Label>
                  <Input
                    id="fsh"
                    type="number"
                    step="0.1"
                    value={profile.fsh}
                    onChange={(e) => updateProfile("fsh", Number.parseFloat(e.target.value) || 0)}
                    className={errors.fsh ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 3-10 mIU/mL</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>LH/FSH Ratio (auto-calculated)</Label>
                  <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm">
                    {profile.lhFshRatio.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Normal: 1.0-2.0</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cortisol">Cortisol (µg/dL)</Label>
                  <Input
                    id="cortisol"
                    type="number"
                    step="0.1"
                    value={profile.cortisol}
                    onChange={(e) => updateProfile("cortisol", Number.parseFloat(e.target.value) || 0)}
                    className={errors.cortisol ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Normal: 6-23 µg/dL</p>
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            {currentStep < 2 ? (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-2">
                Analyze Risk
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
