"use client"

import type { HormoneAnalysis } from "@/lib/pcos-data"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"

interface HormoneChartProps {
  hormoneAnalysis: HormoneAnalysis
}

export function HormoneChart({ hormoneAnalysis }: HormoneChartProps) {
  // Normalize values to 0-100 scale for radar chart
  const normalizeValue = (value: number, key: string): number => {
    const ranges: Record<string, { min: number; max: number }> = {
      testosterone: { min: 0, max: 100 },
      amh: { min: 0, max: 15 },
      lh: { min: 0, max: 30 },
      fsh: { min: 0, max: 20 },
      lhFshRatio: { min: 0, max: 5 },
      cortisol: { min: 0, max: 40 },
    }
    const range = ranges[key] || { min: 0, max: 100 }
    return Math.min(100, (value / range.max) * 100)
  }

  const data = Object.entries(hormoneAnalysis).map(([key, value]) => ({
    subject: key === "lhFshRatio" ? "LH/FSH" : key.charAt(0).toUpperCase() + key.slice(1),
    value: normalizeValue(value.value, key),
    fullMark: 100,
    actualValue: value.value,
    status: value.status,
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
          <Radar name="Your Values" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    <p className="font-medium text-foreground">{data.subject}</p>
                    <p className="text-sm text-muted-foreground">Value: {data.actualValue.toFixed(2)}</p>
                    <p
                      className={`text-sm font-medium ${
                        data.status === "Normal"
                          ? "text-success"
                          : data.status === "Borderline"
                            ? "text-warning"
                            : "text-danger"
                      }`}
                    >
                      {data.status}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
