import React, { useEffect } from "react"
import { useGeocode } from "@/hooks/useGeocode"
import { Button } from "@/components/ui/Button"
import { RefreshCw } from "react-feather"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/components/ui/FormSection"

interface GeolocalizacionSectionProps {
  formData: {
    calle: string
    numero_calle: string
    barrio?: string
    localidad?: any
    provincia?: any
    pais_residencia?: any
    ubicacionlatitud?: number
    ubicacionlongitud?: number
    precision?: number
  }
  onChange: (field: string, value: any) => void
}

const getPrecisionColor = (precision: number) => {
  // La precisión va de 1 (muy mala) a 10 (muy buena)
  const colors = {
    1: "bg-red-500",
    2: "bg-red-400",
    3: "bg-orange-500",
    4: "bg-orange-400",
    5: "bg-yellow-500",
    6: "bg-yellow-400",
    7: "bg-lime-500",
    8: "bg-lime-400",
    9: "bg-green-500",
    10: "bg-green-400"
  }
  return colors[precision as keyof typeof colors] || "bg-gray-200"
}

const getPrecisionMessage = (precision: number) => {
  const messages = {
    1: "Precisión muy baja - Solo país",
    2: "Precisión muy baja - Solo país",
    3: "Precisión baja - Solo provincia",
    4: "Precisión baja - Solo provincia",
    5: "Precisión media - Solo ciudad",
    6: "Precisión media - Solo ciudad",
    7: "Precisión buena - Barrio aproximado",
    8: "Precisión buena - Barrio aproximado",
    9: "Precisión muy buena - Calle exacta",
    10: "Precisión excelente - Dirección exacta"
  }
  return messages[precision as keyof typeof messages] || "Precisión desconocida"
}

export const GeolocalizacionSection: React.FC<GeolocalizacionSectionProps> = ({
  formData,
  onChange
}) => {
  const { geocodeMutation, handleGeocode } = useGeocode()

  const getLocalidadId = () => {
    if (!formData.localidad) return ""
    if (typeof formData.localidad === 'string') return formData.localidad
    if (typeof formData.localidad === 'object' && formData.localidad.id) return formData.localidad.id.toString()
    if (typeof formData.localidad === 'number') return formData.localidad.toString()
    return ""
  }

  const getProvinciaId = () => {
    // Si no hay provincia o está vacía, usamos el ID de Chaco (que es 1)
    if (!formData.provincia || formData.provincia === "") return "1"
    if (typeof formData.provincia === 'string') return formData.provincia
    if (typeof formData.provincia === 'object' && formData.provincia.id) return formData.provincia.id.toString()
    if (typeof formData.provincia === 'number') return formData.provincia.toString()
    return "1" // ID de Chaco
  }

  const handleGeocodeClick = () => {
    const localidadId = getLocalidadId()
    const provinciaId = getProvinciaId()

    console.log('Geocoding with values:', {
      calle: formData.calle,
      numero: formData.numero_calle,
      barrio: formData.barrio,
      localidad: localidadId,
      provincia: provinciaId,
      pais: "2" // ID de Argentina
    })

    handleGeocode({
      calle: formData.calle || "",
      numero: formData.numero_calle || "",
      barrio: formData.barrio || "",
      localidad: localidadId,
      provincia: provinciaId,
      pais: "2" // ID de Argentina
    })
  }

  // Efecto para geocodificar automáticamente cuando los datos de dirección estén completos
  useEffect(() => {
    const localidadId = getLocalidadId()
    const provinciaId = getProvinciaId()

    console.log('Checking required fields:', {
      calle: formData.calle,
      numero: formData.numero_calle,
      localidad: localidadId,
      provincia: provinciaId,
      pais: "2" // ID de Argentina
    })

    const hasRequiredFields = formData.calle && 
                            formData.numero_calle && 
                            localidadId

    if (hasRequiredFields && !formData.ubicacionlatitud && !formData.ubicacionlongitud) {
      handleGeocodeClick()
    }
  }, [formData.calle, formData.numero_calle, formData.localidad, formData.provincia])

  useEffect(() => {
    if (geocodeMutation.data && !geocodeMutation.isError) {
      onChange("ubicacionlatitud", geocodeMutation.data.latitud)
      onChange("ubicacionlongitud", geocodeMutation.data.longitud)
      onChange("precision", geocodeMutation.data.precision)
    }
  }, [geocodeMutation.data, geocodeMutation.isError, onChange])

  return (
    <FormSection title="Geolocalización">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Latitud"
          value={formData.ubicacionlatitud || ""}
          onChange={(e) => onChange("ubicacionlatitud", e.target.value)}
          type="number"
          step="any"
          readOnly
        />
        <Input
          label="Longitud"
          value={formData.ubicacionlongitud || ""}
          onChange={(e) => onChange("ubicacionlongitud", e.target.value)}
          type="number"
          step="any"
          readOnly
        />
        <div className="col-span-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Precisión
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getPrecisionColor(formData.precision || 0)}`}
                    style={{ width: `${((formData.precision || 0) / 10) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Muy baja</span>
                  <span>Excelente</span>
                </div>
              </div>
              {formData.precision && (
                <div className="text-sm text-gray-500 min-w-[200px]">
                  {getPrecisionMessage(formData.precision)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <Button
            variant="outline"
            onClick={handleGeocodeClick}
            disabled={geocodeMutation.isPending}
            leftIcon={<RefreshCw size={16} />}
          >
            {geocodeMutation.isPending ? "Geocodificando..." : "Geocodificar Dirección"}
          </Button>
        </div>
      </div>
    </FormSection>
  )
} 