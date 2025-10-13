'use client'

import React, { useEffect, useState } from 'react'

export type ProductInput = { name: string; brand: string; qty: number; information?: string }

export default function ProductForm({
  initial,
  onSuccess,
}: {
  initial?: Partial<ProductInput>
  onSuccess?: () => void
}) {
  const [name, setName] = useState(initial?.name || '')
  const [brand, setBrand] = useState(initial?.brand || '')
  const [qty, setQty] = useState<number>(initial?.qty || 0)
  const [information, setInformation] = useState(initial?.information || '')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, brand, qty: Number(qty), information }),
      })

      if (!res.ok) throw new Error('failed')
      setName('')
      setBrand('')
      setQty(0)
      setInformation('')
      onSuccess?.()
    } catch (error) {
      console.error(error)
      alert('error creating product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Brand</label>
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          required
          min={0}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Information</label>
        <textarea
          value={information}
          onChange={(e) => setInformation(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          {loading ? 'Saving...' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
