import api from "./api"
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  AssignRoleRequest,
  AssignEfectoresRequest,
  Efector,
} from "@/types/user"

// Interfaz para la respuesta paginada según la estructura real de la API
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const userService = {
  // Obtener todos los usuarios con paginación
  getUsers: async (page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`)
    return response.data
  },

  // Obtener un usuario por ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  // Crear un nuevo usuario
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>("/users", data)
    return response.data
  },

  // Actualizar un usuario existente
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data)
    return response.data
  },

  // Asignar un rol a un usuario
  assignRole: async (data: AssignRoleRequest): Promise<void> => {
    await api.post("/users/assign-role", data)
  },

  // Asignar efectores a un usuario
  assignEfectores: async (data: AssignEfectoresRequest): Promise<void> => {
    await api.post("/users/assign-efectores", data)
  },

  // Obtener efectores de un usuario
  getUserEfectores: async (id: string): Promise<string[]> => {
    const response = await api.get<string[]>(`/users/${id}/efectores`)
    return response.data
  },

  // Obtener todos los efectores disponibles
  getEfectores: async (): Promise<Efector[]> => {
    const response = await api.get<Efector[]>("/efectores")
    return response.data
  },
}
