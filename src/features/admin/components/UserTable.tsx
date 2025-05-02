"use client"

import type React from "react"
import { useState } from "react"
import { useUserTable } from "../hooks/useUserTable"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Search, Plus, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Edit } from "react-feather"
import { UserModal } from "./UserModal"
import type { User } from "@/types/user"

export const UserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const { table, isLoading, error, globalFilter, setGlobalFilter, refetch, totalCount, pageCount, currentPage } =
    useUserTable()

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-4">
      {/* Encabezado y botón de crear siempre visibles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <Button onClick={handleCreate} leftIcon={<Plus size={16} />}>
          Nuevo Usuario
        </Button>
      </div>

      {/* Barra de búsqueda siempre visible */}
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar usuarios..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
            fullWidth
          />
        </div>
      </div>

      {/* Mostrar error si existe, pero mantener la estructura */}
      {error ? (
        <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-400 font-medium">Error al cargar usuarios</p>
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

      {/* Tabla de usuarios o indicador de carga */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          </div>
        ) : !error ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center space-x-1">
                          <span>{header.column.columnDef.header as string}</span>
                          {header.column.getCanSort() && (
                            <span>
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? " ↕️"}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {row.getVisibleCells().map((cell) => {
                      let cellContent: React.ReactNode = null

                      if (cell.column.id === "actions") {
                        cellContent = (
                          <div className="flex space-x-2 text-brand-500">
                            <Button variant="ghost" leftIcon={<Edit size={16} />} size="sm" onClick={() => handleEdit(row.original)}>
                              Editar
                            </Button>
                          </div>
                        )
                      } else if (cell.column.id === "roles") {
                        // Manejar específicamente la columna de roles
                        const roles = cell.getValue() as any[]
                        if (!roles || roles.length === 0) {
                          cellContent = "Sin roles"
                        } else {
                          try {
                            cellContent = roles.map((role) => (typeof role === "string" ? role : role.name)).join(", ")
                          } catch (e) {
                            cellContent = "Error en roles"
                          }
                        }
                      } else if (cell.column.id === "efectores") {
                        // Manejar específicamente la columna de efectores
                        const efectores = cell.getValue() as any[]
                        if (!efectores || efectores.length === 0) {
                          cellContent = "Sin efectores"
                        } else {
                          cellContent = `${efectores.length} efectores`
                        }
                      } else {
                        // Para otras columnas, asegurarse de que el valor sea renderizable
                        const value = cell.getValue()
                        if (value === null || value === undefined) {
                          cellContent = "—"
                        } else if (typeof value === "object") {
                          cellContent = JSON.stringify(value)
                        } else {
                          cellContent = String(value)
                        }
                      }

                      return (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          {cellContent}
                        </td>
                      )
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No se pueden mostrar los usuarios debido a un error. Puedes crear nuevos usuarios usando el botón "Nuevo
            Usuario".
          </div>
        )}
      </div>

      {/* Paginación mejorada - visible incluso con error pero deshabilitada */}
      <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            {!error ? (
              <>
                Mostrando <span className="font-medium">{table.getRowModel().rows.length}</span> de{" "}
                <span className="font-medium">{totalCount}</span> usuarios
              </>
            ) : (
              "Paginación no disponible"
            )}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-700 dark:text-gray-400">Filas por página:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
              disabled={!!error}
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || !!error}
              leftIcon={<ChevronLeft size={16} />}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Página <span className="font-medium">{currentPage}</span> de{" "}
              <span className="font-medium">{pageCount || 1}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || !!error}
              rightIcon={<ChevronRight size={16} />}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>

      {/* Modal siempre disponible */}
      <UserModal isOpen={isModalOpen} onClose={handleCloseModal} user={selectedUser} />
    </div>
  )
}
