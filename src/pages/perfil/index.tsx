"use client"

import { useState, useEffect } from "react"
import { userService } from "@/services/userService"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useForm } from "react-hook-form"
import { MainLayout } from "@/components/layout/MainLayout"
import { Edit2, Save, X, Key } from "react-feather"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/Toast"

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    if (!authUser) {
      router.push("/login")
    }
  }, [authUser, router])

  // Consulta para obtener los datos del usuario
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", authUser?.id],
    queryFn: () => userService.getUserById(authUser!.id.toString()),
    enabled: !!authUser?.id,
  })

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

  // Consulta para obtener los efectores del usuario
  const { data: efectores = [] } = useQuery({
    queryKey: ["userEfectores", user?.id],
    queryFn: () => userService.getUserEfectores(user!.id),
    enabled: !!user?.id,
  })

  // Mutación para actualizar el perfil
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => 
      userService.updateProfile(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] })
      setIsEditing(false)
      addToast("Perfil actualizado correctamente", "success")
    },
    onError: (error) => {
      addToast("Error al actualizar el perfil", "error")
      console.error("Error al actualizar el perfil:", error)
    }
  })

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </MainLayout>
    )
  }

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
                  onClick={handleSubmit((data) => updateProfileMutation.mutate(data))}
                  isLoading={updateProfileMutation.isPending}
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
                    key={role.id}
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