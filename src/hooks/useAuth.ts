"use client"

import { useCallback, useEffect } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, LoginRequest } from "@/types/auth"
import { authService } from "@/services/authService"
import type { Role } from "@/types/user"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(data)

          // Guardar tokens y usuario en localStorage
          localStorage.setItem("access_token", response.access_token)
          localStorage.setItem("refresh_token", response.refresh_token)
          localStorage.setItem("user", JSON.stringify(response.user))

          // Actualizar el estado
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null, // Asegurarse de que no haya error
          })

          return true // Indicar éxito
        } catch (error: any) {
          // Extraer mensaje de error de la respuesta
          let errorMessage = "Error de autenticación"

          if (error.response) {
            // Error de respuesta del servidor
            errorMessage =
              error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`
          } else if (error.request) {
            // Error de red (no se recibió respuesta)
            errorMessage = "No se pudo conectar con el servidor. Verifique su conexión."
          } else {
            // Error en la configuración de la solicitud
            errorMessage = error.message || "Error desconocido"
          }

          // Actualizar el estado con el error
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          })

          return false // Indicar fallo
        }
      },
      logout: () => {
        // Limpiar localStorage
        authService.logout()

        // Actualizar estado
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, clearError } = useAuthStore()

  // Modificamos la función hasRole para que trabaje con los roles del enum: "user", "admin", "manager"
  const hasRole = useCallback(
    (role: Role) => {
      if (!user) return false

      // Convertimos los nombres de roles a minúsculas para hacer la comparación insensible a mayúsculas/minúsculas
      return user.roles.some((r) => r.name.toLowerCase() === role.toLowerCase())
    },
    [user],
  )

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false
      return user.roles.some((r) => r.permissions.includes(permission))
    },
    [user],
  )

  useEffect(() => {
    // Verificar si hay un token pero no hay usuario (por ejemplo, después de un refresh)
    const token = localStorage.getItem("access_token")
    if (token && !isAuthenticated) {
      // Intentar obtener el usuario desde localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          useAuthStore.setState({
            user: parsedUser,
            isAuthenticated: true,
          })
        } catch (e) {
          // Si hay un error al parsear, hacer logout
          logout()
        }
      }
    }
  }, [isAuthenticated, logout])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    hasRole,
    hasPermission,
  }
}
