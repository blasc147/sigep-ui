import type React from "react"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { LoginForm } from "@/features/auth/components/LoginForm"

const LoginPage: React.FC = () => {
  return (
    <AuthLayout title="Iniciar Sesión">
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
