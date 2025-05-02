"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { clsx } from "clsx"
import { Search, X, ChevronDown, ChevronUp } from "react-feather"

export interface SelectOption {
  value: string | number
  label: string
}

interface SearchableSelectProps {
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

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  placeholder = "Buscar y seleccionar...",
  error,
  required = false,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Encontrar la etiqueta seleccionada
  const selectedOption = options.find((option) => {
    if (typeof option.value === "number" && typeof value === "number") {
      return option.value === value
    }
    return String(option.value) === String(value)
  })

  // Inicializar y actualizar opciones filtradas
  useEffect(() => {
    setFilteredOptions(options)
  }, [options])

  // Filtrar opciones basadas en el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options)
    }
  }, [searchTerm, options])

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Manejar la selección de una opción
  const handleSelect = (option: SelectOption) => {
    // Pasar directamente el valor sin ninguna transformación
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm("")
  }

  // Manejar la apertura del dropdown
  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen && inputRef.current) {
        // Enfocar el input cuando se abre el dropdown
        setTimeout(() => {
          inputRef.current?.focus()
        }, 10)
      }
    }
  }

  // Limpiar la selección
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  return (
    <div className={clsx("mb-4 relative", className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        {/* Botón de selección */}
        <button
          type="button"
          onClick={handleToggleDropdown}
          disabled={disabled}
          className={clsx(
            "flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <div className="flex items-center">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {/* Campo de búsqueda */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Lista de opciones */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={typeof option.value === "number" ? `num-${option.value}` : option.value}
                    onClick={() => handleSelect(option)}
                    className={clsx(
                      "px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                      (typeof option.value === "number" && typeof value === "number"
                        ? option.value === value
                        : String(option.value) === String(value)) && "bg-brand-50 dark:bg-brand-900/20",
                    )}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No se encontraron resultados</div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
