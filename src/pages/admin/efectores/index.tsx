"use client"

import { useQuery } from "@tanstack/react-query"
import { MainLayout } from "@/components/layout/MainLayout"
import { efectorService } from "@/services/efectorService"
import { useAuth } from "@/hooks/useAuth"
import { AlertCircle, RefreshCw, Search } from "react-feather"
import { Button } from "@/components/ui/Button"
import { useState, useMemo } from "react"

const EfectoresPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: efectores = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["efectores", user?.id],
    queryFn: () => efectorService.getEfectores(user?.id?.toString() || ""),
    enabled: !!user?.id,
  })

  const filteredEfectores = useMemo(() => {
    if (!searchTerm) return efectores

    const searchLower = searchTerm.toLowerCase()
    return efectores.filter(
      (efector) =>
        efector.nombre.toLowerCase().includes(searchLower) ||
        efector.cuie.toLowerCase().includes(searchLower) ||
        efector.localidad.toLowerCase().includes(searchLower)
    )
  }, [efectores, searchTerm])

  return (
    <MainLayout title="Efectores">
      <div className="space-y-4">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Efectores</h2>
        </div>

        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="Buscar por nombre, CUIE o localidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Mostrar error si existe */}
        {error ? (
          <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-400 font-medium">Error al cargar efectores</p>
                <p className="text-red-600 dark:text-red-300 text-sm">{(error as Error).message}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                leftIcon={<RefreshCw size={16} />}
                className="ml-4"
              >
                Reintentar
              </Button>
            </div>
          </div>
        ) : null}

        {/* Tabla de efectores */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    CUIE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Localidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {filteredEfectores.length > 0 ? (
                  filteredEfectores.map((efector) => (
                    <tr key={efector.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {efector.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {efector.cuie}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {efector.localidad}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      {searchTerm ? "No se encontraron efectores que coincidan con la búsqueda" : "No se encontraron efectores"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default EfectoresPage 