export interface Permission {
  id: string
  name: string
  description: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export interface User {
  id: string
  username: string
  name: string
  password: string
  email: string
  dni: string | null
  roles: Role[]
  createdAt: string
  updatedAt: string
}

export interface Efector {
  cuie: string
  nombre: string
  localidad: string
  codigo: string
}

export interface CreateUserRequest {
  username: string
  password: string
  email: string
  name: string
  dni: string
  role: Role
  efectores: string[]
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  dni?: string
}

export interface AssignRoleRequest {
  username: string
  roleName: Role
}

export interface AssignEfectoresRequest {
  userId: string
  cuies: string[]
}
