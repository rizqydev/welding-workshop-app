"use client"

import { Modal } from "@/components/ui/modal/Modal"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title?: string
  message?: string
  confirmText?: string
  loading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Delete",
  loading,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="max-w-sm">
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">
          Cancel
        </button>
        <button
          onClick={() => onConfirm()}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Deleting..." : confirmText}
        </button>
      </div>
    </Modal>
  )
}
