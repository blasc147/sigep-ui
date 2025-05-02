import api from "./api"

export interface Efector {
  id: string
  nombre: string
  cuie: string
  localidad: string
  provincia: string
}

export const efectorService = {
  getEfectores: async (userId: string): Promise<Efector[]> => {
    const response = await api.get<Efector[]>(`/users/${userId}/efectores`)
    return response.data
  }
} 