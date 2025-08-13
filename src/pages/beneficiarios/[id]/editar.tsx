"use client"

import { useRouter } from "next/router"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/Button"
import { useEditBeneficiarioForm } from "@/features/beneficiarios/hooks/useEditBeneficiarioForm"
import { DatosBasicosSection } from "@/features/beneficiarios/components/FormSections/DatosBasicosSection"
import { LugarNacimientoSection } from "@/features/beneficiarios/components/FormSections/LugarNacimientoSection"
import { DatosEducativosSection } from "@/features/beneficiarios/components/FormSections/DatosEducativosSection"
import { ResponsableSection } from "@/features/beneficiarios/components/FormSections/ResponsableSection"
import { EmbarazoSection } from "@/features/beneficiarios/components/FormSections/EmbarazoSection"
import { EfectoresSection } from "@/features/beneficiarios/components/FormSections/EfectoresSection"
import { ConvivenciaSection } from "@/features/beneficiarios/components/FormSections/ConvivenciaSection"
import { DireccionSection } from "@/features/beneficiarios/components/FormSections/DireccionSection"
import { ContactoSection } from "@/features/beneficiarios/components/FormSections/ContactoSection"
import { DiscapacidadesSection } from "@/features/beneficiarios/components/FormSections/DiscapacidadesSection"
import { FactoresRiesgoSection } from "@/features/beneficiarios/components/FormSections/FactoresRiesgoSection"
import { DatosAdministrativosSection } from "@/features/beneficiarios/components/FormSections/DatosAdministrativosSection"
import { GeolocalizacionSection } from "@/features/beneficiarios/components/FormSections/GeolocalizacionSection"
import { ErrorSummary } from "@/features/beneficiarios/components/ErrorSummary"
import { Save, ArrowLeft, AlertCircle, RefreshCw } from "react-feather"
import { useEffect } from "react"

