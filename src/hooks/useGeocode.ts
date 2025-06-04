import { useMutation } from "@tanstack/react-query"
import { beneficiarioService } from "@/services/beneficiarioService"
import { useToast } from "@/components/ui/Toast"

export const useGeocode = () => {
  const { addToast } = useToast()

  const geocodeMutation = useMutation({
    mutationFn: beneficiarioService.geocodeBeneficiario,
    onSuccess: (data) => {
      addToast("Geocodificación realizada correctamente", "success")
      return data
    },
    onError: (error: any) => {
      let errorMessage = "Error al geocodificar la dirección"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      addToast(errorMessage, "error")
    },
  })

  const getPrecisionMessage = (precision: number) => {
    if (precision < 6) return "La precisión de la geocodificación no es buena"
    if (precision < 8) return "La precisión de la geocodificación es aceptable"
    return "La precisión de la geocodificación es muy buena"
  }

  const handleGeocode = (data: {
    calle: string
    numero: string
    barrio?: string
    localidad: string
    provincia: string
    pais: string
  }) => {
    geocodeMutation.mutate(data)
  }

  return {
    geocodeMutation,
    handleGeocode,
    getPrecisionMessage
  }
} 