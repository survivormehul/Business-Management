"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Task {
  id: number
  title: string
  assignedTo: string
  dueDate: string
  priority: string
  status: string
}

export default function TasksPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
    status: "To Do",
  })
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Update inventory system",
      assignedTo: "John Doe",
      dueDate: "May 22, 2024",
      priority: "High",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Prepare quarterly financial report",
      assignedTo: "Sarah Johnson",
      dueDate: "May 30, 2024",
      priority: "High",
      status: "To Do",
    },
    {
      id: 3,
      title: "Client onboarding - ABC Corp",
      assignedTo: "Michael Chen",
      dueDate: "May 25, 2024",
      priority: "Medium",
      status: "In Progress",
    },
    {
      id: 4,
      title: "Update company website",
      assignedTo: "Emily Wilson",
      dueDate: "June 05, 2024",
      priority: "Medium",
      status: "Review",
    },
    {
      id: 5,
      title: "Staff training session",
      assignedTo: "David Thompson",
      dueDate: "May 28, 2024",
      priority: "Low",
      status: "To Do",
    },
    {
      id: 6,
      title: "Inventory audit",
      assignedTo: "Jessica Martinez",
      dueDate: "May 20, 2024",
      priority: "High",
      status: "Completed",
    },
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTask({
      ...newTask,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewTask({
      ...newTask,
      [name]: value,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert("Please fill in all required fields")
      return
    }

    const newId = Math.max(...tasks.map((task) => task.id)) + 1

    const taskToAdd: Task = {
      id: newId,
      title: newTask.title || "",
      assignedTo: newTask.assignedTo || "",
      dueDate: formatDate(newTask.dueDate || ""),
      priority: newTask.priority || "Medium",
      status: newTask.status || "To Do",
    }

    setTasks([...tasks, taskToAdd])
    setNewTask({
      title: "",
      assignedTo: "",
      dueDate: "",
      priority: "Medium",
      status: "To Do",
    })
    setIsAddDialogOpen(false)
  }

  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-500">Manage and track your team's tasks</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="p-6">
          <h2 className="text-xl font-semibold">All Tasks</h2>
          <p className="text-sm text-gray-500">You have {tasks.length} tasks in total</p>
        </div>

        <div className="flex items-center justify-between px-6 pb-4">
          <div className="relative w-full max-w-sm">
            <Input placeholder="Search tasks..." className="pl-8" />
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
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : task.status === "Review"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Assigned To *
              </Label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date *
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={newTask.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newTask.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
