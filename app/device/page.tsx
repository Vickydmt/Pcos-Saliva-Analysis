"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-context"
import {
  Cpu,
  Wifi,
  WifiOff,
  Bluetooth,
  Activity,
  Droplet,
  ThermometerSun,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"

interface SensorData {
  name: string
  value: string
  unit: string
  status: "pending" | "reading" | "complete"
  icon: React.ComponentType<{ className?: string }>
}

export default function DevicePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [connectionType, setConnectionType] = useState<"wifi" | "bluetooth" | null>(null)
  const [sensorData, setSensorData] = useState<SensorData[]>([
    { name: "Testosterone", value: "--", unit: "ng/dL", status: "pending", icon: Droplet },
    { name: "AMH", value: "--", unit: "ng/mL", status: "pending", icon: Droplet },
    { name: "LH", value: "--", unit: "mIU/mL", status: "pending", icon: Droplet },
    { name: "FSH", value: "--", unit: "mIU/mL", status: "pending", icon: Droplet },
    { name: "Cortisol", value: "--", unit: "µg/dL", status: "pending", icon: Droplet },
    { name: "Sample Temp", value: "--", unit: "°C", status: "pending", icon: ThermometerSun },
  ])
  const { t } = useLanguage()

  const handleScan = (type: "wifi" | "bluetooth") => {
    setIsScanning(true)
    setConnectionType(type)

    setTimeout(() => {
      setIsScanning(false)
    }, 3000)
  }

  const simulateConnection = () => {
    setIsConnected(true)

    const values = ["42.5", "3.8", "8.2", "5.5", "14.3", "37.2"]
    let index = 0

    const interval = setInterval(() => {
      if (index < sensorData.length) {
        setSensorData((prev) =>
          prev.map((sensor, i) =>
            i === index
              ? { ...sensor, status: "reading" }
              : i < index
                ? { ...sensor, status: "complete", value: values[i] }
                : sensor,
          ),
        )
        index++
      } else {
        setSensorData((prev) =>
          prev.map((sensor, i) => ({
            ...sensor,
            status: "complete",
            value: values[i],
          })),
        )
        clearInterval(interval)
      }
    }, 1000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectionType(null)
    setSensorData((prev) => prev.map((sensor) => ({ ...sensor, value: "--", status: "pending" })))
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("deviceIntegration")}</h1>
          <p className="text-muted-foreground">{t("connectDevice")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                {t("deviceStatus")}
              </CardTitle>
              <CardDescription>{t("currentConnectionStatus")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div
                    className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
                      isConnected ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    {isConnected ? (
                      <CheckCircle className="h-12 w-12 text-success" />
                    ) : (
                      <WifiOff className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isConnected ? t("deviceConnected") : t("noDeviceConnected")}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isConnected
                      ? `${t("connectedVia")} ${connectionType === "wifi" ? "Wi-Fi" : "Bluetooth"}`
                      : t("connectMessage")}
                  </p>
                  {isConnected ? (
                    <Button variant="destructive" onClick={handleDisconnect}>
                      {t("disconnect")}
                    </Button>
                  ) : (
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleScan("wifi")}
                        disabled={isScanning}
                        className="gap-2"
                      >
                        {isScanning && connectionType === "wifi" ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wifi className="h-4 w-4" />
                        )}
                        Wi-Fi
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleScan("bluetooth")}
                        disabled={isScanning}
                        className="gap-2"
                      >
                        {isScanning && connectionType === "bluetooth" ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Bluetooth className="h-4 w-4" />
                        )}
                        Bluetooth
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sensor Readings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t("liveSensorData")}
              </CardTitle>
              <CardDescription>{t("realtimeReadings")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sensorData.map((sensor) => {
                  const Icon = sensor.icon
                  return (
                    <div
                      key={sensor.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">{sensor.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-foreground">{sensor.value}</span>
                        <span className="text-sm text-muted-foreground">{sensor.unit}</span>
                        {sensor.status === "reading" && <RefreshCw className="h-4 w-4 text-primary animate-spin" />}
                        {sensor.status === "complete" && <CheckCircle className="h-4 w-4 text-success" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Future Device Integration</CardTitle>
              <CardDescription>How the microfluidic saliva analyzer will work with this platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Droplet className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Sample Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    Collect saliva sample using the provided collection kit and insert into the analyzer
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Cpu className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Microfluidic Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    The device analyzes hormone levels using advanced microfluidic biosensors
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Instant Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Readings are transmitted wirelessly to the app for immediate PCOS risk analysis
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Coming Soon</h4>
                    <p className="text-sm text-muted-foreground">
                      The physical microfluidic saliva analyzer device is currently in development. For now, you can
                      manually enter your hormone values from traditional lab tests or use our demo mode to explore the
                      platform's capabilities.
                    </p>
                  </div>
                </div>
              </div>

              {!isConnected && (
                <div className="mt-6 text-center">
                  <Button onClick={simulateConnection} className="gap-2">
                    <Activity className="h-4 w-4" />
                    {t("simulateDevice")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technical Specs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>Planned specifications for the microfluidic saliva analyzer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Sample Volume", value: "50 µL" },
                  { label: "Analysis Time", value: "< 15 min" },
                  { label: "Connectivity", value: "Wi-Fi / BLE 5.0" },
                  { label: "Battery Life", value: "50+ tests" },
                  { label: "Accuracy", value: "> 95%" },
                  { label: "Storage", value: "100 results" },
                  { label: "Dimensions", value: "120 x 80 x 25 mm" },
                  { label: "Weight", value: "< 150g" },
                ].map((spec) => (
                  <div key={spec.label} className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">{spec.label}</p>
                    <p className="text-lg font-semibold text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
