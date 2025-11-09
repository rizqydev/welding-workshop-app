// /components/ui/Modal.tsx

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Fragment } from "react"
import { X } from "lucide-react"

interface ModalProps {
  // Required: Controls visibility of the modal
  isOpen: boolean
  // Required: Function to close the modal
  onClose: () => void
  // Required: The content to display inside the modal body
  children: React.ReactNode
  // Optional: The title for the modal header
  title?: string
  // Optional: Custom width for the modal (Tailwind class, e.g., 'max-w-xl')
  size?: string
}

export function Modal({ isOpen, onClose, children, title, size = "max-w-lg" }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={onClose}>
        {/* Backdrop (Overlay) */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Modal Panel */}
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`w-full ${size} transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-2xl transition-all`}
              >
                {/* Header Section */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    {title || "Modal Title"}
                  </DialogTitle>
                  <button
                    type="button"
                    className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="mt-4">{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
