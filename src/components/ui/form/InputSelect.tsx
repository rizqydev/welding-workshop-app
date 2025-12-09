// app/components/ui/form/InputSelect.tsx
"use client"

import React from "react"

interface InputSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { label: string; value: any }[]
  error?: string
  value: any
}

export function InputSelect({ label, options, error, className = "", ...props }: InputSelectProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        {...props}
        className={`
          mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 ${className} ${props.disabled && "bg-gray-100 cursor-not-allowed"}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
