"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Activity, LayoutDashboard, Cpu, User } from "lucide-react"
import { useLanguage } from "@/components/language-context"

const navigation = [
  { name: "home", href: "/", icon: Home },
  { name: "analyze", href: "/analyze", icon: Activity },
  { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "device", href: "/device", icon: Cpu },
  { name: "account", href: "/account", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="text-[10px] font-medium">{t(item.name)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
