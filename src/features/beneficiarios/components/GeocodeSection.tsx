import React from "react"
import { Button } from "@/components/ui/Button"
import { RefreshCw } from "react-feather"
import { useGeocode } from "@/hooks/useGeocode"
import { DetailSection } from "@/components/ui/DetailSection"
import { DetailField } from "@/components/ui/DetailField"

interface GeocodeSectionProps {
  calle: string
  numero: string
  barrio?: string
  localidad: string
  provincia: string
  pais: string
  ubicacionlatitud?: number
  ubicacionlongitud?: number
  precision?: number
  onGeocodeSuccess: (data: {
    latitud: number
    longitud: number
    precision: number
    direccion_formateada: string
  }) => void
}

export const GeocodeSection: React.FC<GeocodeSectionProps> = ({
  calle,
  numero,
  barrio,
  localidad,
  provincia,
  pais,
  ubicacionlatitud,
  ubicacionlongitud,
  precision,
  onGeocodeSuccess
}) => {
  const { geocodeMutation, handleGeocode, getPrecisionMessage } = useGeocode()

  const handleGeocodeClick = () => {
    handleGeocode({
      calle,
      numero,
      barrio,
      localidad,
      provincia,
      pais
    })
  }

  React.useEffect(() => {
    if (geocodeMutation.data) {
      onGeocodeSuccess(geocodeMutation.data)
    }
  }, [geocodeMutation.data, onGeocodeSuccess])

  return (
    <DetailSection title="Geo-ubicación">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailField label="Latitud" value={ubicacionlatitud} />
        <DetailField label="Longitud" value={ubicacionlongitud} />
        <DetailField 
          label="Precisión" 
          value={
            precision ? (
              <div>
                <span>{precision}</span>
                <p className="text-sm text-gray-500 mt-1">
                  {getPrecisionMessage(precision)}
                </p>
              </div>
            ) : "-"
          } 
        />
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
    </DetailSection>
  )
} 