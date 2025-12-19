"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Activity, Home, LayoutDashboard, Cpu, User } from "lucide-react"
import { useLanguage } from "@/components/language-context"

const navigation = [
  { name: "home", href: "/", icon: Home },
  { name: "analyze", href: "/analyze", icon: Activity },
  { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "device", href: "/device", icon: Cpu },
  { name: "account", href: "/account", icon: User },
]

export function Header() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">PCOS Analysis</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {t(item.name)}
              </Link>
            )
          })}
        </nav>

        {/* Mobile navigation hidden - using bottom nav instead */}
      </div>
    </header>
  )
}
