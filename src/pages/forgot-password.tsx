import type React from "react"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"

const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout title="Recuperar Contraseña">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}

export default ForgotPasswordPage
