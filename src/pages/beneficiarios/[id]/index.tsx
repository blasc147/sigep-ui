"use client"

import React, { useState } from "react"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@tanstack/react-query"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/Button"
import { beneficiarioService } from "@/services/beneficiarioService"
import { ArrowLeft, Edit, FileText, AlertCircle, RefreshCw, UserMinus } from "react-feather"
import { useToast } from "@/components/ui/Toast"
import { useMemo } from "react"
import { Dialog } from "@/components/ui/Dialog"
import { GeocodeSection } from "@/features/beneficiarios/components/GeocodeSection"

export default function BeneficiarioDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { addToast } = useToast()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const claveBeneficiario = id ? String(id) : undefined

  const { data: beneficiario, isLoading, error } = useQuery({
    queryKey: ["beneficiario", claveBeneficiario],
    queryFn: () => beneficiarioService.getBeneficiarioById(claveBeneficiario!),
    enabled: !!claveBeneficiario,
  })

  const bajaBeneficiarioMutation = useMutation({
    mutationFn: (id: number) => beneficiarioService.bajaBeneficiario(id),
    onSuccess: () => {
      addToast("Beneficiario dado de baja correctamente", "success")
      router.push("/beneficiarios")
    },
    onError: (error: any) => {
      let errorMessage = "Error al dar de baja al beneficiario"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      addToast(errorMessage, "error")
    },
  })

  /* const geocodeMutation = useMutation({
    mutationFn: beneficiarioService.geocodeBeneficiario,
    onSuccess: (data) => {
      addToast("Geocodificación realizada correctamente", "success")
      // Actualizar los campos del beneficiario
      if (beneficiario) {
        beneficiario.ubicacionlatitud = data.latitud
        beneficiario.ubicacionlongitud = data.longitud
        beneficiario.precision = data.precision
      }
    },
    onError: (error: any) => {
      let errorMessage = "Error al geocodificar la dirección"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      addToast(errorMessage, "error")
    },
  }) */

  // Función para imprimir certificado
  const handlePrintCertificate = async () => {
    if (!beneficiario?.clave_beneficiario) return

    try {
      const blob = await beneficiarioService.imprimirCertificado(beneficiario.clave_beneficiario)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `certificado-${beneficiario.clave_beneficiario}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      addToast("Certificado generado correctamente", "success")
    } catch (error) {
      addToast("Error al generar el certificado", "error")
    }
  }

  // Función para ir a la página de edición
  const handleEdit = () => {
    if (!beneficiario?.clave_beneficiario) return
    router.push(`/beneficiarios/${beneficiario.clave_beneficiario}/editar`)
  }

  const handleBaja = () => {
    if (!beneficiario?.id) return
    bajaBeneficiarioMutation.mutate(beneficiario.id)
  }

  const handleGeocode = () => {
    if (!beneficiario) return

    const data = {
      calle: beneficiario.calle || "",
      numero: beneficiario.numero_calle || "",
      barrio: beneficiario.barrio?.nombre || beneficiario.barrio || "",
      localidad: beneficiario.localidad?.nombre || beneficiario.localidad || "",
      provincia: beneficiario.provincia?.nombre || beneficiario.provincia || "Chaco",
      pais: beneficiario.pais_residencia?.nombre || beneficiario.pais_residencia || "Argentina"
    }

    /* geocodeMutation.mutate(data) */
  }

  const getPrecisionMessage = (precision: number) => {
    if (precision < 6) return "La precisión de la geocodificación no es buena"
    if (precision < 8) return "La precisión de la geocodificación es aceptable"
    return "La precisión de la geocodificación es muy buena"
  }

  return (
    <MainLayout title="Detalle de Beneficiario">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalle del Beneficiario</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push("/beneficiarios")} leftIcon={<ArrowLeft size={16} />}>
              Volver al listado
            </Button>
            <Button onClick={handleEdit} leftIcon={<Edit size={16} />}>
              Editar
            </Button>
            <Button variant="outline" onClick={handlePrintCertificate} leftIcon={<FileText size={16} />}>
              Imprimir Certificado
            </Button>
            <Button 
              variant="danger" 
              onClick={() => setShowConfirmDialog(true)}
              leftIcon={<UserMinus size={16} />}
            >
              Dar de Baja
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-400 font-medium">Error al cargar beneficiario</p>
                <p className="text-red-600 dark:text-red-300 text-sm">{(error as Error).message}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                leftIcon={<RefreshCw size={16} />}
                className="ml-4"
              >
                Reintentar
              </Button>
            </div>
          </div>
        ) : beneficiario ? (
          <div className="space-y-6">
            {/* Datos Básicos */}
            <DetailSection title="Datos Básicos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField label="Apellido" value={beneficiario.apellido_benef} />
                <DetailField label="Nombre" value={beneficiario.nombre_benef} />
                <DetailField 
                  label="Tipo de Documento" 
                  value={beneficiario.tipo_documento === 'DNI' ? 'DNI' : 
                         beneficiario.tipo_documento === 'LE' ? 'Libreta de Enrolamiento' :
                         beneficiario.tipo_documento === 'LC' ? 'Libreta Cívica' :
                         beneficiario.tipo_documento === 'CI' ? 'Cédula de Identidad' :
                         beneficiario.tipo_documento === 'PAS' ? 'Pasaporte' :
                         beneficiario.tipo_documento === 'CE' ? 'Cédula de Extranjería' :
                         beneficiario.tipo_documento === 'DE' ? 'Documento Extranjero' :
                         beneficiario.tipo_documento === 'OTRO' ? 'Otro' : beneficiario.tipo_documento} 
                />
                <DetailField label="Número de Documento" value={beneficiario.numero_doc} />
                <DetailField label="Sexo" value={beneficiario.sexo === "M" ? "Masculino" : "Femenino"} />
                <DetailField
                  label="Fecha de Nacimiento"
                  value={new Date(beneficiario.fecha_nacimiento_benef).toLocaleDateString()}
                />
                <DetailField 
                  label="Categoría" 
                  value="Categoría 5"
                />
              </div>
            </DetailSection>

            {/* Lugar de Nacimiento */}
            <DetailSection title="Lugar de Nacimiento">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField label="País" value={beneficiario.pais_nac?.nombre || beneficiario.pais_nac} />
              </div>
            </DetailSection>

            {/* Datos Educativos */}
            {(beneficiario.indigena || beneficiario.alfabeta || beneficiario.estudios) && (
              <DetailSection title="Datos Educativos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beneficiario.indigena && (
                    <DetailField
                      label="¿Pertenece a pueblo indígena?"
                      value={beneficiario.indigena === "S" ? "Sí" : "No"}
                    />
                  )}
                  {beneficiario.indigena === "S" && (
                    <>
                      <DetailField label="Tribu" value={beneficiario.id_tribu?.nombre || beneficiario.id_tribu} />
                      <DetailField label="Lengua" value={beneficiario.id_lengua?.nombre || beneficiario.id_lengua} />
                    </>
                  )}
                  {beneficiario.alfabeta && (
                    <DetailField label="¿Sabe leer y escribir?" value={beneficiario.alfabeta === "S" ? "Sí" : "No"} />
                  )}
                  {beneficiario.estudios && (
                    <DetailField 
                      label="Nivel de Estudios" 
                      value={beneficiario.estudios === "NINGUNO" ? "Ninguno" :
                             beneficiario.estudios === "PRIMARIO" ? "Primario" :
                             beneficiario.estudios === "SECUNDARIO" ? "Secundario" :
                             beneficiario.estudios === "TERCIARIO" ? "Terciario" :
                             beneficiario.estudios === "UNIVERSITARIO" ? "Universitario" :
                             beneficiario.estudios === "POSGRADO" ? "Posgrado" :
                             beneficiario.estudios === "OTRO" ? "Otro" : beneficiario.estudios} 
                    />
                  )}
                  {beneficiario.anio_mayor_nivel && (
                    <DetailField label="Año del mayor nivel alcanzado" value={beneficiario.anio_mayor_nivel} />
                  )}
                  {beneficiario.estadoest && (
                    <DetailField 
                      label="Estado de Estudios" 
                      value="Completo"
                    />
                  )}
                </div>
              </DetailSection>
            )}

            {/* Responsable */}
            {beneficiario.responsable && (
              <DetailSection title="Datos del Responsable">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Responsable" value={beneficiario.responsable} />
                  {beneficiario.responsable === "MADRE" && (
                    <>
                      <DetailField label="Tipo de Documento" value={beneficiario.tipo_doc_madre} />
                      <DetailField label="Número de Documento" value={beneficiario.nro_doc_madre} />
                      <DetailField label="Nombre" value={beneficiario.nombre_madre} />
                      <DetailField label="Apellido" value={beneficiario.apellido_madre} />
                      <DetailField
                        label="¿Sabe leer y escribir?"
                        value={beneficiario.alfabeta_madre === "S" ? "Sí" : "No"}
                      />
                      <DetailField label="Nivel de Estudios" value={beneficiario.estudios_madre} />
                      <DetailField label="Año del mayor nivel alcanzado" value={beneficiario.anio_mayor_nivel_madre} />
                      <DetailField label="Estado de Estudios" value={beneficiario.estadoest_madre} />
                    </>
                  )}
                  {beneficiario.responsable === "PADRE" && (
                    <>
                      <DetailField label="Tipo de Documento" value={beneficiario.tipo_doc_padre} />
                      <DetailField label="Número de Documento" value={beneficiario.nro_doc_padre} />
                      <DetailField label="Nombre" value={beneficiario.nombre_padre} />
                      <DetailField label="Apellido" value={beneficiario.apellido_padre} />
                      <DetailField
                        label="¿Sabe leer y escribir?"
                        value={beneficiario.alfabeta_padre === "S" ? "Sí" : "No"}
                      />
                      <DetailField label="Nivel de Estudios" value={beneficiario.estudios_padre} />
                      <DetailField label="Año del mayor nivel alcanzado" value={beneficiario.anio_mayor_nivel_padre} />
                      <DetailField label="Estado de Estudios" value={beneficiario.estadoest_padre} />
                    </>
                  )}
                  {beneficiario.responsable === "TUTOR" && (
                    <>
                      <DetailField label="Tipo de Documento" value={beneficiario.tipo_doc_tutor} />
                      <DetailField label="Número de Documento" value={beneficiario.nro_doc_tutor} />
                      <DetailField label="Nombre" value={beneficiario.nombre_tutor} />
                      <DetailField label="Apellido" value={beneficiario.apellido_tutor} />
                      <DetailField
                        label="¿Sabe leer y escribir?"
                        value={beneficiario.alfabeta_tutor === "S" ? "Sí" : "No"}
                      />
                      <DetailField label="Nivel de Estudios" value={beneficiario.estudios_tutor} />
                      <DetailField label="Año del mayor nivel alcanzado" value={beneficiario.anio_mayor_nivel_tutor} />
                      <DetailField label="Estado de Estudios" value={beneficiario.estadoest_tutor} />
                    </>
                  )}
                </div>
              </DetailSection>
            )}

            {/* Embarazo (solo para sexo F) */}
            {beneficiario.sexo === "F" && (
              <DetailSection title="Datos de Embarazo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="¿Está embarazada?" value={beneficiario.menor_embarazada === "S" ? "Sí" : "No"} />
                  {beneficiario.menor_embarazada === "S" && (
                    <>
                      <DetailField
                        label="Fecha de Diagnóstico"
                        value={
                          isDefaultDate(beneficiario.fecha_diagnostico_embarazo)
                            ? "-"
                            : new Date(beneficiario.fecha_diagnostico_embarazo).toLocaleDateString()
                        }
                      />
                      <DetailField label="Semanas de Embarazo" value={beneficiario.semanas_embarazo} />
                      <DetailField
                        label="Fecha Probable de Parto"
                        value={
                          isDefaultDate(beneficiario.fecha_probable_parto)
                            ? "-"
                            : new Date(beneficiario.fecha_probable_parto).toLocaleDateString()
                        }
                      />
                      <DetailField
                        label="Fecha Efectiva de Parto"
                        value={
                          isDefaultDate(beneficiario.fecha_efectiva_parto)
                            ? "-"
                            : new Date(beneficiario.fecha_efectiva_parto).toLocaleDateString()
                        }
                      />
                      <DetailField
                        label="Fecha Última Menstruación"
                        value={isDefaultDate(beneficiario.fum) ? "-" : new Date(beneficiario.fum).toLocaleDateString()}
                      />
                    </>
                  )}
                </div>
              </DetailSection>
            )}

            {/* Efectores */}
            <DetailSection title="Efectores">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField label="Efector Asignado" value={beneficiario.cuie_ea} />
                <DetailField label="Efector Habitual" value={beneficiario.cuie_ah} />
                {beneficiario.cuieefectoracargo && (
                  <DetailField label="Efector a Cargo" value={beneficiario.cuieefectoracargo} />
                )}
              </div>
            </DetailSection>

            {/* Convivencia (solo para id_categoria 5) */}
            {beneficiario.id_categoria === 5 && (
              <DetailSection title="Convivencia">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField
                    label="¿El menor convive con un adulto?"
                    value={beneficiario.menor_convive_con_adulto === "S" ? "Sí" : "No"}
                  />
                </div>
              </DetailSection>
            )}

            {/* Dirección */}
            <DetailSection title="Dirección">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField label="País" value={beneficiario.pais_residencia?.nombre || beneficiario.pais_residencia || "Argentina"} />
                <DetailField label="Provincia" value={beneficiario.provincia?.nombre || beneficiario.provincia || "Chaco"} />
                <DetailField label="Departamento" value={beneficiario.departamento?.nombre || beneficiario.departamento} />
                <DetailField label="Localidad" value={beneficiario.localidad?.nombre || beneficiario.localidad} />
                <DetailField label="Municipio" value={beneficiario.municipio?.nombre || beneficiario.municipio} />
                <DetailField label="Barrio" value={beneficiario.barrio?.nombre || beneficiario.barrio} />
                <DetailField label="Calle" value={beneficiario.calle} />
                <DetailField label="Número" value={beneficiario.numero_calle} />
                <DetailField label="Piso" value={beneficiario.piso} />
                <DetailField label="Departamento" value={beneficiario.dpto} />
                <DetailField label="Manzana" value={beneficiario.manzana} />
                <DetailField label="Entre Calle 1" value={beneficiario.entre_calle_1} />
                <DetailField label="Entre Calle 2" value={beneficiario.entre_calle_2} />
                <DetailField label="Código Postal" value={beneficiario.cod_pos?.codigopostal || beneficiario.cod_pos} />
              </div>
            </DetailSection>

            {/* Contacto */}
            {(beneficiario.telefono || beneficiario.celular || beneficiario.otrotel || beneficiario.mail) && (
              <DetailSection title="Contacto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Teléfono" value={beneficiario.telefono} />
                  <DetailField label="Celular" value={beneficiario.celular} />
                  <DetailField label="Otro Teléfono" value={beneficiario.otrotel} />
                  <DetailField label="Email" value={beneficiario.mail} />
                </div>
              </DetailSection>
            )}

            {/* Discapacidades */}
            {(beneficiario.discv ||
              beneficiario.disca ||
              beneficiario.discmo ||
              beneficiario.discme ||
              beneficiario.otradisc) && (
              <DetailSection title="Discapacidades">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Discapacidad Visual" value={beneficiario.discv === "S" ? "Sí" : "No"} />
                  <DetailField label="Discapacidad Auditiva" value={beneficiario.disca === "S" ? "Sí" : "No"} />
                  <DetailField label="Discapacidad Motriz" value={beneficiario.discmo === "S" ? "Sí" : "No"} />
                  <DetailField label="Discapacidad Mental" value={beneficiario.discme === "S" ? "Sí" : "No"} />
                  <DetailField label="Otra Discapacidad" value={beneficiario.otradisc} />
                </div>
              </DetailSection>
            )}

            {/* Factores de Riesgo */}
            {(beneficiario.fumador ||
              beneficiario.diabetes ||
              beneficiario.infarto ||
              beneficiario.acv ||
              beneficiario.hta ||
              beneficiario.estatinas ||
              beneficiario.score_riesgo) && (
              <DetailSection title="Factores de Riesgo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailField label="Fumador" value={beneficiario.fumador === "S" ? "Sí" : "No"} />
                  <DetailField label="Diabetes" value={beneficiario.diabetes === "S" ? "Sí" : "No"} />
                  <DetailField label="Infarto" value={beneficiario.infarto === "S" ? "Sí" : "No"} />
                  <DetailField label="ACV" value={beneficiario.acv === "S" ? "Sí" : "No"} />
                  <DetailField label="HTA" value={beneficiario.hta === "S" ? "Sí" : "No"} />
                  <DetailField label="Estatinas" value={beneficiario.estatinas === "S" ? "Sí" : "No"} />
                  <DetailField label="Score de Riesgo" value={beneficiario.score_riesgo} />
                </div>
              </DetailSection>
            )}

            {/* Geo-ubicación */}
            <DetailSection title="Geo-ubicación">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {beneficiario.ubicacionlatitud && beneficiario.ubicacionlongitud ? (
                  <>
                    <DetailField label="Latitud" value={beneficiario.ubicacionlatitud} />
                    <DetailField label="Longitud" value={beneficiario.ubicacionlongitud} />
                    {beneficiario.precision && (
                      <DetailField 
                        label="Precisión" 
                        value={getPrecisionMessage(beneficiario.precision)} 
                      />
                    )}
                  </>
                ) : (
                  <div className="col-span-2">
                    <p className="text-gray-500 dark:text-gray-400">No hay coordenadas registradas</p>
                  </div>
                )}
              </div>
            </DetailSection>

            {/* Datos Administrativos */}
            <DetailSection title="Datos Administrativos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField
                  label="Fecha de Inscripción"
                  value={new Date(beneficiario.fecha_inscripcion).toLocaleDateString()}
                />
                <DetailField label="Fecha de Carga" value={new Date(beneficiario.fecha_carga).toLocaleDateString()} />
                <DetailField label="Usuario de Carga" value={beneficiario.usuario_carga} />
                <DetailField 
                  label="Estado" 
                  value={
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      beneficiario.activo === "S" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" 
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                    }`}>
                      {beneficiario.activo === "S" ? "Activo" : "Inactivo"}
                    </span>
                  } 
                />
                <div className="col-span-2">
                  <DetailField label="Observaciones" value={beneficiario.observaciones} />
                </div>
                <div className="col-span-2">
                  <DetailField label="Observaciones Generales" value={beneficiario.obsgenerales} />
                </div>
              </div>
            </DetailSection>
          </div>
        ) : (
          <div className="text-center py-10">No se encontró información del beneficiario</div>
        )}

        <Dialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          title="Confirmar Baja"
          description={`¿Está seguro que desea dar de baja al beneficiario ${beneficiario?.apellido_benef} ${beneficiario?.nombre_benef} (DNI: ${beneficiario?.numero_doc})? Esta acción no se puede deshacer.`}
        >
          <div className="mt-4 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleBaja}
              disabled={bajaBeneficiarioMutation.isPending}
            >
              Confirmar Baja
            </Button>
          </div>
        </Dialog>
      </div>
    </MainLayout>
  )
}

