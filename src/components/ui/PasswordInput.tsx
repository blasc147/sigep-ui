"use client"

import { useState, forwardRef } from "react"
import { clsx } from "clsx"
import { Eye, EyeOff } from "react-feather"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, fullWidth = false, leftIcon, rightIcon, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div className={clsx("flex flex-col", fullWidth && "w-full")}>
        {label && <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={clsx(
              "block rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white",
              leftIcon && "pl-10",
              "pr-10", // Siempre dejamos espacio para el ojito
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              fullWidth && "w-full",
              className,
            )}
            {...props}
          />
          
          {/* Botón del ojito para mostrar/ocultar contraseña */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1} // Para que no interfiera con el tab del input
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye size={18} className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput" 