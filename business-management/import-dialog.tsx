"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, FileUp } from "lucide-react"
import { csvToObjects } from "@/utils/csv-utils"

interface ImportDialogProps<T> {
  isOpen: boolean
  onClose: () => void
  onImport: (data: T[]) => void
  validateData?: (data: T[]) => { valid: boolean; message?: string }
  sampleData?: T[]
  title?: string
}

export function ImportDialog<T extends Record<string, any>>({
  isOpen,
  onClose,
  onImport,
  validateData,
  sampleData,
  title = "Import Data",
}: ImportDialogProps<T>) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<T[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please select a CSV file")
        setFile(null)
        setPreview(null)
        return
      }

      setFile(selectedFile)
      setError(null)

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const csvData = event.target?.result as string
          const parsedData = csvToObjects<T>(csvData)

          if (parsedData.length === 0) {
            setError("No data found in the CSV file")
            setPreview(null)
            return
          }

          if (validateData) {
            const validation = validateData(parsedData)
            if (!validation.valid) {
              setError(validation.message || "Invalid data format")
              setPreview(null)
              return
            }
          }

          setPreview(parsedData.slice(0, 3)) // Show preview of first 3 items
        } catch (err) {
          setError("Error parsing CSV file")
          setPreview(null)
        }
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleImport = () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string
        const parsedData = csvToObjects<T>(csvData)

        if (parsedData.length === 0) {
          setError("No data found in the CSV file")
          return
        }

        if (validateData) {
          const validation = validateData(parsedData)
          if (!validation.valid) {
            setError(validation.message || "Invalid data format")
            return
          }
        }

        onImport(parsedData)
        onClose()
      } catch (err) {
        setError("Error parsing CSV file")
      }
    }
    reader.readAsText(file)
  }

  const downloadSample = () => {
    if (!sampleData || sampleData.length === 0) return

    const headers = Object.keys(sampleData[0])
    let csvContent = headers.join(",") + "\n"

    sampleData.forEach((item) => {
      const row = headers.map((header) => {
        const value = item[header] !== undefined ? String(item[header]) : ""
        return value.includes(",") ? `"${value}"` : value
      })
      csvContent += row.join(",") + "\n"
    })

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_import.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setFile(null)
    setPreview(null)
    setError(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetFileInput()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="file">Upload CSV File</Label>
            <Input ref={fileInputRef} id="file" type="file" accept=".csv" onChange={handleFileChange} />
            <p className="text-xs text-gray-500">
              Only CSV files are supported. Make sure your file has the correct format.
            </p>
          </div>

          {sampleData && sampleData.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={downloadSample}>
                Download Sample CSV
              </Button>
            </div>
          )}

          {preview && preview.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-xs overflow-auto max-h-40">
                <pre>{JSON.stringify(preview, null, 2)}</pre>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Showing preview of first {preview.length} items. Total items will be imported:{" "}
                {file ? "Calculating..." : 0}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2 sm:space-x-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || !!error}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
