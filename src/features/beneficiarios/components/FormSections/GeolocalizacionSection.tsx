import React, { useEffect, useState } from "react"
import { useGeocode } from "@/hooks/useGeocode"
import { Button } from "@/components/ui/Button"
import { MapPin, RefreshCw } from "react-feather"
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
  localidadesResidencia?: Array<{ id_localidad: number; nombre: string }>
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
  onChange,
  localidadesResidencia = []
}) => {
  const { geocodeMutation, handleGeocode } = useGeocode()
  const [isGeocoded, setIsGeocoded] = useState(false)

  // Función para obtener el nombre de una entidad por su ID
  const getEntityName = (entity: any): string => {
    if (!entity) return ""
    if (typeof entity === "string") return entity
    if (typeof entity === "number") return ""
    return entity.nombre || ""
  }

  // Función para obtener el nombre de la localidad por su ID
  const getLocalidadName = (localidadId: number | string): string => {
    if (!localidadId) return ""
    const localidad = localidadesResidencia.find(loc => loc.id_localidad === Number(localidadId))
    return localidad?.nombre || ""
  }

  const handleGeocodeClick = () => {
    const data = {
      calle: formData.calle || "",
      numero: formData.numero_calle || "",
      barrio: getEntityName(formData.barrio) || "",
      localidad: getLocalidadName(formData.localidad) || "",
      provincia: getEntityName(formData.provincia) || "Chaco",
      pais: getEntityName(formData.pais_residencia) || "Argentina"
    }

    handleGeocode(data)
  }

  useEffect(() => {
    if (geocodeMutation.data) {
      onChange("ubicacionlatitud", geocodeMutation.data.latitud)
      onChange("ubicacionlongitud", geocodeMutation.data.longitud)
      onChange("precision", geocodeMutation.data.precision)
      setIsGeocoded(true)
    }
  }, [geocodeMutation.data, onChange])

  return (
    <FormSection title="Geolocalización">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Geo-ubicación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGeocodeClick}
              isLoading={geocodeMutation.isPending}
              leftIcon={<MapPin size={16} />}
            >
              Geocodificar Dirección
            </Button>
          </div>
          {isGeocoded && formData.precision && (
            <div className="flex items-center space-x-2">
              <RefreshCw size={16} className="text-gray-500" />
              <span className="text-sm text-gray-500">
                {getPrecisionMessage(formData.precision)}
              </span>
            </div>
          )}
        </div>
        {formData.ubicacionlatitud && formData.ubicacionlongitud && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Latitud: {formData.ubicacionlatitud}, Longitud: {formData.ubicacionlongitud}
            </p>
          </div>
        )}
      </div>
    </FormSection>
  )
} 