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

interface Invoice {
  id: string
  customer: string
  issueDate: string
  dueDate: string
  amount: number
  status: string
}

export default function InvoicesPage() {
  const isMobile = useMobileView()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    customer: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    amount: 0,
    status: "Pending",
  })
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-2024-001",
      customer: "Acme Corporation",
      issueDate: "May 01, 2024",
      dueDate: "May 15, 2024",
      amount: 2500.0,
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      customer: "Globex Industries",
      issueDate: "May 03, 2024",
      dueDate: "May 17, 2024",
      amount: 1750.0,
      status: "Pending",
    },
    {
      id: "INV-2024-003",
      customer: "Stark Enterprises",
      issueDate: "May 05, 2024",
      dueDate: "May 19, 2024",
      amount: 3200.0,
      status: "Pending",
    },
    {
      id: "INV-2024-004",
      customer: "Wayne Industries",
      issueDate: "Apr 20, 2024",
      dueDate: "May 04, 2024",
      amount: 4500.0,
      status: "Overdue",
    },
    {
      id: "INV-2024-005",
      customer: "Umbrella Corp",
      issueDate: "Apr 25, 2024",
      dueDate: "May 09, 2024",
      amount: 1200.0,
      status: "Overdue",
    },
    {
      id: "INV-2024-006",
      customer: "Cyberdyne Systems",
      issueDate: "May 10, 2024",
      dueDate: "May 24, 2024",
      amount: 2800.0,
      status: "Pending",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices)

  useEffect(() => {
    let result = [...invoices]

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      result = result.filter(
        (invoice) =>
          invoice.customer.toLowerCase().includes(lowerCaseQuery) || invoice.id.toLowerCase().includes(lowerCaseQuery),
      )
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      result = result.filter((invoice) => invoice.status.toLowerCase() === selectedStatus.toLowerCase())
    }

    setFilteredInvoices(result)
  }, [searchQuery, selectedStatus, invoices])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInvoice({
      ...newInvoice,
      [name]: name === "amount" ? Number.parseFloat(value) : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setNewInvoice({
      ...newInvoice,
      status: value,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const handleAddInvoice = () => {
    if (!newInvoice.customer || !newInvoice.dueDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    const invoiceCount = invoices.length + 1
    const newId = `INV-2024-${invoiceCount.toString().padStart(3, "0")}`

    const invoiceToAdd: Invoice = {
      id: newId,
      customer: newInvoice.customer || "",
      issueDate: formatDate(newInvoice.issueDate || new Date().toISOString()),
      dueDate: formatDate(newInvoice.dueDate || ""),
      amount: newInvoice.amount || 0,
      status: newInvoice.status || "Pending",
    }

    setInvoices([...invoices, invoiceToAdd])
    setNewInvoice({
      customer: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      amount: 0,
      status: "Pending",
    })
    setIsAddDialogOpen(false)

    toast({
      variant: "success",
      title: "Success",
      description: "Invoice created successfully",
    })
  }

  const handleExport = () => {
    try {
      // Define custom headers for better readability
      const headers = ["id", "customer", "issueDate", "dueDate", "amount", "status"]

      // Convert data to CSV
      const csvData = objectsToCSV(filteredInvoices.length > 0 ? filteredInvoices : invoices, headers)

      // Download the file
      downloadFile(csvData, "invoices_export.csv", "text/csv")

      toast({
        variant: "success",
        title: "Export Successful",
        description: `${filteredInvoices.length > 0 ? filteredInvoices.length : invoices.length} invoices exported to CSV`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your data",
      })
    }
  }

  // Mobile card view for invoices
  const MobileInvoiceCard = ({ invoice }: { invoice: Invoice }) => (
    <div className="mb-4 rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{invoice.id}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            invoice.status === "Paid"
              ? "bg-green-100 text-green-800"
              : invoice.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {invoice.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Customer</p>
          <p>{invoice.customer}</p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-medium">${invoice.amount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Issue Date</p>
          <p>{invoice.issueDate}</p>
        </div>
        <div>
          <p className="text-gray-500">Due Date</p>
          <p>{invoice.dueDate}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col p-4 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Invoices</h1>
          <p className="text-gray-500">Manage your customer invoices and payments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} size={isMobile ? "sm" : "default"}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold">All Invoices</h2>
          <p className="text-sm text-gray-500">You have {invoices.length} total invoices</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 pb-4">
          <div className="relative w-full md:max-w-sm">
            <Input
              placeholder="Search invoices..."
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
          <Select defaultValue="all" value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isMobile ? (
          <div className="px-4 pb-4">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => <MobileInvoiceCard key={invoice.id} invoice={invoice} />)
            ) : (
              <div className="py-8 text-center text-gray-500">No invoices found.</div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No invoices found.
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
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer *
              </Label>
              <Input
                id="customer"
                name="customer"
                value={newInvoice.customer}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issueDate" className="text-right">
                Issue Date
              </Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={newInvoice.issueDate}
                onChange={handleInputChange}
                className="col-span-3"
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
                value={newInvoice.dueDate}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
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
                value={newInvoice.amount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newInvoice.status} onValueChange={handleSelectChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddInvoice}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
