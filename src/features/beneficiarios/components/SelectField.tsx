"use client"

import type React from "react"
import { clsx } from "clsx"

interface SelectOption {
  value: string | number
  label: string
}

interface SelectFieldProps {
  name: string
  options: SelectOption[]
  value: string | number
  onChange: (value: string | number) => void
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  placeholder = "Seleccione una opción",
  error,
  required = false,
  disabled = false,
  className,
}) => {
  return (
    <div className={clsx("mb-4", className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={clsx(
          "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <option value="">{placeholder}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
