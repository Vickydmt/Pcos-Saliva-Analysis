"use client"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { FeatureCard } from "@/components/feature-card"
import { Button } from "@/components/ui/button"
import { Droplet, Zap, Shield, Brain, ArrowRight, CheckCircle, Activity } from "lucide-react"
import { useLanguage } from "@/components/language-context"

export default function HomePage() {
  const router = useRouter()
  const { t } = useLanguage()

  const features = [
    {
      icon: Droplet,
      title: t("nonInvasive"),
      description: t("nonInvasiveDesc"),
    },
    {
      icon: Zap,
      title: t("fastResults"),
      description: t("fastResultsDesc"),
    },
    {
      icon: Shield,
      title: t("privacyFirst"),
      description: t("privacyFirstDesc"),
    },
    {
      icon: Brain,
      title: t("aiPowered"),
      description: t("aiPoweredDesc"),
    },
  ]

  const symptoms = [
    t("irregularCycles"),
    t("excessAndrogen"),
    t("polycysticOvaries"),
    t("weightGain"),
    t("acneOily"),
    t("excessHair"),
    t("hairThinning"),
    t("darkPatches"),
  ]

  const handleCheckRisk = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    router.push("/analyze")
  }

  const handleDemoMode = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    router.push("/analyze?demo=true")
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Activity className="h-4 w-4" />
              {t("advancedScreening")}
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
              {t("heroTitle")}
              <span className="text-primary"> {t("heroTitleHighlight")}</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl leading-relaxed max-w-2xl mx-auto text-pretty">
              {t("heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
              <Button 
                type="button"
                size="lg" 
                className="gap-2 px-8 cursor-pointer relative z-30" 
                onClick={handleCheckRisk}
              >
                {t("checkPcosRisk")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant="outline" 
                size="lg" 
                className="gap-2 px-8 bg-transparent cursor-pointer relative z-30" 
                onClick={handleDemoMode}
              >
                {t("tryDemoMode")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">{t("whyChooseSaliva")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("featureDescription")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* What is PCOS Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground">{t("understandingPcos")}</h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">{t("pcosDesc1")}</p>
              <p className="mb-6 text-muted-foreground leading-relaxed">{t("pcosDesc2")}</p>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={handleCheckRisk}>
                {t("startAssessment")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-6 text-xl font-semibold text-foreground">{t("commonSymptoms")}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {symptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">{t("howItWorks")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("howItWorksDesc")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: t("enterData"),
                description: t("enterDataDesc"),
              },
              {
                step: "02",
                title: t("aiAnalysis"),
                description: t("aiAnalysisDesc"),
              },
              {
                step: "03",
                title: t("getResults"),
                description: t("getResultsDesc"),
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl border border-border bg-card p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground">{t("readyToCheck")}</h2>
            <p className="mb-8 text-primary-foreground/80 max-w-2xl mx-auto">{t("ctaDesc")}</p>
            <Button size="lg" variant="secondary" className="gap-2 px-8" onClick={handleCheckRisk}>
              {t("startFreeAssessment")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">{t("footerText")}</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">{t("educationalPurposes")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
