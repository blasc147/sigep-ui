"use client"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/Button"
import { useBeneficiarioForm } from "@/features/beneficiarios/hooks/useBeneficiarioForm"
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
// import { GeolocalizacionSection } from "@/features/beneficiarios/components/FormSections/GeolocalizacionSection"
import { Save, ArrowLeft } from "react-feather"
import { ErrorSummary } from "@/features/beneficiarios/components/ErrorSummary"

const NuevoBeneficiarioPage = () => {
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
    createBeneficiarioMutation,
    router,
    setValue,
  } = useBeneficiarioForm()

  return (
    <MainLayout title="Inscribir Nuevo Beneficiario">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inscripción de Nuevo Beneficiario</h1>
          <Button variant="outline" onClick={() => router.push("/beneficiarios")} leftIcon={<ArrowLeft size={16} />}>
            Volver al listado
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Datos básicos */}
          <DatosBasicosSection 
            control={control} 
            register={register} 
            errors={errors} 
            categorias={categorias} 
            setValue={setValue}
          />

          {/* Lugar de nacimiento */}
          <LugarNacimientoSection
            control={control}
            errors={errors}
            paises={paises}
            provinciasNac={provinciasNac}
            departamentosNac={departamentosNac}
            localidadesNac={localidadesNac}
            paisId={paisId}
            setPaisId={setPaisId}
            provinciaNacId={provinciaNacId}
            setProvinciaNacId={setProvinciaNacId}
            departamentoNacId={departamentoNacId}
            setDepartamentoNacId={setDepartamentoNacId}
          />

          {/* Datos educativos */}
          <DatosEducativosSection
            control={control}
            register={register}
            errors={errors}
            indigena={indigena}
            tribus={tribus}
            lenguas={lenguas}
          />

          {/* Datos del responsable */}
          <ResponsableSection control={control} register={register} errors={errors} responsable={responsable} />

          {/* Embarazo (solo para sexo F) */}
          {sexo === "F" && (
            <EmbarazoSection control={control} register={register} errors={errors} menorEmbarazada={menorEmbarazada} />
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
          {/* <GeolocalizacionSection
            formData={control._formValues}
            onChange={(field, value) => setValue(field, value)}
          /> */}

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
          />

          {/* Botones de acción */}
          <div className="mt-8">
            {/* Resumen de errores - se muestra solo si hay errores */}
            {Object.keys(errors).length > 0 && <ErrorSummary errors={errors} />}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/beneficiarios")}>
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting || createBeneficiarioMutation.isPending}
                leftIcon={<Save size={18} />}
              >
                Guardar Beneficiario
              </Button>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

export default NuevoBeneficiarioPage
