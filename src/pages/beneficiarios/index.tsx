"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { beneficiarioService } from "@/services/beneficiarioService"
import { Search, Plus, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, FileText, Edit, Eye } from "react-feather"
import { useToast } from "@/components/ui/Toast"

const BeneficiariosPage = () => {
  const router = useRouter()
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Consulta para obtener beneficiarios
  const {
    data: beneficiariosResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["beneficiarios", currentPage, pageSize],
    queryFn: () => beneficiarioService.getBeneficiarios(currentPage, pageSize),
  })

  const beneficiarios = beneficiariosResponse?.items || []
  const totalCount = beneficiariosResponse?.total || 0
  const totalPages = beneficiariosResponse?.totalPages || 1

  // Filtrar beneficiarios por término de búsqueda
  const filteredBeneficiarios = beneficiarios.filter((beneficiario) => {
    if (!searchTerm) return true

    const searchTermLower = searchTerm.toLowerCase()
    return (
      beneficiario.nombre_benef?.toLowerCase().includes(searchTermLower) ||
      beneficiario.apellido_benef?.toLowerCase().includes(searchTermLower) ||
      beneficiario.numero_doc?.toLowerCase().includes(searchTermLower)
    )
  })

  // Navegar a la página de creación
  const handleCreate = () => {
    router.push("/beneficiarios/nuevo")
  }

  // Navegar a la página de edición
  const handleEdit = (id: number) => {
    router.push(`/beneficiarios/${id}/editar`)
  }

  // Ver detalles del beneficiario
  const handleView = (id: number) => {
    router.push(`/beneficiarios/${id}`)
  }

  // Imprimir certificado
  const handlePrintCertificate = async (id: number) => {
    try {
      const blob = await beneficiarioService.imprimirCertificado(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `certificado-beneficiario-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      addToast("Certificado generado correctamente", "success")
    } catch (error) {
      addToast("Error al generar el certificado", "error")
    }
  }

  return (
    <MainLayout title="Listado de Beneficiarios">
      <div className="space-y-4">
        {/* Encabezado y botón de crear */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Beneficiarios</h2>
          <Button onClick={handleCreate} leftIcon={<Plus size={16} />}>
            Nuevo Beneficiario
          </Button>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar por nombre, apellido o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
        </div>

        {/* Mostrar error si existe */}
        {error ? (
          <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-400 font-medium">Error al cargar beneficiarios</p>
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

        {/* Tabla de beneficiarios */}
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
                    Apellido y Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha Nacimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Localidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {filteredBeneficiarios.length > 0 ? (
                  filteredBeneficiarios.map((beneficiario) => (
                    <tr key={beneficiario.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {beneficiario.apellido_benef}, {beneficiario.nombre_benef}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {beneficiario.tipo_documento} {beneficiario.numero_doc}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(beneficiario.fecha_nacimiento_benef).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {beneficiario.localidad || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2 text-brand-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(beneficiario.id!)}
                            aria-label="Ver detalles"
                            leftIcon={<Eye size={16} />}
                          >
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(beneficiario.id!)}
                            aria-label="Editar"
                            leftIcon={<Edit size={16} />}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrintCertificate(beneficiario.id!)}
                            aria-label="Imprimir certificado"
                            leftIcon={<FileText size={16} />}
                          >
                            Certificado
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No se encontraron beneficiarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-400">
              {totalCount > 0 ? (
                <>
                  Mostrando <span className="font-medium">{filteredBeneficiarios.length}</span> de{" "}
                  <span className="font-medium">{totalCount}</span> beneficiarios
                </>
              ) : (
                "No hay beneficiarios para mostrar"
              )}
            </span>
          </div>

          {totalCount > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-700 dark:text-gray-400">Filas por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  {[10, 20, 30, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  leftIcon={<ChevronLeft size={16} />}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Página <span className="font-medium">{currentPage}</span> de{" "}
                  <span className="font-medium">{totalPages}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  rightIcon={<ChevronRight size={16} />}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default BeneficiariosPage
