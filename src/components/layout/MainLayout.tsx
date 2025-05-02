"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Sidebar } from "./Sidebar"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useAuth } from "@/hooks/useAuth"

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title = "Dashboard" }) => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Verificar autenticación y redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // No renderizar nada si no está autenticado
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{title} | Sistema de Salud</title>
        <meta name="description" content="Sistema de Salud" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-64">
        <header className="bg-brand-500 shadow h-16 flex items-center justify-end px-4">
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
