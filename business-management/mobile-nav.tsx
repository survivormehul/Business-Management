"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  FileText,
  DollarSign,
  CheckSquare,
  Users,
  Calendar,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">OptiSuite</h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <nav className="flex-1 overflow-auto py-2">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium",
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
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 bg-blue-600">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
