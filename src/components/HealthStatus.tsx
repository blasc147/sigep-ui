"use client"

import { useEffect, useState } from "react"
import { healthService } from "@/services/healthService"
import { AlertCircle, CheckCircle } from "react-feather"

export const HealthStatus = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthService.checkHealth()
        setIsHealthy(response.status === "up" && response.database.status === "up")
        setError(null)
      } catch (err) {
        setIsHealthy(false)
        setError("No se pudo conectar con el servidor")
      }
    }

    // Verificar inmediatamente
    checkHealth()

    // Verificar cada 30 segundos
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isHealthy === null) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isHealthy && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 dark:text-red-400 mr-2" size={20} />
            <div>
              <p className="text-red-700 dark:text-red-200 font-medium">
                {error || "Problemas de conexión con el servidor"}
              </p>
              <p className="text-red-600 dark:text-red-300 text-sm">
                Por favor, intente nuevamente más tarde
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 