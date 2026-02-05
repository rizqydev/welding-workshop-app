"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputTextProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function InputText({
  label,
  error,
  type,
  className = "",
  ...props
}: InputTextProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          className={`w-full rounded-md border px-3 py-2 pr-10 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
