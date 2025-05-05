"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { userService } from "@/services/userService"
import type { Efector } from "@/types/user"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useForm } from "react-hook-form"
import { MainLayout } from "@/components/layout/MainLayout"
import { Edit2, Save, X, Key } from "react-feather"

export default function ProfilePage() {
  const { user } = useAuth()
  const [efectores, setEfectores] = useState<Efector[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [resetMessage, setResetMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  useEffect(() => {
    if (user?.id) {
      loadEfectores()
    }
  }, [user?.id])

  const loadEfectores = async () => {
    try {
      const data = await userService.getUserEfectores(user!.id)
      setEfectores(data)
    } catch (error) {
      console.error("Error al cargar efectores:", error)
    }
  }

  const onSubmit = async (data: { name: string; email: string }) => {
    if (!user) return

    setIsLoading(true)
    try {
      await userService.updateProfile(user.id, data)
      setIsEditing(false)
      // Aquí podrías mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      // Aquí podrías mostrar un mensaje de error
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    reset({
      name: user?.name || "",
      email: user?.email || "",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset({
      name: user?.name || "",
      email: user?.email || "",
    })
  }

  const handleResetPassword = async () => {
    if (!user?.email) {
      setResetMessage("No se puede resetear la contraseña porque no hay un email registrado")
      return
    }

    setIsResettingPassword(true)
    setResetMessage(null)
    try {
      await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      })
      setResetMessage("Se ha enviado un email con instrucciones para resetear tu contraseña")
    } catch (error) {
      console.error("Error al solicitar reset de contraseña:", error)
      setResetMessage("Error al solicitar el reset de contraseña")
    } finally {
      setIsResettingPassword(false)
    }
  }

  if (!user) return null

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  leftIcon={<Edit2 size={16} />}
                >
                  Editar Perfil
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetPassword}
                  isLoading={isResettingPassword}
                  leftIcon={<Key size={16} />}
                >
                  Resetear Contraseña
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  leftIcon={<X size={16} />}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isLoading}
                  leftIcon={<Save size={16} />}
                >
                  Guardar
                </Button>
              </>
            )}
          </div>
        </div>

        {resetMessage && (
          <div className={`p-4 rounded-md ${resetMessage.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {resetMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuario
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {user.username}
                </div>
              </div>

              {isEditing ? (
                <>
                  <Input
                    label="Nombre"
                    {...register("name", {
                      required: "El nombre es requerido",
                    })}
                    error={errors.name?.message}
                  />

                  <Input
                    label="Email"
                    type="email"
                    {...register("email", {
                      required: "El email es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    error={errors.email?.message}
                  />
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre
                    </label>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {user.name}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {user.email}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Roles</h2>
              <div className="space-y-2">
                {user.roles.map((role) => (
                  <div
                    key={role.name}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <h3 className="font-medium">{role.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Efectores Asignados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {efectores.map((efector) => (
                <div
                  key={efector.cuie}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <h3 className="font-medium">{efector.nombre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    CUIE: {efector.cuie}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Localidad: {efector.localidad}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Código: {efector.codigo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
} 