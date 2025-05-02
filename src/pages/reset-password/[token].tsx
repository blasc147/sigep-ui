import type React from "react"
import type { GetServerSideProps } from "next"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"

interface ResetPasswordPageProps {
  token: string
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token }) => {
  return (
    <AuthLayout title="Restablecer Contraseña">
      <ResetPasswordForm token={token} />
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.params as { token: string }

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {
      token,
    },
  }
}

export default ResetPasswordPage
