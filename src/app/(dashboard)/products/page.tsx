// "use client"

// import { useEffect, useState } from "react"
// import { ProductInput } from "@/lib/validations/product"

// interface Product extends ProductInput {
//   _id: string
// }

// export default function ProductPage() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [form, setForm] = useState<ProductInput>({
//     name: "",
//     brand: "",
//     qty: 0,
//     information: "",
//   })
//   const [editingId, setEditingId] = useState<string | null>(null)

//   // Fetch products
//   useEffect(() => {
//     fetch("/api/products")
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//   }, [])

//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setForm({ ...form, [name]: name === "qty" ? Number(value) : value })
//   }

//   // Submit form (create or update)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (editingId) {
//       // Update product
//       const res = await fetch(`/api/products/${editingId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       })
//       if (res.ok) {
//         const updatedProduct = await res.json()
//         setProducts(products.map((p) => (p._id === editingId ? updatedProduct : p)))
//         setEditingId(null)
//         setForm({ name: "", brand: "", qty: 0, information: "" })
//       }
//     } else {
//       // Create product
//       const res = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       })
//       if (res.ok) {
//         const newProduct = await res.json()
//         setProducts([newProduct, ...products])
//         setForm({ name: "", brand: "", qty: 0, information: "" })
//       }
//     }
//   }

//   // Delete product
//   const handleDelete = async (id: string) => {
//     const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
//     if (res.ok) {
//       setProducts(products.filter((p) => p._id !== id))
//     }
//   }

//   // Edit product (populate form)
//   const handleEdit = (product: Product) => {
//     setForm({
//       name: product.name,
//       brand: product.brand,
//       qty: product.qty,
//       information: product.information || "",
//     })
//     setEditingId(product._id)
//   }

//   return (
//     <main className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Products</h1>

//       <form onSubmit={handleSubmit} className="space-y-2 mb-6">
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           className="border p-2 w-full"
//           required
//         />
//         <input
//           type="text"
//           name="brand"
//           placeholder="Brand"
//           value={form.brand}
//           onChange={handleChange}
//           className="border p-2 w-full"
//           required
//         />
//         <input
//           type="number"
//           name="qty"
//           placeholder="Quantity"
//           value={form.qty}
//           onChange={handleChange}
//           className="border p-2 w-full"
//           required
//         />
//         <textarea
//           name="information"
//           placeholder="Information"
//           value={form.information}
//           onChange={handleChange}
//           className="border p-2 w-full"
//         />
//         <div className="flex space-x-2">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             {editingId ? "Update Product" : "Add Product"}
//           </button>
//           {editingId && (
//             <button
//               type="button"
//               onClick={() => {
//                 setEditingId(null)
//                 setForm({ name: "", brand: "", qty: 0, information: "" })
//               }}
//               className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       <ul className="space-y-2">
//         {products.map((p) => (
//           <li key={p._id} className="border p-3 flex justify-between items-center">
//             <div>
//               <h2 className="font-semibold">{p.name}</h2>
//               <p className="text-sm text-gray-600">Brand: {p.brand}</p>
//               <p className="text-sm">Qty: {p.qty}</p>
//               {p.information && <p className="text-sm italic">{p.information}</p>}
//             </div>
//             <div className="space-x-2">
//               <button
//                 onClick={() => handleEdit(p)}
//                 className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(p._id)}
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </main>
//   )
// }

"use client"

import Table from "@/components/common/Table"

export default function ProductsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
      </div>

      <Table
        apiEndpoint="/api/products"
        columns={[
          { key: "name", label: "Name" },
          { key: "brand", label: "Brand" },
          { key: "qty", label: "Quantity" },
          { key: "information", label: "Information" },
        ]}
      />
    </div>
  )
}
