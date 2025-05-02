import api from "./api"

export interface ArchivoEnviado {
  id_archivos_enviados: number
  fecha_generacion: string
  estado: string
  usuario: string
  nombre_archivo_enviado: string
  cantidad_registros_enviados: number
  id_comienzo_lote: number
}

export interface BeneficiariosNoEnviados {
  total: number
  altas: number
  modificaciones: number
  bajas: number
}

export const archivoAService = {
  getArchivosEnviados: async (page: number = 1, limit: number = 10): Promise<{ items: ArchivoEnviado[] }> => {
    const response = await api.get<{ items: ArchivoEnviado[] }>(`/files/archivos-enviados?page=${page}&limit=${limit}`)
    return response.data
  },

  getBeneficiariosNoEnviados: async (): Promise<BeneficiariosNoEnviados> => {
    const response = await api.get<BeneficiariosNoEnviados>("/files/beneficiarios-no-enviados")
    return response.data
  },

  generateArchivoA: async (): Promise<void> => {
    await api.post("/files/generate-beneficiarios")
  }
} 