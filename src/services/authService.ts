import api from "./api"
import type { LoginRequest, LoginResponse, ForgotPasswordRequest, ResetPasswordRequest } from "@/types/auth"

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", data)
      return response.data
    } catch (error) {
      // Propagar el error para que sea manejado por el hook
      throw error
    }
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await api.post("/auth/forgot-password", data)
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post("/auth/reset-password", data)
  },

  logout: (): void => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  },
}
