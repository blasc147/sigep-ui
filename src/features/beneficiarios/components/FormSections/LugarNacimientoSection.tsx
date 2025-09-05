"use client"

import { Controller } from "react-hook-form"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SelectField } from "@/features/beneficiarios/components/SelectField"
import { SI_NO_OPTIONS } from "@/constants/options"
import type { Control, FieldErrors } from "react-hook-form"
import type { BeneficiarioCreateRequest, Pais, Tribu, Lengua, SiNo } from "@/types/beneficiario"
import { SearchableSelect } from "../SercheableSelect"

interface LugarNacimientoSectionProps {
  control: Control<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  paises: Pais[]
  paisId: number | null
  setPaisId: (id: number | null) => void
  tribus: Tribu[]
  lenguas: Lengua[]
  indigena: SiNo
}

export const LugarNacimientoSection = ({
  control,
  errors,
  paises,
  paisId,
  setPaisId,
  tribus,
  lenguas,
  indigena,
}: LugarNacimientoSectionProps) => {
  return (
    <FormSection title="Datos Adicionales">
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
          name="indigena"
          control={control}
          rules={{ required: "Este campo es requerido" }}
          render={({ field }) => (
            <RadioGroup
              name="indigena"
              label="¿Pertenece a pueblo originario?"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.indigena?.message}
              required
              inline
            />
          )}
        />

        {indigena === "S" && (
          <>
            <Controller
              name="id_tribu"
              control={control}
              render={({ field }) => (
                <SelectField
                  name="id_tribu"
                  label="Pueblo Originario"
                  options={tribus.map((tribu) => ({
                    value: tribu.id_tribu,
                    label: tribu.nombre,
                  }))}
                  value={field.value || ""}
                  onChange={(value) => {
                    const numValue = value ? Number(value) : undefined
                    field.onChange(numValue)
                  }}
                  error={errors.id_tribu?.message}
                />
              )}
            />

            <Controller
              name="id_lengua"
              control={control}
              render={({ field }) => (
                <SelectField
                  name="id_lengua"
                  label="Lengua"
                  options={lenguas.map((lengua) => ({
                    value: lengua.id_lengua,
                    label: lengua.nombre,
                  }))}
                  value={field.value || ""}
                  onChange={(value) => {
                    const numValue = value ? Number(value) : undefined
                    field.onChange(numValue)
                  }}
                  error={errors.id_lengua?.message}
                />
              )}
            />
          </>
        )}
      </div>
    </FormSection>
  )
}
