"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, FileDown, FileUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useMobileView } from "@/hooks/use-mobile-view"
import { useToast } from "@/hooks/use-toast"
import { objectsToCSV, downloadFile } from "@/utils/csv-utils"
import { ImportDialog } from "@/components/import-dialog"

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  quantity: number
  price: number
  status: string
}

export default function InventoryPage() {
  const isMobile = useMobileView()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    sku: "",
    category: "Electronics",
    quantity: 0,
    price: 0,
  })
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Dell XPS 13 Laptop",
      sku: "DELL-XPS13-001",
      category: "Electronics",
      quantity: 24,
      price: 1299.99,
      status: "In Stock",
    },
    {
      id: 2,
      name: "HP LaserJet Printer",
      sku: "HP-LJ-2022",
      category: "Electronics",
      quantity: 12,
      price: 349.99,
      status: "In Stock",
    },
    {
      id: 3,
      name: "Office Desk Chair",
      sku: "FRN-CHAIR-001",
      category: "Furniture",
      quantity: 8,
      price: 199.99,
      status: "In Stock",
    },
    {
      id: 4,
      name: "Apple iPad Pro",
      sku: "APL-IPAD-2022",
      category: "Electronics",
      quantity: 15,
      price: 799.99,
      status: "In Stock",
    },
    {
      id: 5,
      name: "Whiteboard - Large",
      sku: "OFF-WB-L",
      category: "Office Supplies",
      quantity: 3,
      price: 129.99,
      status: "In Stock",
    },
    {
      id: 6,
      name: "Logitech MX Master Mouse",
      sku: "LOG-MX-2022",
      category: "Electronics",
      quantity: 0,
      price: 99.99,
      status: "Out of Stock",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(inventoryItems)

  useEffect(() => {
    let result = [...inventoryItems]

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      result = result.filter(
        (item) => item.name.toLowerCase().includes(lowerCaseQuery) || item.sku.toLowerCase().includes(lowerCaseQuery),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    setFilteredItems(result)
  }, [searchQuery, selectedCategory, inventoryItems])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem({
      ...newItem,
      [name]: name === "quantity" || name === "price" ? Number.parseFloat(value) : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setNewItem({
      ...newItem,
      category: value,
    })
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    const newId = Math.max(...inventoryItems.map((item) => item.id)) + 1
    const status = (newItem.quantity || 0) > 0 ? "In Stock" : "Out of Stock"

    const itemToAdd: InventoryItem = {
      id: newId,
      name: newItem.name || "",
      sku: newItem.sku || "",
      category: newItem.category || "Electronics",
      quantity: newItem.quantity || 0,
      price: newItem.price || 0,
      status,
    }

    setInventoryItems([...inventoryItems, itemToAdd])
    setNewItem({
      name: "",
      sku: "",
      category: "Electronics",
      quantity: 0,
      price: 0,
    })
    setIsAddDialogOpen(false)

    toast({
      variant: "success",
      title: "Success",
      description: "Inventory item added successfully",
    })
  }

  const handleExport = () => {
    try {
      // Define custom headers for better readability
      const headers = ["id", "name", "sku", "category", "quantity", "price", "status"]

      // Convert data to CSV
      const csvData = objectsToCSV(filteredItems.length > 0 ? filteredItems : inventoryItems, headers)

      // Download the file
      downloadFile(csvData, "inventory_export.csv", "text/csv")

      toast({
        variant: "success",
        title: "Export Successful",
        description: `${filteredItems.length > 0 ? filteredItems.length : inventoryItems.length} items exported to CSV`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your data",
      })
    }
  }

  const validateImportData = (data: Partial<InventoryItem>[]) => {
    // Check if required fields are present
    for (const item of data) {
      if (!item.name || !item.sku) {
        return {
          valid: false,
          message: "All items must have a name and SKU",
        }
      }

      // Validate numeric fields
      if (
        (item.quantity !== undefined && isNaN(Number(item.quantity))) ||
        (item.price !== undefined && isNaN(Number(item.price)))
      ) {
        return {
          valid: false,
          message: "Quantity and price must be numbers",
        }
      }
    }

    return { valid: true }
  }

  const handleImport = (data: Partial<InventoryItem>[]) => {
    try {
      // Process the imported data
      const newItems: InventoryItem[] = data.map((item, index) => {
        const newId = Math.max(...inventoryItems.map((item) => item.id)) + index + 1
        const status = (item.quantity || 0) > 0 ? "In Stock" : "Out of Stock"

        return {
          id: newId,
          name: item.name || "",
          sku: item.sku || "",
          category: item.category || "Electronics",
          quantity: item.quantity || 0,
          price: item.price || 0,
          status,
        }
      })

      // Add the new items to the inventory
      setInventoryItems([...inventoryItems, ...newItems])

      toast({
        variant: "success",
        title: "Import Successful",
        description: `${newItems.length} items imported successfully`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "There was an error importing your data",
      })
    }
  }

  // Sample data for import template
  const sampleImportData: Partial<InventoryItem>[] = [
    {
      name: "Sample Product 1",
      sku: "SAMPLE-001",
      category: "Electronics",
      quantity: 10,
      price: 99.99,
    },
    {
      name: "Sample Product 2",
      sku: "SAMPLE-002",
      category: "Furniture",
      quantity: 5,
      price: 199.99,
    },
  ]

  // Mobile card view for inventory items
  const MobileInventoryCard = ({ item }: { item: InventoryItem }) => (
    <div className="mb-4 rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{item.name}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.status === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {item.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">SKU</p>
          <p>{item.sku}</p>
        </div>
        <div>
          <p className="text-gray-500">Category</p>
          <p>{item.category}</p>
        </div>
        <div>
          <p className="text-gray-500">Quantity</p>
          <p>{item.quantity}</p>
        </div>
        <div>
          <p className="text-gray-500">Price</p>
          <p>${item.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col p-4 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Inventory</h1>
          <p className="text-gray-500">Manage your inventory items and stock levels</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} size={isMobile ? "sm" : "default"}>
            <Package className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold">Inventory Items</h2>
          <p className="text-sm text-gray-500">You have {inventoryItems.length} items in your inventory</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 pb-4">
          <div className="relative w-full md:max-w-sm">
            <Input
              placeholder="Search items..."
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
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="office supplies">Office Supplies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isMobile ? (
          <div className="px-4 pb-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => <MobileInventoryCard key={item.id} item={item} />)
            ) : (
              <div className="py-8 text-center text-gray-500">No items found.</div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No items found.
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
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU *
              </Label>
              <Input
                id="sku"
                name="sku"
                value={newItem.sku}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={newItem.category} onValueChange={handleSelectChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newItem.quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportDialog<Partial<InventoryItem>>
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImport}
        validateData={validateImportData}
        sampleData={sampleImportData}
        title="Import Inventory Items"
      />
    </div>
  )
}
