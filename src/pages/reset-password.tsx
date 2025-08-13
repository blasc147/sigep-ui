import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { PasswordInput } from "@/components/ui/PasswordInput"
import { Card } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toast"
import { Lock } from "react-feather"
import Image from "next/image"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Schema de validación
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/\d/, "La contraseña debe contener al menos un número"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token } = router.query
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token || typeof token !== 'string') {
      addToast("Token no válido", "error")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: data.password,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al resetear la contraseña")
      }

      addToast("Contraseña actualizada correctamente", "success")
      router.push("/login")
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Error al resetear la contraseña",
        "error"
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar un estado de carga mientras se obtiene el token
  if (router.isReady && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Link Inválido</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              El link para resetear la contraseña no es válido o ha expirado.
            </p>
            <Button onClick={() => router.push("/login")}>
              Volver al Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 relative mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/loginimg-5EQAVOA3oF0BoNx7NGY1dUBxeOeycp.png"
              alt="SUMAR Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="p-3 bg-brand-100 rounded-full">
            <Lock className="w-6 h-6 text-brand-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Resetear Contraseña
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <PasswordInput
              label="Nueva Contraseña"
              fullWidth
              {...register("password")}
              error={errors.password?.message}
            />
          </div>

          <div>
            <PasswordInput
              label="Confirmar Contraseña"
              fullWidth
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Cambiar Contraseña
          </Button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          ¿Recordaste tu contraseña?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-brand-600 hover:text-brand-500"
          >
            Volver al Login
          </button>
        </p>
      </Card>
    </div>
  )
} 