"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Notifications } from "@/components/notifications"
import { MobileNav } from "@/components/mobile-nav"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <div className="hidden md:block md:w-full md:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search..." className="w-full bg-gray-50 pl-8 dark:bg-gray-800" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="md:hidden">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <Notifications />
        <ThemeToggle />
      </div>
    </header>
  )
}
