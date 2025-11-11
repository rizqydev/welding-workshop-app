// src/hooks/useApiForm.ts
import { useState } from "react"

interface UseApiFormOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useApiForm({ onSuccess, onError }: UseApiFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  async function submitRequest(
    url: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    body?: any,
  ) {
    setIsSubmitting(true)
    setErrorMessages([])

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await res.json()

      if (!res.ok) {
        // Handle Zod-style errors
        if (Array.isArray(data.error)) {
          setErrorMessages(data.error.map((e: any) => e.message))
        } else if (data.error && typeof data.error === "object") {
          // @ts-ignore
          setErrorMessages(Object.values(data.error).flat())
        } else if (typeof data.error === "string") {
          setErrorMessages([data.error])
        } else {
          setErrorMessages(["An unknown error occurred"])
        }

        onError?.(data)
        return { success: false, data }
      }

      onSuccess?.(data)
      return { success: true, data }
    } catch (err) {
      console.log(err)
      setErrorMessages(["Network error or unexpected issue"])
      onError?.(err)
      return { success: false, data: null }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitRequest,
    isSubmitting,
    errorMessages,
    setErrorMessages,
  }
}
