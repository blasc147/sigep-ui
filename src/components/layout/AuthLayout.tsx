"use client"

import type React from "react"
import type { ReactNode } from "react"
import Head from "next/head"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/router"
import { useEffect } from "react"


interface AuthLayoutProps {
  children: ReactNode
  title?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title = "Autenticación" }) => {
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Solo redirigir si ya se inicializó la verificación y el usuario está autenticado
    if (isInitialized && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isInitialized, router])

  // Mostrar loading mientras se verifica la autenticación inicial
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  // Si está autenticado, no renderizar nada mientras se redirige
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{title} | Sistema de Salud</title>
        <meta name="description" content="Sistema de Salud" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative h-20 w-20">
            <Image
              className="rounded-lg aspect-square object-cover"
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/loginimg-5EQAVOA3oF0BoNx7NGY1dUBxeOeycp.png"
              alt="SUMAR Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">{children}</div>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Ministerio de Salud del Chaco</p>
        </div>
      </div>
    </div>
  )
}
