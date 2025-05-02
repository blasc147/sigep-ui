import axios from "axios"
import { authService } from "./authService"
import { jwtDecode } from "jwt-decode"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Modificar la configuración de axios para incluir credenciales y manejar CORS
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Agregar esta configuración para manejar CORS
  withCredentials: true,
})

// Variable para controlar si ya estamos renovando el token
let isRefreshing = false

// Función para verificar si el token está próximo a expirar (menos de 10 minutos)
const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token)
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiration = decoded.exp - now
    return timeUntilExpiration < 600 // 10 minutos en segundos
  } catch (error) {
    return true // Si hay error al decodificar, asumimos que está expirado
  }
}

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  async (config) => {
    // Si es una petición de refresh, no agregamos el token
    if (config.url === "/auth/refresh") {
      return config
    }

    const token = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")

    if (token) {
      // Si el token está próximo a expirar y no estamos ya renovando
      if (isTokenExpiringSoon(token) && refreshToken && !isRefreshing) {
        isRefreshing = true
        try {
          const response = await authService.refreshToken(refreshToken)
          localStorage.setItem("access_token", response.access_token)
          localStorage.setItem("refresh_token", response.refresh_token)
          config.headers.Authorization = `Bearer ${response.access_token}`
        } catch (error) {
          // Si falla la renovación, limpiamos los tokens
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("user")
        } finally {
          isRefreshing = false
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 y no es un retry y no es una petición de login o refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) {
          return Promise.reject(error)
        }

        const response = await authService.refreshToken(refreshToken)
        localStorage.setItem("access_token", response.access_token)
        localStorage.setItem("refresh_token", response.refresh_token)

        originalRequest.headers.Authorization = `Bearer ${response.access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
