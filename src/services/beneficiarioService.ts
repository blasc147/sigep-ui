import api from "./api"
import type {
  Beneficiario,
  BeneficiarioCreateRequest,
  Pais,
  Provincia,
  Localidad,
  Departamento,
  Municipio,
  Barrio,
  Categoria,
  Tribu,
  Lengua,
  Efector,
} from "@/types/beneficiario"

// Interfaz para la respuesta paginada
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const beneficiarioService = {
  // Beneficiarios CRUD
  getBeneficiarios: async (page = 1, limit = 10, searchParams?: { apellido_benef?: string; nombre_benef?: string; numero_doc?: string }): Promise<PaginatedResponse<Beneficiario>> => {
    let url = `/beneficiarios?page=${page}&limit=${limit}`
    
    if (searchParams) {
      if (searchParams.apellido_benef) {
        url += `&apellido_benef=${encodeURIComponent(searchParams.apellido_benef)}`
      }
      if (searchParams.nombre_benef) {
        url += `&nombre_benef=${encodeURIComponent(searchParams.nombre_benef)}`
      }
      if (searchParams.numero_doc) {
        url += `&numero_doc=${encodeURIComponent(searchParams.numero_doc)}`
      }
    }
    
    const response = await api.get<PaginatedResponse<Beneficiario>>(url)
    return response.data
  },

  getBeneficiarioById: async (id: number): Promise<Beneficiario> => {
    try {
      const response = await api.get<Beneficiario>(`/beneficiarios/${id}`)
      console.log("API response for beneficiario details:", response.data)
      return response.data
    } catch (error) {
      console.error("Error fetching beneficiario details:", error)
      throw error
    }
  },

  getBeneficiarioByDocumento: async (numeroDoc: string): Promise<Beneficiario> => {
    const response = await api.get<Beneficiario>(`/beneficiarios/documento/${numeroDoc}`)
    return response.data
  },

  createBeneficiario: async (data: BeneficiarioCreateRequest): Promise<Beneficiario> => {
    const response = await api.post<Beneficiario>("/beneficiarios", data)
    return response.data
  },

  updateBeneficiario: async (id: number, data: Partial<BeneficiarioCreateRequest>): Promise<Beneficiario> => {
    const response = await api.patch<Beneficiario>(`/beneficiarios/${id}`, data)
    return response.data
  },

  deleteBeneficiario: async (id: number): Promise<void> => {
    await api.delete(`/beneficiarios/${id}`)
  },

  // Datos de referencia
  getPaises: async (): Promise<Pais[]> => {
    const response = await api.get<Pais[]>("/auxiliary/paises")
    return response.data
  },

  getProvincias: async (paisId: string): Promise<Provincia[]> => {
    const response = await api.get<Provincia[]>(`/auxiliary/paises/${paisId}/provincias`)
    return response.data
  },

  getDepartamentos: async (provinciaId: string): Promise<Departamento[]> => {
    const response = await api.get<Departamento[]>(`/auxiliary/provincias/${provinciaId}/departamentos`)
    return response.data
  },

  getLocalidades: async (departamentoId: string): Promise<Localidad[]> => {
    const response = await api.get<Localidad[]>(`/auxiliary/departamentos/${departamentoId}/localidades`)
    return response.data
  },

  getMunicipios: async (localidadId: string): Promise<Municipio[]> => {
    const response = await api.get<Municipio[]>(`/auxiliary/localidades/${localidadId}/municipios`)
    return response.data
  },

  getBarrios: async (municipioId: string): Promise<Barrio[]> => {
    const response = await api.get<Barrio[]>(`/auxiliary/municipios/${municipioId}/barrios`)
    return response.data
  },

  getCategorias: async (): Promise<Categoria[]> => {
    const response = await api.get<Categoria[]>("/auxiliary/categorias")
    return response.data
  },

  getTribus: async (): Promise<Tribu[]> => {
    const response = await api.get<Tribu[]>("/auxiliary/tribus")
    return response.data
  },

  getLenguas: async (): Promise<Lengua[]> => {
    const response = await api.get<Lengua[]>("/auxiliary/lenguas")
    return response.data
  },

  getEfectores: async (): Promise<Efector[]> => {
    const response = await api.get<Efector[]>("/efectores")
    return response.data
  },

  imprimirCertificado: async (id: number): Promise<Blob> => {
    const response = await api.get(`/beneficiarios/${id}/certificado`, {
      responseType: "blob",
    })
    return response.data
  },

  getCodigosPostales: async (localidadId: string): Promise<string[]> => {
    const response = await api.get<string[]>(`/auxiliary/localidades/${localidadId}/codpost`)
    return response.data
  },

  getCalles: async (localidadId: string): Promise<string[]> => {
    const response = await api.get<string[]>(`/auxiliary/localidades/${localidadId}/calles`)
    return response.data
  },
}
