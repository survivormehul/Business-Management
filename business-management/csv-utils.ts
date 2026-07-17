/**
 * Converts an array of objects to a CSV string
 * @param data Array of objects to convert
 * @param headers Optional custom headers (if not provided, will use object keys)
 * @returns CSV string
 */
export function objectsToCSV<T extends Record<string, any>>(data: T[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return ""
  }

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0])

  // Create header row
  let csvString = csvHeaders.join(",") + "\n"

  // Add data rows
  data.forEach((item) => {
    const row = csvHeaders.map((header) => {
      // Handle values that might contain commas or quotes
      const value = item[header] !== undefined ? String(item[header]) : ""
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csvString += row.join(",") + "\n"
  })

  return csvString
}

/**
 * Parses a CSV string into an array of objects
 * @param csvString CSV string to parse
 * @param headers Optional custom headers (if not provided, will use first row)
 * @returns Array of objects
 */
export function csvToObjects<T extends Record<string, any>>(csvString: string, headers?: string[]): T[] {
  if (!csvString) {
    return []
  }

  // Split into rows
  const rows = csvString.split(/\r?\n/).filter((row) => row.trim() !== "")
  if (rows.length === 0) {
    return []
  }

  // Get headers from first row or use provided headers
  const csvHeaders = headers || parseCSVRow(rows[0])

  // Parse data rows
  const data: T[] = []
  for (let i = headers ? 0 : 1; i < rows.length; i++) {
    const values = parseCSVRow(rows[i])
    if (values.length === csvHeaders.length) {
      const obj: Record<string, any> = {}
      csvHeaders.forEach((header, index) => {
        // Try to convert to number if possible
        const value = values[index]
        obj[header] = !isNaN(Number(value)) && value !== "" ? Number(value) : value
      })
      data.push(obj as T)
    }
  }

  return data
}

/**
 * Parses a CSV row, handling quoted values
 * @param row CSV row to parse
 * @returns Array of values
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]

    if (char === '"') {
      // Check if this is an escaped quote
      if (i + 1 < row.length && row[i + 1] === '"') {
        current += '"'
        i++ // Skip the next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  // Add the last value
  result.push(current)

  return result
}

/**
 * Downloads a string as a file
 * @param content Content to download
 * @param fileName Name of the file
 * @param contentType Content type of the file
 */
export function downloadFile(content: string, fileName: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()

  URL.revokeObjectURL(url)
}
