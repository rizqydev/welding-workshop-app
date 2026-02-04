"use client"

import { useState } from "react"
import { InputText } from "../ui/form/InputText"
import { InputTextArea } from "../ui/form/InputTextArea"
import QRCode from "react-qr-code"

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
      <InputText label="Name" name="name" value={form.name} onChange={handleChange} required />

      <InputText label="Brand" name="brand" value={form.brand} onChange={handleChange} />
      <InputText
        label="Quantity"
        type="number"
        name="qty"
        value={form.qty}
        onChange={handleChange}
        required
      />

      <InputTextArea
        label="Information"
        name="information"
        value={form.information}
        onChange={handleChange}
      />
      {form?._id && (
        <div className="flex justify-center">
          <QRCode value={`${process.env.NEXT_PUBLIC_API_BASE_URL}/show/${form._id}`} />
        </div>
      )}

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
