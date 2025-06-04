import React, { useMemo } from "react"

interface DetailFieldProps {
  label: string
  value: any
}

export const DetailField: React.FC<DetailFieldProps> = ({ label, value }) => {
  // Formatear el valor para mostrar
  const displayValue = useMemo(() => {
    if (value === undefined || value === null || value === "") {
      return "—"
    }

    // Si es un elemento React, lo devolvemos directamente
    if (React.isValidElement(value)) {
      return value
    }

    if (typeof value === "object") {
      // Handle Date objects
      if (value instanceof Date) {
        return value.toLocaleDateString()
      }

      // Handle objects with id and name properties
      if (value.nombre) {
        return value.nombre
      }

      // Handle cod_pos object
      if (value.codigopostal) {
        return value.codigopostal
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return value.join(", ")
      }

      // For other objects, convert to string
      return JSON.stringify(value)
    }

    return String(value)
  }, [value])

  return (
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-base text-gray-900 dark:text-white">{displayValue}</p>
    </div>
  )
} 