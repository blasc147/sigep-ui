"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { PasswordInput } from "@/components/ui/PasswordInput"
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
  const [password, setPassword] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    console.log("onSubmit llamado con datos:", data)
    console.log("Password del estado local:", password)
    console.log("Datos recibidos - username:", data.username, "password:", data.password ? "***" : "vacío")
    
    // Usar la contraseña del estado local si la del formulario está vacía
    const finalPassword = data.password || password
    
    if (!data.username || !finalPassword) {
      console.error("Datos faltantes:", { username: !!data.username, password: !!finalPassword })
      setLocalError("Por favor complete todos los campos")
      return
    }

    setLocalError(null)
    clearError()

    try {
      const result = await login({
        username: data.username,
        password: finalPassword
      })

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    handleInputChange()
  }

  // Para debuggear
  const watchedValues = watch()
  
  useEffect(() => {
    console.log("Valores actuales del formulario:", watchedValues)
  }, [watchedValues])

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
        <PasswordInput
          label="Contraseña"
          fullWidth
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSubmit(onSubmit)()
            }
          }}
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
