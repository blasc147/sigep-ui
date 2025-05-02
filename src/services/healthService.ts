import api from "./api"

export interface HealthResponse {
  status: string
  timestamp: string
  version: string
  database: {
    status: string
    responseTime: number
  }
}

export const healthService = {
  checkHealth: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>("/health")
    return response.data
  }
} 