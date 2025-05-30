"use client"

import type React from "react"
import { clsx } from "clsx"

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  required?: boolean
  inline?: boolean
  disabled?: boolean
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  required = false,
  inline = false,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={clsx("flex gap-4", inline ? "flex-row" : "flex-col")}>
        {options?.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={clsx(
                "h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            />
            <label 
              htmlFor={`${name}-${option.value}`} 
              className={clsx(
                "ml-2 block text-sm text-gray-700 dark:text-gray-300",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
