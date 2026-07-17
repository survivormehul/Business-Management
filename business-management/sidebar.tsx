"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, FileText, DollarSign, CheckSquare, Users, Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useMobileView } from "@/hooks/use-mobile-view"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobileView()

  // Don't render the sidebar on mobile
  if (isMobile) {
    return null
  }

  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Invoices",
      path: "/invoices",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      name: "Staff",
      path: "/staff",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="hidden md:flex h-full w-60 flex-col border-r bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold">OptiSuite</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "flex items-center rounded-md px-3 py-3 text-sm font-medium",
              pathname === route.path
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
            )}
          >
            {route.icon}
            <span className="ml-3">{route.name}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t p-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-blue-600">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
