// /context/ToastContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { Transition } from "@headlessui/react"
import { CheckCircle, XCircle, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* ✅ Toast Container */}
      <div className="fixed bottom-4 right-4 space-y-2 z-[200]">
        {toasts.map((toast) => (
          <Transition
            key={toast.id}
            appear
            show
            enter="transition transform ease-out duration-200"
            enterFrom="opacity-0 translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition transform ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-95"
          >
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-md text-white ${
                toast.type === "success"
                  ? "bg-green-600"
                  : toast.type === "error"
                    ? "bg-red-600"
                    : "bg-blue-600"
              }`}
            >
              {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
              {toast.type === "error" && <XCircle className="w-5 h-5" />}
              {toast.type === "info" && <Info className="w-5 h-5" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </Transition>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}
