"use client"

import React from "react"

interface InputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function InputTextArea({ label, error, className = "", ...props }: InputTextareaProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label + (props.required ? "*" : "")}
      </label>

      <textarea
        {...props}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-blue-500 focus:ring-blue-500 px-3 py-2 resize-none 
          ${className}`}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
