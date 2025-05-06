"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"
import { User, Lock } from "react-feather"

interface LoginFormData {
  username: string
  password: string
}

export const LoginForm: React.FC = () => {
  const { login, isLoading, error: authError, clearError } = useAuth()
  const router = useRouter()
  const [localError, setLocalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setLocalError(null)
    clearError()

    try {
      const result = await login(data)

      if (result) {
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("Error durante el login:", err)
      setLocalError(err.message || "Error inesperado durante el login")
    }
  }

  const displayError = authError || localError

  const handleInputChange = () => {
    if (displayError) {
      clearError()
      setLocalError(null)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
      noValidate
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Iniciar Sesión</h2>

      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{displayError}</div>
      )}

      <div>
        <Input
          label="Usuario"
          type="text"
          fullWidth
          leftIcon={<User size={18} />}
          error={errors.username?.message}
          {...register("username", {
            required: "El usuario es requerido",
          })}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Input
          label="Contraseña"
          type="password"
          fullWidth
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register("password", {
            required: "La contraseña es requerida",
          })}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Recordarme
          </label>
        </div>

        <div className="text-sm">
          <Link href="/forgot-password" className="font-medium text-brand-500 hover:text-brand-600">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Iniciar Sesión
        </Button>
      </div>
    </form>
  )
}
