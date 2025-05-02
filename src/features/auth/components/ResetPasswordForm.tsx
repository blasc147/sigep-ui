"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { authService } from "@/services/authService"
import { Lock } from "react-feather"

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

interface ResetPasswordFormProps {
  token: string
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>()

  const password = watch("newPassword")

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.resetPassword({
        token,
        newPassword: data.newPassword,
      })
      setSuccess(true)

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      setError("No se pudo restablecer la contraseña. El enlace puede haber expirado.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Restablecer Contraseña</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          Su contraseña ha sido restablecida con éxito. Será redirigido al inicio de sesión.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ingrese su nueva contraseña.</p>

          <div>
            <Input
              label="Nueva Contraseña"
              type="password"
              fullWidth
              leftIcon={<Lock size={18} />}
              error={errors.newPassword?.message}
              {...register("newPassword", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              })}
              onChange={() => error && setError(null)}
            />
          </div>

          <div>
            <Input
              label="Confirmar Contraseña"
              type="password"
              fullWidth
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Debe confirmar la contraseña",
                validate: (value) => value === password || "Las contraseñas no coinciden",
              })}
              onChange={() => error && setError(null)}
            />
          </div>

          <div>
            <Button type="submit" fullWidth isLoading={isLoading}>
              Restablecer Contraseña
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
