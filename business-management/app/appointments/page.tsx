"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarPlus } from "lucide-react"

export default function AppointmentsPage() {
  const appointments = [
    {
      id: 1,
      title: "Client Meeting - ABC Corp",
      customer: "John Smith - ABC Corp",
      staff: "Sarah Johnson",
      date: "May 20, 2024",
      time: "10:00 AM - 11:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      title: "Product Demo - XYZ Inc",
      customer: "Jane Doe - XYZ Inc",
      staff: "Michael Chen",
      date: "May 21, 2024",
      time: "2:00 PM - 3:30 PM",
      status: "Scheduled",
    },
    {
      id: 3,
      title: "Consultation - New Client",
      customer: "Robert Johnson",
      staff: "Emily Wilson",
      date: "May 22, 2024",
      time: "9:30 AM - 10:30 AM",
      status: "Scheduled",
    },
    {
      id: 4,
      title: "Follow-up Meeting",
      customer: "Alice Williams - Tech Solutions",
      staff: "David Thompson",
      date: "May 19, 2024",
      time: "3:00 PM - 4:00 PM",
      status: "Completed",
    },
    {
      id: 5,
      title: "Project Review",
      customer: "Mark Johnson - Acme Inc",
      staff: "Jessica Martinez",
      date: "May 23, 2024",
      time: "11:00 AM - 12:00 PM",
      status: "Scheduled",
    },
    {
      id: 6,
      title: "Sales Presentation",
      customer: "Thomas Brown - Global Corp",
      staff: "Michael Chen",
      date: "May 24, 2024",
      time: "1:00 PM - 2:30 PM",
      status: "Scheduled",
    },
  ]

  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-500">Schedule and manage your appointments</p>
        </div>
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="p-6">
          <h2 className="text-xl font-semibold">All Appointments</h2>
          <p className="text-sm text-gray-500">You have {appointments.length} scheduled appointments</p>
        </div>

        <div className="flex items-center justify-between px-6 pb-4">
          <div className="relative w-full max-w-sm">
            <Input placeholder="Search appointments..." className="pl-8" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.title}</TableCell>
                  <TableCell>{appointment.customer}</TableCell>
                  <TableCell>{appointment.staff}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "Scheduled"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
