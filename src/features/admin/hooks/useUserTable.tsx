"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userService } from "@/services/userService"
import { useToast } from "@/components/ui/Toast"
import type { User } from "@/types/user"
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table"

const columnHelper = createColumnHelper<User>()

export const useUserTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [rowSelection, setRowSelection] = useState({})

  // Estado para la paginación controlada por el servidor
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Estado para el total de registros
  const [totalCount, setTotalCount] = useState(0)

  const queryClient = useQueryClient()
  const { addToast } = useToast()

  // Consulta para obtener usuarios con paginación
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", pagination.pageIndex, pagination.pageSize],
    queryFn: () => userService.getUsers(pagination.pageIndex + 1, pagination.pageSize),
    onSuccess: (data) => {
      // Actualizar el total de registros
      setTotalCount(data.total)
    },
    onError: (error: Error) => {
      addToast(`Error al cargar usuarios: ${error.message}`, "error")
    },
  })

  // Extraer los usuarios de la respuesta paginada
  const users = usersResponse?.items || []

  // Mutación para eliminar usuario (si se necesita)
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      // Implementar si hay un endpoint para eliminar usuarios
      // await userService.deleteUser(id);
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      addToast("Usuario eliminado correctamente", "success")
    },
    onError: (error: Error) => {
      addToast(`Error al eliminar usuario: ${error.message}`, "error")
    },
  })

  // Columnas de la tabla
  const columns = [
    columnHelper.accessor("username", {
      header: "Usuario",
      cell: (info) => String(info.getValue() || "—"),
    }),
    columnHelper.accessor("name", {
      header: "Nombre",
      cell: (info) => String(info.getValue() || "—"),
    }),
    columnHelper.accessor("dni", {
      header: "DNI",
      cell: (info) => String(info.getValue() || "No especificado"),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => String(info.getValue() || "—"),
    }),
    columnHelper.accessor("roles", {
      header: "Roles",
      // No definimos una función cell aquí, lo manejaremos directamente en el componente
    }),
    columnHelper.accessor("efectores", {
      header: "Efectores",
      // No definimos una función cell aquí, lo manejaremos directamente en el componente
    }),
    columnHelper.display({
      id: "actions",
      header: "Acciones",
    }),
  ]

  // Configuración de la tabla
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
    manualPagination: true, // Indicar que la paginación es manual (controlada por el servidor)
    pageCount: usersResponse?.totalPages || -1, // Total de páginas desde la API
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Funciones de manejo
  const handleEdit = (user: User) => {
    // Esta función será implementada en el componente padre
    console.log("Edit user:", user)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
      deleteUserMutation.mutate(id)
    }
  }

  return {
    table,
    isLoading,
    error,
    globalFilter,
    setGlobalFilter,
    handleEdit,
    handleDelete,
    refetch,
    totalCount,
    pageCount: usersResponse?.totalPages || 0,
    currentPage: pagination.pageIndex + 1,
  }
}