// Función para verificar si una fecha es la fecha por defecto (1900-01-01 o 1899-12-30)
const isDefaultDate = (dateString: string): boolean => {
  if (!dateString) return true
  return dateString?.includes("1900-01-01") || dateString?.includes("1899-12-30")
}

// Componente para secciones de detalle
const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// Fix the DetailField component to properly handle nested objects
const DetailField: React.FC<{ label: string; value: any }> = ({ label, value }) => {
  // Formatear el valor para mostrar
  const displayValue = useMemo(() => {
    if (value === undefined || value === null || value === "") {
      return "—"
    }

    // Si es un elemento React, lo devolvemos directamente
    if (React.isValidElement(value)) {
      return value
    }

    if (typeof value === "object") {
      // Handle Date objects
      if (value instanceof Date) {
        return value.toLocaleDateString()
      }

      // Handle objects with id and name properties (like provincia_nac, localidad, etc.)
      if (value.nombre) {
        return value.nombre
      }

      // Handle cod_pos object
      if (value.codigopostal) {
        return value.codigopostal
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return value.join(", ")
      }

      // For other objects, convert to string
      return JSON.stringify(value)
    }

    return String(value)
  }, [value])

  return (
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-base text-gray-900 dark:text-white">{displayValue}</p>
    </div>
  )
}
