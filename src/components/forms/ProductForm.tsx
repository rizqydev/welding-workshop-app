"use client"

import { useState } from "react"

export interface ProductFormData {
  _id?: string
  name: string
  brand: string
  qty: number
  information?: string
}

interface ProductFormProps {
  initialData?: ProductFormData | null
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function ProductForm({ initialData, onSubmit, onCancel, loading }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(
    initialData || { name: "", brand: "", qty: 0, information: "" },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === "qty" ? Number(value) : value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          name="qty"
          value={form.qty}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Information</label>
        <textarea
          name="information"
          value={form.information}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  )
}
