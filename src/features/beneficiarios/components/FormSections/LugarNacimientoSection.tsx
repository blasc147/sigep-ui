"use client"

import { Controller } from "react-hook-form"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import type { Control, FieldErrors } from "react-hook-form"
import type { BeneficiarioCreateRequest, Pais, Provincia, Departamento, Localidad } from "@/types/beneficiario"
import { SearchableSelect } from "../SercheableSelect"

interface LugarNacimientoSectionProps {
  control: Control<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  paises: Pais[]
  provinciasNac: Provincia[]
  departamentosNac: Departamento[]
  localidadesNac: Localidad[]
  paisId: number | null
  setPaisId: (id: number | null) => void
  provinciaNacId: number | null
  setProvinciaNacId: (id: number | null) => void
  departamentoNacId: number | null
  setDepartamentoNacId: (id: number | null) => void
}

export const LugarNacimientoSection = ({
  control,
  errors,
  paises,
  provinciasNac,
  departamentosNac,
  localidadesNac,
  paisId,
  setPaisId,
  provinciaNacId,
  setProvinciaNacId,
  departamentoNacId,
  setDepartamentoNacId,
}: LugarNacimientoSectionProps) => {
  return (
    <FormSection title="Lugar de Nacimiento">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="pais_nac"
          control={control}
          rules={{ required: "El país de nacimiento es requerido" }}
          render={({ field }) => (
            <SearchableSelect
              name="pais_nac"
              label="País de Nacimiento"
              options={paises.map((pais) => ({
                value: pais.id_pais,
                label: pais.nombre,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value)
                setPaisId(value ? Number(value) : null)
              }}
              error={errors.pais_nac?.message}
              required
            />
          )}
        />

        <Controller
          name="provincia_nac"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              name="provincia_nac"
              label="Provincia de Nacimiento"
              options={provinciasNac.map((prov) => ({
                value: prov.id_provincia,
                label: prov.nombre,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value)
                setProvinciaNacId(value ? Number(value) : null)
              }}
              error={errors.provincia_nac?.message}
              disabled={!paisId}
            />
          )}
        />

        <Controller
          name="departamento_nac"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              name="departamento_nac"
              label="Departamento de Nacimiento"
              options={departamentosNac.map((dep) => ({
                value: dep.id_departamento,
                label: dep.nombre,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value)
                setDepartamentoNacId(value ? Number(value) : null)
              }}
              error={errors.departamento_nac?.message}
              disabled={!provinciaNacId}
            />
          )}
        />

        <Controller
          name="localidad_nac"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              name="localidad_nac"
              label="Localidad de Nacimiento"
              options={localidadesNac.map((loc) => ({
                value: loc.id_localidad,
                label: loc.nombre,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value)
              }}
              error={errors.localidad_nac?.message}
              disabled={!departamentoNacId}
            />
          )}
        />
      </div>
    </FormSection>
  )
}
