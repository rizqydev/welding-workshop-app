"use client"

import { Suspense, useState } from "react"
import Table from "@/components/common/Table"
import { Modal } from "@/components/ui/modal/Modal"
import { ProductForm, ProductFormData } from "@/components/forms/ProductForm"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useToast } from "@/context/ToastContext"

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const { showToast } = useToast()

  const openCreate = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const openEdit = (product: ProductFormData) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const openDelete = (product: ProductFormData) => {
    setSelectedProduct(product)
    setIsDeleteOpen(true)
  }

  const handleSave = async (data: ProductFormData) => {
    setLoading(true)
    try {
      const method = data._id ? "PUT" : "POST"
      const url = data._id ? `/api/products/${data._id}` : `/api/products`
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to save product")
      setIsModalOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (error) {
      console.error("Error saving product:", error)

      showToast("error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct?._id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${selectedProduct._id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete product")
      setIsDeleteOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (error) {
      console.error("Delete error:", error)
      showToast("Failed to delete product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <Suspense fallback={<div>Loading</div>}>
        <Table
          key={refreshKey}
          apiEndpoint="/api/products"
          filters={{}}
          columns={[
            { key: "name", label: "Name" },
            { key: "brand", label: "Brand" },
            { key: "qty", label: "Quantity" },
            {
              key: "information",
              label: "Info",
              render: (value) =>
                typeof value === "string"
                  ? value.length > 30
                    ? value.slice(0, 30) + "..."
                    : value
                  : "-",
            },
          ]}
          renderActions={(product) => (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => openEdit(product)}
                className="px-2 py-1 text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => openDelete(product)}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        />
      </Suspense>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? "Edit Product" : "Add Product"}
        size="max-w-lg"
      >
        <ProductForm
          initialData={selectedProduct}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
        isLoading={loading}
      />
    </div>
  )
}
