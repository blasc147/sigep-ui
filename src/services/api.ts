import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Modificar la configuración de axios para incluir credenciales y manejar CORS
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
})

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    console.log("Token from localStorage:", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Authorization header:", config.headers.Authorization)
    } else {
      console.log("No token found in localStorage")
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

    // IMPORTANTE: Eliminar cualquier redirección automática al login
    // Solo manejar refresh token, pero no redireccionar automáticamente

    // Si el error es 401 y no es un retry, intentamos refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/login") {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) {
          // NO redirigir automáticamente, solo devolver el error
          return Promise.reject(error)
        }

        // Intentamos refrescar el token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token } = response.data

        // Guardamos los nuevos tokens
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("refresh_token", refresh_token)

        // Reintentamos la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // NO redirigir automáticamente, solo limpiar tokens y devolver el error
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        return Promise.reject(refreshError)
      }
    }

    // Devolver el error para que sea manejado por el componente
    return Promise.reject(error)
  },
)

export default api
