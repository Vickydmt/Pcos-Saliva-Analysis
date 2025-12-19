"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type StoredReport, getStoredReports, deleteReport } from "@/lib/pcos-data"
import { useLanguage } from "@/components/language-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trash2, TrendingUp, TrendingDown, Minus, FileText, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [reports, setReports] = useState<StoredReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    setReports(getStoredReports())
    setIsLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    deleteReport(id)
    setReports(getStoredReports())
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-success"
      case "moderate":
        return "text-warning"
      case "high":
        return "text-danger"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-success/10"
      case "moderate":
        return "bg-warning/10"
      case "high":
        return "bg-danger/10"
      default:
        return "bg-muted"
    }
  }

  const getTrend = () => {
    if (reports.length < 2) return null
    const latest = reports[0].result.score
    const previous = reports[1].result.score
    const diff = latest - previous
    if (Math.abs(diff) < 5) return { icon: Minus, text: t("stable"), color: "text-muted-foreground" }
    if (diff > 0) return { icon: TrendingUp, text: t("increasing"), color: "text-danger" }
    return { icon: TrendingDown, text: t("decreasing"), color: "text-success" }
  }

  const trend = getTrend()

  const chartData = [...reports].reverse().map((report) => ({
    date: new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: report.result.score,
    riskLevel: report.result.riskLevel,
  }))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("dashboard")}</h1>
          <p className="text-muted-foreground">{t("trackRiskScore")}</p>
        </div>

        {reports.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("noReports")}</h3>
              <p className="text-muted-foreground mb-6">{t("noReportsDesc")}</p>
              <Button asChild>
                <Link href="/analyze">{t("startAnalysis")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t("totalAssessments")}</CardDescription>
                  <CardTitle className="text-3xl">{reports.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t("latestRiskLevel")}</CardDescription>
                  <CardTitle className={`text-3xl capitalize ${getRiskColor(reports[0].result.riskLevel)}`}>
                    {t(reports[0].result.riskLevel)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t("trend")}</CardDescription>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {trend ? (
                      <>
                        <trend.icon className={`h-5 w-5 ${trend.color}`} />
                        <span className={trend.color}>{trend.text}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{t("notEnoughData")}</span>
                    )}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Trend Chart */}
            {chartData.length > 1 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{t("riskScoreTrend")}</CardTitle>
                  <CardDescription>{t("trackRiskScore")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                                  <p className="font-medium text-foreground">{data.date}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {t("riskScore")}: {data.score.toFixed(0)}%
                                  </p>
                                  <p className={`text-sm font-medium capitalize ${getRiskColor(data.riskLevel)}`}>
                                    {t(data.riskLevel)} Risk
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={{ fill: "#6366f1", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports List */}
            <Card>
              <CardHeader>
                <CardTitle>{t("assessmentHistory")}</CardTitle>
                <CardDescription>{t("previousAssessments")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${getRiskBgColor(report.result.riskLevel)}`}>
                          <AlertCircle className={`h-5 w-5 ${getRiskColor(report.result.riskLevel)}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {t("riskScore")}: {report.result.score.toFixed(0)}%
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRiskBgColor(report.result.riskLevel)} ${getRiskColor(report.result.riskLevel)}`}
                        >
                          {t(report.result.riskLevel)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(report.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete report</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
