export interface User {
  id: number
  username: string
  email: string
  roles: Role[]
  cuies: string[]
}

export interface Role {
  name: string
  permissions: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}
