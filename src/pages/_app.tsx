"use client"

import { useEffect } from "react"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { ToastProvider } from "@/components/ui/Toast"
import "@/styles/globals.css"

// Crear un cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  // Efecto para cargar el tema desde localStorage
  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window !== "undefined") {
      // Verificar si hay un tema guardado
      const savedTheme = localStorage.getItem("theme")
      if (savedTheme) {
        document.documentElement.classList.toggle("dark", savedTheme === "dark")
      } else {
        // Si no hay tema guardado, usar la preferencia del sistema
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        document.documentElement.classList.toggle("dark", prefersDark)
      }
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
