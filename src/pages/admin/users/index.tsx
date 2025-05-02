"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import { MainLayout } from "@/components/layout/MainLayout"
import { UserTable } from "@/features/admin/components/UserTable"
import { useAuth } from "@/hooks/useAuth"

const UsersPage = () => {
  const { user, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !hasRole("admin")) {
      router.push("/dashboard")
    }
  }, [user, hasRole, router])

  return (
    <MainLayout title="Administración de Usuarios">
      <div className="container mx-auto py-6">
        <UserTable />
      </div>
    </MainLayout>
  )
}

export default UsersPage
