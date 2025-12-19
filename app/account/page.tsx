"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"
import { useLanguage } from "@/components/language-context"
import { LANGUAGES, type Language } from "@/lib/i18n"
import { User, LogOut, Globe, Mail, Lock, UserPlus, LogIn, Check } from "lucide-react"

export default function AccountPage() {
  const { user, isAuthenticated, login, register, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError(t("emailRequired"))
      return
    }
    if (!password) {
      setError(t("passwordRequired"))
      return
    }

    const result = login(email, password)
    if (result.success) {
      setSuccess(t("loginSuccess"))
      setEmail("")
      setPassword("")
    } else {
      setError(result.error || t("invalidCredentials"))
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError(t("emailRequired"))
      return
    }
    if (!password) {
      setError(t("passwordRequired"))
      return
    }
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"))
      return
    }

    const result = register(email, password, name || email.split("@")[0])
    if (result.success) {
      setSuccess(t("registerSuccess"))
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setName("")
    } else {
      setError(result.error || "Registration failed")
    }
  }

  const handleLogout = () => {
    logout()
    setSuccess("")
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("accountSettings")}</h1>
          <p className="text-muted-foreground">{t("settings")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile / Auth Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t("profile")}
              </CardTitle>
              <CardDescription>{isAuthenticated ? user?.email : t("guest")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Tab Toggle */}
                  <div className="flex rounded-lg bg-muted p-1">
                    <button
                      onClick={() => {
                        setMode("login")
                        setError("")
                        setSuccess("")
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        mode === "login"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <LogIn className="h-4 w-4" />
                      {t("login")}
                    </button>
                    <button
                      onClick={() => {
                        setMode("register")
                        setError("")
                        setSuccess("")
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        mode === "register"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                      {t("register")}
                    </button>
                  </div>

                  {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

                  {success && <div className="p-3 rounded-lg bg-success/10 text-success text-sm">{success}</div>}

                  <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
                    {mode === "register" && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="test@example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t("password")}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="password123"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {mode === "register" && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="password123"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full">
                      {mode === "login" ? t("login") : t("register")}
                    </Button>
                  </form>

                  <div className="text-center text-sm text-muted-foreground">
                    {mode === "login" ? (
                      <p>
                        {t("dontHaveAccount")}{" "}
                        <button
                          onClick={() => {
                            setMode("register")
                            setError("")
                            setSuccess("")
                          }}
                          className="text-primary hover:underline"
                        >
                          {t("register")}
                        </button>
                      </p>
                    ) : (
                      <p>
                        {t("alreadyHaveAccount")}{" "}
                        <button
                          onClick={() => {
                            setMode("login")
                            setError("")
                            setSuccess("")
                          }}
                          className="text-primary hover:underline"
                        >
                          {t("login")}
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Test credentials hint */}
                  <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Test Credentials:</p>
                    <p>Email: test@example.com</p>
                    <p>Password: password123</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                {t("language")}
              </CardTitle>
              <CardDescription>{t("selectLanguage")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      language === lang.code ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.nativeName}</span>
                      <span className="text-sm text-muted-foreground">({lang.name})</span>
                    </div>
                    {language === lang.code && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
