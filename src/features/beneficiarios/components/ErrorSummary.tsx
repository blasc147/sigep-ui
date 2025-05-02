import type React from "react"
import { AlertCircle } from "react-feather"
import type { FieldErrors } from "react-hook-form"
import type { BeneficiarioCreateRequest } from "@/types/beneficiario"

interface ErrorSummaryProps {
  errors: FieldErrors<BeneficiarioCreateRequest>
}

export const ErrorSummary: React.FC<ErrorSummaryProps> = ({ errors }) => {
  // Contar el número de errores
  const errorCount = Object.keys(errors).length

  if (errorCount === 0) {
    return null
  }

  // Obtener los primeros 3 errores para mostrar
  const errorList = Object.entries(errors)
    .slice(0, 3)
    .map(([field, error]) => ({
      field: field.replace(/_/g, " "),
      message: error?.message || "Campo inválido",
    }))

  return (
    <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
        <div className="flex-1">
          <p className="text-red-700 dark:text-red-400 font-medium">
            {errorCount === 1 ? "Hay 1 error en el formulario" : `Hay ${errorCount} errores en el formulario`}
          </p>
          <ul className="mt-1 text-red-600 dark:text-red-300 text-sm list-disc list-inside">
            {errorList.map((error, index) => (
              <li key={index}>
                <span className="capitalize">{error.field}</span>: {error.message}
              </li>
            ))}
            {errorCount > 3 && (
              <li>
                Y {errorCount - 3} {errorCount - 3 === 1 ? "error más" : "errores más"}...
              </li>
            )}
          </ul>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">Por favor, revise los campos marcados en rojo.</p>
        </div>
      </div>
    </div>
  )
}
