// src/components/common/ModalForm.tsx
"use client"

import { useApiForm } from "@/hooks/useApiForm"
import { Modal } from "../ui/modal/Modal"
Modal

interface ModalFormProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: string
  onSubmit: (submitRequest: any) => Promise<void>
  children: React.ReactNode
  submitLabel?: string
}

export function ModalForm({
  isOpen,
  onClose,
  title,
  size,
  onSubmit,
  children,
  submitLabel = "Save",
}: ModalFormProps) {
  const { submitRequest, isSubmitting, errorMessages } = useApiForm({
    onSuccess: onClose,
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await onSubmit(submitRequest)
        }}
        className="space-y-4"
      >
        {/* Error Messages */}
        {errorMessages.length > 0 && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errorMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form Fields */}
        {children}

        {/* Actions */}
        <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}
