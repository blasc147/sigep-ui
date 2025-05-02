import type React from "react"
import { clsx } from "clsx"

interface LoadingSelectProps {
  label?: string
  required?: boolean
  className?: string
}

export const LoadingSelect: React.FC<LoadingSelectProps> = ({ label, required = false, className }) => {
  return (
    <div className={clsx("mb-4", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="block w-full rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 shadow-sm animate-pulse h-10">
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  )
}
