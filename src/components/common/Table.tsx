"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSidebar } from "@/context/SidebarContext"

interface TableColumn<T> {
  key: keyof T
  label: string
  additionalClass?: string // 👈 NEW: specify column width
  hiddenKey?: string // 👈 NEW: store value but don't render the column
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  apiEndpoint: string
  pageSize?: number
  renderActions?: (row: T) => React.ReactNode
  actionsColumnFixed?: boolean // 👈 NEW: sticky right actions column
  actionsColumnWidth?: string // 👈 NEW: width for actions column
  emptyValue?: string
}

export default function Table<T>({
  columns,
  apiEndpoint,
  pageSize = 10,
  renderActions,
  actionsColumnFixed = false,
  actionsColumnWidth = "120px",
  emptyValue = "-",
}: TableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const { isExpanded, isHovered } = useSidebar()

  const mainContentMargin = isExpanded || isHovered ? "lg:w-[71vw] " : "lg:w-[85vw]"
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page")) || 1

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiEndpoint}?page=${page}&limit=${pageSize}`)
      const result = await res.json()
      setData(result?.data || result?.products || [])
      setTotalPages(result?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`)
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className={`overflow-x-auto border relative ${mainContentMargin}`}>
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-900 font-semibold text-sm">
            <tr>
              {columns
                .filter((col) => !col.hiddenKey)
                .map((col) => (
                  <th
                    key={String(col.key)}
                    className={`px-4 py-2 border-b whitespace-nowrap ${col?.additionalClass || ""}`}
                  >
                    {col.label}
                  </th>
                ))}

              {renderActions && (
                <th
                  className={`px-4 py-2 border-b text-center bg-gray-100 ${
                    actionsColumnFixed ? "sticky right-0 shadow-md z-10" : ""
                  }`}
                  style={{ width: actionsColumnWidth }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="dark:text-white/90">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns
                    .filter((col) => !col.hiddenKey)
                    .map((col) => (
                      <td key={String(col.key)} className="p-3 border">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      </td>
                    ))}
                  {renderActions && (
                    <td
                      className={`p-3 border
                        ${actionsColumnFixed ? "sticky right-0 shadow-md z-10" : ""}`}
                    >
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="text-center py-6 text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={(item as any)._id || JSON.stringify(item)} className="hover:bg-gray-50">
                  {columns.map((col) => {
                    // If hiddenKey is present, skip rendering
                    if (col.hiddenKey) return null

                    const rawValue = item[col.key]
                    const displayValue = col.render?.(rawValue, item) ?? rawValue ?? emptyValue

                    return (
                      <td
                        key={String(col.key)}
                        className="px-4 py-2 border-b whitespace-nowrap overflow-hidden text-ellipsis"
                        title={
                          typeof rawValue === "string" && rawValue.length > 30
                            ? rawValue
                            : undefined
                        }
                      >
                        {displayValue}
                      </td>
                    )
                  })}

                  {renderActions && (
                    <td
                      className={`px-4 py-2 border-b text-center bg-white ${
                        actionsColumnFixed ? "sticky right-0 shadow-md z-10" : ""
                      }`}
                      style={{ width: actionsColumnWidth }}
                    >
                      {renderActions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
