import React from "react"

interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
} 