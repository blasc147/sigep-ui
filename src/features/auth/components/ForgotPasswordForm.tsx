"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { authService } from "@/services/authService"
import { Mail } from "react-feather"

interface ForgotPasswordFormData {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.forgotPassword(data)
      setSuccess(true)
    } catch (error) {
      setError("No se pudo procesar la solicitud. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Recuperar Contraseña</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          Se ha enviado un correo electrónico con instrucciones para restablecer su contraseña.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña.
          </p>

          <div>
            <Input
              label="Correo Electrónico"
              type="email"
              fullWidth
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register("email", {
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
              })}
              onChange={() => error && setError(null)}
            />
          </div>

          <div>
            <Button type="submit" fullWidth isLoading={isLoading}>
              Enviar Instrucciones
            </Button>
          </div>
        </>
      )}

      <div className="text-center">
        <Link href="/login" className="font-medium text-brand-500 hover:text-brand-600 text-sm">
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  )
}
