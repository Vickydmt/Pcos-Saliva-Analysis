"use client"

import type { RiskFactor } from "@/lib/pcos-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface RiskFactorsChartProps {
  factors: RiskFactor[]
}

export function RiskFactorsChart({ factors }: RiskFactorsChartProps) {
  const data = factors.map((factor) => ({
    name: factor.name,
    contribution: factor.contribution,
    status: factor.status,
  }))

  const getBarColor = (status: string) => {
    switch (status) {
      case "normal":
        return "#10b981"
      case "borderline":
        return "#f59e0b"
      case "abnormal":
        return "#ef4444"
      default:
        return "#6366f1"
    }
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis dataKey="name" type="category" width={120} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    <p className="font-medium text-foreground">{data.name}</p>
                    <p className="text-sm text-muted-foreground">Contribution: {data.contribution.toFixed(0)}%</p>
                    <p
                      className={`text-sm font-medium capitalize ${
                        data.status === "normal"
                          ? "text-success"
                          : data.status === "borderline"
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
          <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
