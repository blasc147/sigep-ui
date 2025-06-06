"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userService } from "@/services/userService"
import { useToast } from "@/components/ui/Toast"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { X } from "react-feather"
import type { User, UpdateUserRequest, Role, Efector } from "@/types/user"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

type FormData = {
  username: string
  password: string
  name: string
  dni: string
  email: string
  role: Role
}

export const UserModal = ({ isOpen, onClose, user }: UserModalProps) => {
  const [selectedEfectores, setSelectedEfectores] = useState<string[]>([])
  const [efectorSearch, setEfectorSearch] = useState("")
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      name: "",
      dni: "",
      email: "",
      role: "user" as Role,
    },
  })

  // Consulta para obtener efectores
  const { data: efectores = [] } = useQuery({
    queryKey: ["efectores"],
    queryFn: userService.getEfectores,
    onError: (error: Error) => {
      addToast(`Error al cargar efectores: ${error.message}`, "error")
    },
  })

  // Filtrar y ordenar efectores según búsqueda y estado de asignación
  const filteredEfectores = efectores
    .filter((efector: Efector) => {
      const search = efectorSearch.toLowerCase()
      return (
        efector.nombre.toLowerCase().includes(search) ||
        efector.localidad.toLowerCase().includes(search) ||
        efector.cuie.toLowerCase().includes(search)
      )
    })
    .sort((a: Efector, b: Efector) => {
      // Primero ordenar por estado de asignación
      const aAssigned = selectedEfectores.includes(a.cuie)
      const bAssigned = selectedEfectores.includes(b.cuie)
      
      if (aAssigned && !bAssigned) return -1
      if (!aAssigned && bAssigned) return 1
      
      // Si ambos están asignados o no asignados, ordenar por CUIE
      return a.cuie.localeCompare(b.cuie)
    })

  // Mutación para crear usuario
  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      addToast("Usuario creado correctamente", "success")
      onClose()
    },
    onError: (error: Error) => {
      addToast(`Error al crear usuario: ${error.message}`, "error")
    },
  })

  // Mutación para actualizar usuario
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      addToast("Usuario actualizado correctamente", "success")
      onClose()
    },
    onError: (error: Error) => {
      addToast(`Error al actualizar usuario: ${error.message}`, "error")
    },
  })

  // Mutación para asignar rol
  const assignRoleMutation = useMutation({
    mutationFn: userService.assignRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      addToast("Rol asignado correctamente", "success")
    },
    onError: (error: Error) => {
      addToast(`Error al asignar rol: ${error.message}`, "error")
    },
  })

  // Mutación para asignar efectores
  const assignEfectoresMutation = useMutation({
    mutationFn: userService.assignEfectores,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      addToast("Efectores asignados correctamente", "success")
    },
    onError: (error: Error) => {
      addToast(`Error al asignar efectores: ${error.message}`, "error")
    },
  })

  // Cargar datos del usuario si estamos editando
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        password: "", // No mostramos la contraseña
        name: user.name,
        dni: user.dni || "",
        email: user.email,
        role: user.roles.length > 0 ? user.roles[0].name : "user",
      })
      // Extraer los CUIEs de los efectores
      setSelectedEfectores(user.efectores.map((efector) => efector.cuie))
    } else {
      reset({
        username: "",
        password: "",
        name: "",
        dni: "",
        email: "",
        role: "user",
      })
      setSelectedEfectores([])
    }
  }, [user, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (user) {
        // Actualizar usuario existente
        await updateUserMutation.mutateAsync({
          id: user.id,
          data: {
            name: data.name,
            email: data.email,
            dni: data.dni,
          },
        })

        // Si el rol ha cambiado, actualizarlo
        const currentRole = user.roles.length > 0 ? user.roles[0].name : null
        if (data.role !== currentRole) {
          await assignRoleMutation.mutateAsync({
            username: user.username,
            roleName: data.role,
          })
        }

        // Si los efectores han cambiado, actualizarlos
        const currentEfectores = user.efectores.map((e) => e.cuie)
        if (JSON.stringify(selectedEfectores.sort()) !== JSON.stringify(currentEfectores.sort())) {
          await assignEfectoresMutation.mutateAsync({
            userId: user.id,
            cuies: selectedEfectores,
          })
        }
      } else {
        // Crear nuevo usuario
        await createUserMutation.mutateAsync({
          username: data.username,
          password: data.password,
          name: data.name,
          dni: data.dni,
          email: data.email,
          role: data.role,
          efectores: selectedEfectores,
        })
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error)
    }
  }

  const handleEfectorToggle = (cuie: string) => {
    setSelectedEfectores((prev) => (prev.includes(cuie) ? prev.filter((c) => c !== cuie) : [...prev, cuie]))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold">{user ? "Editar Usuario" : "Crear Usuario"}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Nombre de Usuario"
                {...register("username", {
                  required: "El nombre de usuario es requerido",
                })}
                error={errors.username?.message}
                disabled={!!user} // Deshabilitar si estamos editando
                fullWidth
              />
            </div>

            {!user && (
              <div>
                <Input
                  label="Contraseña"
                  type="password"
                  {...register("password", {
                    required: !user && "La contraseña es requerida",
                  })}
                  error={errors.password?.message}
                  fullWidth
                />
              </div>
            )}

            <div>
              <Input
                label="Nombre Completo"
                {...register("name", {
                  required: "El nombre es requerido",
                })}
                error={errors.name?.message}
                fullWidth
              />
            </div>

            <div>
              <Input label="DNI" {...register("dni")} error={errors.dni?.message} fullWidth />
            </div>

            <div>
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
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
              <select
                {...register("role", {
                  required: "El rol es requerido",
                })}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="manager">Gestor</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Efectores</label>
            <Input
              placeholder="Buscar efector por nombre, localidad o CUIE..."
              value={efectorSearch}
              onChange={e => setEfectorSearch(e.target.value)}
              className="mb-2"
              fullWidth
            />
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 max-h-60 overflow-y-auto">
              {efectores.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Cargando efectores...</p>
              ) : (
                <div className="space-y-2">
                  {filteredEfectores.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No se encontraron efectores</p>
                  ) : (
                    filteredEfectores.map((efector: Efector) => (
                      <div key={efector.cuie} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`efector-${efector.cuie}`}
                          checked={selectedEfectores.includes(efector.cuie)}
                          onChange={() => handleEfectorToggle(efector.cuie)}
                          className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`efector-${efector.cuie}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {efector.nombre} - {efector.localidad} ({efector.cuie})
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={
                createUserMutation.isPending ||
                updateUserMutation.isPending ||
                assignRoleMutation.isPending ||
                assignEfectoresMutation.isPending
              }
            >
              {user ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
