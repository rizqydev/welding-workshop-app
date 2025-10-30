"use client"

import { Modal } from "../ui/modal/Modal"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  onConfirm: () => Promise<void> | void
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="max-w-md">
      <div className="space-y-4 text-gray-700">
        <p>{message}</p>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={async () => await onConfirm()}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
