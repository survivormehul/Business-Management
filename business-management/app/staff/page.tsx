"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus } from "lucide-react"

export default function StaffPage() {
  const staffMembers = [
    {
      id: 1,
      name: "John Doe",
      position: "CEO",
      department: "Executive",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "CFO",
      department: "Finance",
      email: "sarah.johnson@example.com",
      phone: "(555) 234-5678",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "CTO",
      department: "Engineering",
      email: "michael.chen@example.com",
      phone: "(555) 345-6789",
      status: "Active",
    },
    {
      id: 4,
      name: "Emily Wilson",
      position: "Marketing Director",
      department: "Marketing",
      email: "emily.wilson@example.com",
      phone: "(555) 456-7890",
      status: "Active",
    },
    {
      id: 5,
      name: "David Thompson",
      position: "Operations Manager",
      department: "Operations",
      email: "david.thompson@example.com",
      phone: "(555) 567-8901",
      status: "Active",
    },
    {
      id: 6,
      name: "Jessica Martinez",
      position: "HR Manager",
      department: "Human Resources",
      email: "jessica.martinez@example.com",
      phone: "(555) 678-9012",
      status: "Active",
    },
  ]

  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff</h1>
          <p className="text-gray-500">Manage your team members and their roles</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="p-6">
          <h2 className="text-xl font-semibold">All Staff</h2>
          <p className="text-sm text-gray-500">You have {staffMembers.length} team members</p>
        </div>

        <div className="flex items-center justify-between px-6 pb-4">
          <div className="relative w-full max-w-sm">
            <Input placeholder="Search staff..." className="pl-8" />
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
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="hr">Human Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{staff.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {staff.status}
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
