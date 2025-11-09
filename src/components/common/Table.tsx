// "use client"

// import { useMemo, useState } from "react"
// import { ArrowUpDown } from "lucide-react"
// import { ReactNode } from "react"

// export interface Column<T> {
//   key: keyof T | string
//   header: string
//   sortable?: boolean
//   render?: (item: T) => ReactNode
//   className?: string
// }

// interface TableProps<T> {
//   data: T[]
//   columns: Column<T>[]
//   loading?: boolean
//   searchKey?: keyof T
//   actions?: (item: T) => ReactNode
//   currentPage?: number
//   totalPages?: number
//   onPageChange?: (page: number) => void
//   emptyText?: string
// }

// export default function Table<T>({
//   data,
//   columns,
//   loading = false,
//   searchKey,
//   actions,
//   currentPage = 1,
//   totalPages = 1,
//   onPageChange,
//   emptyText = "No data found.",
// }: TableProps<T>) {
//   const [sortKey, setSortKey] = useState<string | null>(null)
//   const [sortAsc, setSortAsc] = useState(true)
//   const [search, setSearch] = useState("")

//   // 🔍 Search filter
//   const filteredData = useMemo(() => {
//     let items = data

//     if (searchKey && search.trim()) {
//       items = items.filter((item) =>
//         String((item as any)[searchKey])
//           .toLowerCase()
//           .includes(search.toLowerCase()),
//       )
//     }

//     // ⬆⬇ Sorting
//     if (sortKey) {
//       items = [...items].sort((a, b) => {
//         const aVal = (a as any)[sortKey]
//         const bVal = (b as any)[sortKey]
//         if (aVal < bVal) return sortAsc ? -1 : 1
//         if (aVal > bVal) return sortAsc ? 1 : -1
//         return 0
//       })
//     }

//     return items
//   }, [data, search, sortKey, sortAsc, searchKey])

//   const handleSort = (key: string) => {
//     if (sortKey === key) {
//       setSortAsc(!sortAsc)
//     } else {
//       setSortKey(key)
//       setSortAsc(true)
//     }
//   }

//   return (
//     <div className="border rounded-lg overflow-x-auto shadow-sm">
//       {/* 🔍 Search bar */}
//       {searchKey && (
//         <div className="p-3 flex justify-end">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border rounded px-3 py-1 text-sm w-64"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       )}

//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-100 text-sm">
//             {columns.map((col) => (
//               <th
//                 key={col.key.toString()}
//                 className={`p-3 border text-left font-medium ${col.className || ""}`}
//               >
//                 <div
//                   className={`flex items-center gap-1 ${
//                     col.sortable ? "cursor-pointer select-none" : ""
//                   }`}
//                   onClick={() => col.sortable && handleSort(col.key.toString())}
//                 >
//                   {col.header}
//                   {col.sortable && (
//                     <ArrowUpDown
//                       size={14}
//                       className={`transition ${
//                         sortKey === col.key ? "text-blue-500" : "text-gray-400"
//                       }`}
//                     />
//                   )}
//                 </div>
//               </th>
//             ))}
//             {actions && <th className="p-3 border text-left font-medium">Actions</th>}
//           </tr>
//         </thead>

//         <tbody>
//           {loading ? (
//             // 🦴 Skeleton loading
//             Array.from({ length: 5 }).map((_, i) => (
//               <tr key={i} className="animate-pulse">
//                 {columns.map((col) => (
//                   <td key={col.key.toString()} className="p-3 border">
//                     <div className="h-4 bg-gray-200 rounded w-3/4" />
//                   </td>
//                 ))}
//                 {actions && (
//                   <td className="p-3 border">
//                     <div className="h-4 bg-gray-200 rounded w-1/2" />
//                   </td>
//                 )}
//               </tr>
//             ))
//           ) : filteredData.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={columns.length + (actions ? 1 : 0)}
//                 className="text-center text-gray-500 p-6"
//               >
//                 {emptyText}
//               </td>
//             </tr>
//           ) : (
//             filteredData.map((item, i) => (
//               <tr key={i} className="hover:bg-gray-50">
//                 {columns.map((col) => (
//                   <td key={col.key.toString()} className="p-3 border text-sm">
//                     {col.render ? col.render(item) : (item as any)[col.key]}
//                   </td>
//                 ))}
//                 {actions && <td className="p-3 border">{actions(item)}</td>}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* 🔢 Pagination */}
//       {onPageChange && totalPages > 1 && (
//         <div className="flex justify-between items-center p-3 text-sm">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => onPageChange(currentPage - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => onPageChange(currentPage + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface TableColumn<T> {
  key: keyof T
  label: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  apiEndpoint: string // e.g. "/api/products" or "/api/users"
  pageSize?: number
  renderActions?: (row: T) => React.ReactNode // 👈 custom per-row action buttons
}

export default function Table<T>({
  columns,
  apiEndpoint,
  pageSize = 10,
  renderActions,
}: TableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page")) || 1

  // Fetch data from API based on current page
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
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-900 font-semibold text-sm">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-2 border-b">
                  {col.label}
                </th>
              ))}
              {renderActions && <th className="px-4 py-2 border-b text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // 🦴 Skeleton loading
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key.toString()} className="p-3 border">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                  ))}
                  {renderActions && (
                    <td className="p-3 border">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id || JSON.stringify(item)} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-2 border-b">
                      {String(item[col.key])}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-2 border-b text-center">{renderActions(item)}</td>
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
          className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="disabled:cursor-not-allowed px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
