import { useQuery } from "@tanstack/react-query"
import { beneficiarioService } from "@/services/beneficiarioService"

export const useBeneficiario = (claveBeneficiario: string) => {
  return useQuery({
    queryKey: ["beneficiario", claveBeneficiario],
    queryFn: () => beneficiarioService.getBeneficiarioById(claveBeneficiario)
  })
} 