const EditarBeneficiarioPage = () => {
  const router = useRouter()
  const { id } = router.query
  const beneficiarioId = id ? Number(id) : undefined

  const {
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    sexo,
    responsable,
    idCategoria,
    indigena,
    menorEmbarazada,
    paises,
    provinciasNac,
    provinciasResidencia,
    departamentosNac,
    departamentosResidencia,
    localidadesNac,
    localidadesResidencia,
    municipios,
    barrios,
    calles,
    codigosPostales,
    categorias,
    tribus,
    lenguas,
    efectores,
    isLoadingEfectores,
    paisId,
    setPaisId,
    paisResidenciaId,
    setPaisResidenciaId,
    provinciaNacId,
    setProvinciaNacId,
    provinciaResidenciaId,
    setProvinciaResidenciaId,
    departamentoNacId,
    setDepartamentoNacId,
    departamentoResidenciaId,
    setDepartamentoResidenciaId,
    localidadResidenciaId,
    setLocalidadResidenciaId,
    municipioId,
    setMunicipioId,
    onSubmit,
    updateBeneficiarioMutation,
    beneficiario,
    isLoadingBeneficiario,
    beneficiarioError,
    isFormLoaded,
    setValue,
    loadBeneficiarioData,
  } = useEditBeneficiarioForm(beneficiarioId)

  // Forzar la carga del formulario después de 3 segundos si aún no se ha cargado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isFormLoaded && beneficiario) {
        console.log("Forzando carga del formulario después de timeout")
        loadBeneficiarioData(beneficiario)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isFormLoaded, beneficiario, loadBeneficiarioData])

  // Mostrar el formulario solo cuando el beneficiario esté cargado Y el formulario esté listo
  const shouldShowForm = beneficiario && !isLoadingBeneficiario && isFormLoaded

  const handleRetry = () => {
    router.reload()
  }

  return (
    <MainLayout title="Editar Beneficiario">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Beneficiario</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/beneficiarios/${beneficiarioId}`)}
            leftIcon={<ArrowLeft size={16} />}
          >
            Volver al detalle
          </Button>
        </div>

        {isLoadingBeneficiario || !isFormLoaded ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            <p className="text-gray-500 dark:text-gray-400">
              {isLoadingBeneficiario ? "Cargando datos del beneficiario..." : "Preparando formulario..."}
            </p>
          </div>
        ) : beneficiarioError ? (
          <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-400 font-medium">Error al cargar beneficiario</p>
                <p className="text-red-600 dark:text-red-300 text-sm">{(beneficiarioError as Error).message}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                leftIcon={<RefreshCw size={16} />}
                className="ml-4"
              >
                Reintentar
              </Button>
            </div>
          </div>
        ) : shouldShowForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Datos básicos */}
            <DatosBasicosSection 
              control={control} 
              register={register} 
              errors={errors} 
              categorias={categorias} 
              setValue={setValue}
              isEditMode={true}
            />

            {/* Lugar de nacimiento */}
            <LugarNacimientoSection
              control={control}
              errors={errors}
              paises={paises}
              paisId={paisId}
              setPaisId={setPaisId}
              tribus={tribus}
              lenguas={lenguas}
              indigena={indigena}
            />

            {/* Datos educativos */}
            <DatosEducativosSection
              control={control}
              register={register}
              errors={errors}
            />

            {/* Datos del responsable */}
            <ResponsableSection 
              control={control} 
              register={register} 
              errors={errors} 
              responsable={responsable} 
              idCategoria={idCategoria}
            />

            {/* Embarazo (solo para sexo F) */}
            {sexo === "F" && (
              <EmbarazoSection
                control={control}
                register={register}
                errors={errors}
                menorEmbarazada={menorEmbarazada}
                setValue={setValue}
              />
            )}

            {/* Efectores */}
            <EfectoresSection 
              control={control} 
              errors={errors} 
              efectores={efectores} 
              isLoading={isLoadingEfectores} 
              setValue={setValue}
            />

            {/* Convive con adulto (solo para id_categoria 5) */}
            {idCategoria === 5 && <ConvivenciaSection control={control} errors={errors} />}

            {/* Dirección */}
            <DireccionSection
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              paises={paises}
              provinciasResidencia={provinciasResidencia}
              departamentosResidencia={departamentosResidencia}
              localidadesResidencia={localidadesResidencia}
              municipios={municipios}
              barrios={barrios}
              calles={calles}
              codigosPostales={codigosPostales}
              paisResidenciaId={paisResidenciaId}
              setPaisResidenciaId={setPaisResidenciaId}
              provinciaResidenciaId={provinciaResidenciaId}
              setProvinciaResidenciaId={setProvinciaResidenciaId}
              departamentoResidenciaId={departamentoResidenciaId}
              setDepartamentoResidenciaId={setDepartamentoResidenciaId}
              localidadResidenciaId={localidadResidenciaId}
              setLocalidadResidenciaId={setLocalidadResidenciaId}
              municipioId={municipioId}
              setMunicipioId={setMunicipioId}
            />

            {/* Geo-ubicación */}
            <GeolocalizacionSection
              formData={control._formValues}
              onChange={(field, value) => setValue(field, value)}
              localidadesResidencia={localidadesResidencia}
            />

            {/* Contacto */}
            <ContactoSection register={register} errors={errors} />

            {/* Discapacidades */}
            <DiscapacidadesSection control={control} register={register} errors={errors} />

            {/* Factores de riesgo */}
            <FactoresRiesgoSection control={control} register={register} errors={errors} />

            {/* Datos administrativos */}
            <DatosAdministrativosSection 
              control={control} 
              register={register} 
              errors={errors} 
              setValue={setValue}
              isEditMode={true}
            />

            {/* Botones de acción */}
            <div className="mt-8">
              {/* Resumen de errores - se muestra solo si hay errores */}
              {Object.keys(errors).length > 0 && <ErrorSummary errors={errors} />}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.push(`/beneficiarios/${beneficiarioId}`)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting || updateBeneficiarioMutation.isPending}
                  leftIcon={<Save size={18} />}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default EditarBeneficiarioPage
