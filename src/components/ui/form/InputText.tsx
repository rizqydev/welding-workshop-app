// app/components/ui/form/InputText.tsx
"use client"

import React from "react"

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function InputText({ label, error, className = "", ...props }: InputTextProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label + (props.required ? "*" : "")}
      </label>
      <input
        {...props}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 ${className}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
