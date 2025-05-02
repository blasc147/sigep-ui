"use client"

import type React from "react"
import { useAuth } from "@/hooks/useAuth"
import { MainLayout } from "@/components/layout/MainLayout"

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  console.log(user)

  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bienvenido, {user?.username}</h1>
        <p className="text-gray-600 dark:text-gray-300">Seleccione una opción del menú para comenzar.</p>
      </div>
    </MainLayout>
  )
}

export default DashboardPage
