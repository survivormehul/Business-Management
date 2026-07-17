"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Calendar, DollarSign, Package, CheckSquare, Users } from "lucide-react"
import { useMobileView } from "@/hooks/use-mobile-view"

export default function Dashboard() {
  const isMobile = useMobileView()

  const data = [
    { name: "Jan", revenue: 4000, expenses: 2400 },
    { name: "Feb", revenue: 3000, expenses: 1398 },
    { name: "Mar", revenue: 9800, expenses: 2000 },
    { name: "Apr", revenue: 3908, expenses: 2780 },
    { name: "May", revenue: 4800, expenses: 1890 },
    { name: "Jun", revenue: 3800, expenses: 2390 },
    { name: "Jul", revenue: 4300, expenses: 3490 },
  ]

  const recentSales = [
    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: 1999.0 },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: 1499.0 },
    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: 1299.0 },
    { name: "William Kim", email: "will.kim@email.com", amount: 999.0 },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      title: "Client Meeting - ABC Corp",
      date: "Today",
      time: "2:00 PM",
    },
    {
      id: 2,
      title: "Product Demo - XYZ Inc",
      date: "Tomorrow",
      time: "10:30 AM",
    },
    {
      id: 3,
      title: "Team Sync",
      date: "May 22, 2024",
      time: "9:00 AM",
    },
  ]

  const recentExpenses = [
    {
      id: 1,
      description: "Office Supplies",
      category: "Operations",
      date: "Today",
      amount: 235.89,
    },
    {
      id: 2,
      description: "Software Subscription",
      category: "Technology",
      date: "Yesterday",
      amount: 89.0,
    },
    {
      id: 3,
      description: "Client Lunch",
      category: "Entertainment",
      date: "May 18, 2024",
      amount: 124.5,
    },
  ]

  const activityLog = [
    {
      id: 1,
      action: "New invoice created",
      time: "2 hours ago",
      user: "John Doe",
    },
    {
      id: 2,
      action: "Inventory updated",
      time: "5 hours ago",
      user: "Sarah Johnson",
    },
    {
      id: 3,
      action: "New customer added",
      time: "Yesterday",
      user: "Michael Chen",
    },
  ]

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">Revenue: ${payload[0].value}</p>
          <p className="text-sm text-red-600">Expenses: ${payload[1].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-gray-500">Monthly revenue</p>
            <p className="text-xs text-green-500 mt-1">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">2,350</div>
            <p className="text-xs text-gray-500">Active customers</p>
            <p className="text-xs text-green-500 mt-1">+180 new customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">584</div>
            <p className="text-xs text-gray-500">In stock</p>
            <p className="text-xs text-red-500 mt-1">-12 items this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">Tasks to complete</p>
            <p className="text-xs text-green-500 mt-1">+5 new tasks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={isMobile ? "" : "col-span-2"}>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-60 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {!isMobile && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentSales.map((sale, i) => (
                  <div key={i} className="flex items-center">
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{sale.name}</p>
                      <p className="text-xs text-gray-500">{sale.email}</p>
                    </div>
                    <div className="font-medium">+${sale.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.title}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{appointment.date}</span>
                      <span className="mx-1">•</span>
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{expense.date}</span>
                      <span className="mx-1">•</span>
                      <span>{expense.category}</span>
                    </div>
                  </div>
                  <div className="font-medium">${expense.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLog.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{activity.action}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{activity.time}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
