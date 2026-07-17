"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, FilePlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useMobileView } from "@/hooks/use-mobile-view"
import { useToast } from "@/hooks/use-toast"
import { objectsToCSV, downloadFile } from "@/utils/csv-utils"

interface Expense {
  id: number
  description: string
  category: string
  date: string
  paymentMethod: string
  amount: number
  status: string
}

export default function ExpensesPage() {
  const isMobile = useMobileView()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    description: "",
    category: "Rent",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Credit Card",
    amount: 0,
    status: "Pending",
  })
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      description: "Office Rent - May",
      category: "Rent",
      date: "May 01, 2024",
      paymentMethod: "Bank Transfer",
      amount: 2500.0,
      status: "Approved",
    },
    {
      id: 2,
      description: "Electricity Bill",
      category: "Utilities",
      date: "May 05, 2024",
      paymentMethod: "Credit Card",
      amount: 350.75,
      status: "Approved",
    },
    {
      id: 3,
      description: "Office Supplies",
      category: "Supplies",
      date: "May 08, 2024",
      paymentMethod: "Credit Card",
      amount: 125.49,
      status: "Pending",
    },
    {
      id: 4,
      description: "Client Dinner",
      category: "Entertainment",
      date: "May 10, 2024",
      paymentMethod: "Credit Card",
      amount: 215.8,
      status: "Pending",
    },
    {
      id: 5,
      description: "Software Subscription",
      category: "Software",
      date: "May 12, 2024",
      paymentMethod: "Credit Card",
      amount: 89.99,
      status: "Approved",
    },
    {
      id: 6,
      description: "Business Trip - Hotel",
      category: "Travel",
      date: "May 15, 2024",
      paymentMethod: "Company Card",
      amount: 450.0,
      status: "Rejected",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses)

  useEffect(() => {
    let result = [...expenses]

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      result = result.filter(
        (expense) =>
          expense.description.toLowerCase().includes(lowerCaseQuery) ||
          expense.category.toLowerCase().includes(lowerCaseQuery),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((expense) => expense.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    setFilteredExpenses(result)
  }, [searchQuery, selectedCategory, expenses])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewExpense({
      ...newExpense,
      [name]: name === "amount" ? Number.parseFloat(value) : value,
    })
  }

  const handleSelectChange = (field: string, value: string) => {
    setNewExpense({
      ...newExpense,
      [field]: value,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    const newId = Math.max(...expenses.map((expense) => expense.id)) + 1

    const expenseToAdd: Expense = {
      id: newId,
      description: newExpense.description || "",
      category: newExpense.category || "Rent",
      date: formatDate(newExpense.date || new Date().toISOString()),
      paymentMethod: newExpense.paymentMethod || "Credit Card",
      amount: newExpense.amount || 0,
      status: newExpense.status || "Pending",
    }

    setExpenses([...expenses, expenseToAdd])
    setNewExpense({
      description: "",
      category: "Rent",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Credit Card",
      amount: 0,
      status: "Pending",
    })
    setIsAddDialogOpen(false)

    toast({
      variant: "success",
      title: "Success",
      description: "Expense added successfully",
    })
  }

  const handleExport = () => {
    try {
      // Define custom headers for better readability
      const headers = ["id", "description", "category", "date", "paymentMethod", "amount", "status"]

      // Convert data to CSV
      const csvData = objectsToCSV(filteredExpenses.length > 0 ? filteredExpenses : expenses, headers)

      // Download the file
      downloadFile(csvData, "expenses_export.csv", "text/csv")

      toast({
        variant: "success",
        title: "Export Successful",
        description: `${filteredExpenses.length > 0 ? filteredExpenses.length : expenses.length} expenses exported to CSV`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your data",
      })
    }
  }

  // Mobile card view for expenses
  const MobileExpenseCard = ({ expense }: { expense: Expense }) => (
    <div className="mb-4 rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{expense.description}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            expense.status === "Approved"
              ? "bg-green-100 text-green-800"
              : expense.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {expense.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Category</p>
          <p>{expense.category}</p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-medium">${expense.amount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Date</p>
          <p>{expense.date}</p>
        </div>
        <div>
          <p className="text-gray-500">Payment Method</p>
          <p>{expense.paymentMethod}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col p-4 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Expenses</h1>
          <p className="text-gray-500">Track and manage your business expenses</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} size={isMobile ? "sm" : "default"}>
            <FilePlus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold">All Expenses</h2>
          <p className="text-sm text-gray-500">You have {expenses.length} recorded expenses</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 pb-4">
          <div className="relative w-full md:max-w-sm">
            <Input
              placeholder="Search expenses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
          <Select defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="supplies">Supplies</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isMobile ? (
          <div className="px-4 pb-4">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => <MobileExpenseCard key={expense.id} expense={expense} />)
            ) : (
              <div className="py-8 text-center text-gray-500">No expenses found.</div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.paymentMethod}</TableCell>
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            expense.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : expense.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {expense.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No expenses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description *
              </Label>
              <Input
                id="description"
                name="description"
                value={newExpense.description}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={newExpense.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date *
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newExpense.date}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">
                Payment Method
              </Label>
              <Select
                value={newExpense.paymentMethod}
                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Company Card">Company Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount ($)
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newExpense.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
