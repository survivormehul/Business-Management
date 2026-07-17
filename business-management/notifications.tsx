"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Invoice Paid",
      description: "Acme Corporation paid invoice #INV-2024-001",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Low Stock Alert",
      description: "Whiteboard - Large is running low on stock (3 remaining)",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Task Completed",
      description: "Jessica Martinez completed 'Inventory audit'",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 4,
      title: "New Customer",
      description: "Michael Chen added a new customer: Tech Solutions",
      time: "Yesterday",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="cursor-pointer p-4 focus:bg-gray-100"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-2">
                <div className="mt-1">
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.description}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
