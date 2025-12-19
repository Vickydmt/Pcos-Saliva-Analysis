"use client"

import type { PCOSProfile, RiskResult } from "@/lib/pcos-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HormoneChart } from "@/components/hormone-chart"
import { RiskFactorsChart } from "@/components/risk-factors-chart"
import { AlertTriangle, CheckCircle, AlertCircle, RefreshCw, Download, Share2 } from "lucide-react"
import Link from "next/link"

interface AnalysisResultsProps {
  profile: PCOSProfile
  result: RiskResult
  onReset: () => void
}

export function AnalysisResults({ profile, result, onReset }: AnalysisResultsProps) {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case "low":
        return {
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success",
          icon: CheckCircle,
          label: "Low Risk",
          description: "Your indicators suggest a low likelihood of PCOS. Continue maintaining a healthy lifestyle.",
        }
      case "moderate":
        return {
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning",
          icon: AlertCircle,
          label: "Moderate Risk",
          description:
            "Some indicators suggest you may be at moderate risk. Consider consulting a healthcare provider.",
        }
      case "high":
        return {
          color: "text-danger",
          bgColor: "bg-danger/10",
          borderColor: "border-danger",
          icon: AlertTriangle,
          label: "High Risk",
          description:
            "Multiple indicators suggest elevated PCOS risk. We strongly recommend consulting a healthcare professional.",
        }
      default:
        return {
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border",
          icon: AlertCircle,
          label: "Unknown",
          description: "",
        }
    }
  }

  const config = getRiskConfig(result.riskLevel)
  const Icon = config.icon

  const handleExportPDF = () => {
    // In a real app, this would generate a PDF report
    alert(
      "PDF export functionality would be implemented here. For now, you can use browser print (Ctrl+P) to save as PDF.",
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "PCOS Risk Assessment Results",
          text: `My PCOS risk assessment: ${config.label} (${result.score.toFixed(0)}% score)`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      alert("Share functionality is not available on this device")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Risk Score Card */}
      <Card className={`${config.borderColor} border-2`}>
        <CardHeader>
          <CardTitle className="text-2xl">Your PCOS Risk Assessment</CardTitle>
          <CardDescription>Based on your symptoms and hormonal markers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Risk Level */}
            <div className={`flex flex-col items-center p-8 rounded-2xl ${config.bgColor}`}>
              <Icon className={`h-16 w-16 ${config.color} mb-4`} />
              <h3 className={`text-3xl font-bold ${config.color}`}>{config.label}</h3>
              <p className="text-sm text-muted-foreground mt-2">Score: {result.score.toFixed(0)}/100</p>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <p className="text-muted-foreground">{config.description}</p>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.riskLevel === "low"
                        ? "bg-success"
                        : result.riskLevel === "moderate"
                          ? "bg-warning"
                          : "bg-danger"
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{result.score.toFixed(0)}%</span>
              </div>

              <p className="text-sm text-muted-foreground">Confidence: {result.confidence.toFixed(0)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Factors Analysis</CardTitle>
            <CardDescription>Contribution of each factor to your risk score</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskFactorsChart factors={result.factors} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hormone Profile</CardTitle>
            <CardDescription>Your hormonal values compared to normal ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <HormoneChart hormoneAnalysis={result.hormoneAnalysis} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>Breakdown of factors influencing your risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.factors.map((factor) => (
              <div key={factor.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      factor.status === "normal"
                        ? "bg-success"
                        : factor.status === "borderline"
                          ? "bg-warning"
                          : "bg-danger"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-foreground">{factor.name}</p>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{factor.contribution.toFixed(0)}%</p>
                  <p
                    className={`text-xs capitalize ${
                      factor.status === "normal"
                        ? "text-success"
                        : factor.status === "borderline"
                          ? "text-warning"
                          : "text-danger"
                    }`}
                  >
                    {factor.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hormone Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hormonal Markers</CardTitle>
          <CardDescription>Detailed view of your hormonal values and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Marker</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Your Value</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Normal Range</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.hormoneAnalysis).map(([key, data]) => (
                  <tr key={key} className="border-b border-border">
                    <td className="py-3 px-4 font-medium capitalize text-foreground">
                      {key === "lhFshRatio" ? "LH/FSH Ratio" : key.toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-foreground">{data.value.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{data.range}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          data.status === "Normal"
                            ? "bg-success/10 text-success"
                            : data.status === "Borderline"
                              ? "bg-warning/10 text-warning"
                              : "bg-danger/10 text-danger"
                        }`}
                      >
                        {data.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button variant="outline" onClick={onReset} className="gap-2 w-full sm:w-auto bg-transparent">
          <RefreshCw className="h-4 w-4" />
          New Analysis
        </Button>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportPDF} className="gap-2 flex-1 sm:flex-initial bg-transparent">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleShare} className="gap-2 flex-1 sm:flex-initial bg-transparent">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button asChild className="gap-2 flex-1 sm:flex-initial">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
