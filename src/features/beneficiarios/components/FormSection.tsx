import type React from "react"
import { clsx } from "clsx"

interface FormSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, className }) => {
  return (
    <div className={clsx("mb-8", className)}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
