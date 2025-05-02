"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MainLayout } from "@/components/layout/MainLayout"
import { archivoAService } from "@/services/archivoAService"
import { useAuth } from "@/hooks/useAuth"
import { AlertCircle, RefreshCw, FileText } from "react-feather"
import { Button } from "@/components/ui/Button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { Dialog } from "@/components/ui/Dialog"

const GeneracionArchivoAPage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const {
    data: archivosEnviados = { items: [] },
    isLoading: isLoadingArchivos,
    error: errorArchivos,
    refetch: refetchArchivos,
  } = useQuery({
    queryKey: ["archivos-enviados"],
    queryFn: () => archivoAService.getArchivosEnviados(),
  })

  const {
    data: beneficiariosNoEnviados,
    isLoading: isLoadingBeneficiarios,
    error: errorBeneficiarios,
  } = useQuery({
    queryKey: ["beneficiarios-no-enviados"],
    queryFn: () => archivoAService.getBeneficiariosNoEnviados(),
  })

  const generateArchivoMutation = useMutation({
    mutationFn: archivoAService.generateArchivoA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archivos-enviados"] })
      queryClient.invalidateQueries({ queryKey: ["beneficiarios-no-enviados"] })
    },
  })

  const handleGenerateArchivo = () => {
    generateArchivoMutation.mutate()
    setIsConfirmDialogOpen(false)
  }

  return (
    <MainLayout title="Generación del Archivo A">
      <div className="space-y-6">
        {/* Información del nuevo archivo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Nuevo Archivo A</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de generación</p>
              <p className="font-medium">{format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Usuario</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiarios a incluir</p>
              {isLoadingBeneficiarios ? (
                <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              ) : errorBeneficiarios ? (
                <p className="text-red-500">Error al cargar</p>
              ) : (
                <p className="font-medium">{beneficiariosNoEnviados?.total || 0}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => setIsConfirmDialogOpen(true)}
              disabled={!beneficiariosNoEnviados?.total || generateArchivoMutation.isPending}
              leftIcon={<FileText size={16} />}
            >
              {generateArchivoMutation.isPending ? "Generando..." : "Generar Archivo A"}
            </Button>
          </div>
        </div>

        {/* Listado de archivos existentes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Archivos Generados</h2>

            {/* Mostrar error si existe */}
            {errorArchivos ? (
              <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-2" size={20} />
                  <div className="flex-1">
                    <p className="text-red-700 dark:text-red-400 font-medium">Error al cargar archivos</p>
                    <p className="text-red-600 dark:text-red-300 text-sm">{(errorArchivos as Error).message}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchArchivos()}
                    leftIcon={<RefreshCw size={16} />}
                    className="ml-4"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Tabla de archivos */}
            <div className="overflow-x-auto">
              {isLoadingArchivos ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Archivo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Registros
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Usuario
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    {archivosEnviados.items.length > 0 ? (
                      archivosEnviados.items.map((archivo) => (
                        <tr key={archivo.id_archivos_enviados} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(archivo.fecha_generacion), "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {archivo.nombre_archivo_enviado}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {archivo.estado === "E" ? "Enviado" : "Error"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {archivo.cantidad_registros_enviados}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {archivo.usuario}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                          No se encontraron archivos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación */}
      <Dialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        title="Generar Archivo A"
        description={`¿Estás seguro que deseas generar un nuevo Archivo A con ${beneficiariosNoEnviados?.total || 0} beneficiarios?`}
      >
        <div className="mt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleGenerateArchivo} disabled={generateArchivoMutation.isPending}>
            {generateArchivoMutation.isPending ? "Generando..." : "Generar"}
          </Button>
        </div>
      </Dialog>
    </MainLayout>
  )
}

export default GeneracionArchivoAPage 