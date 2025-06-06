"use client"

import { Controller } from "react-hook-form"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import type { Control, FieldErrors } from "react-hook-form"
import type { BeneficiarioCreateRequest, Pais } from "@/types/beneficiario"
import { SearchableSelect } from "../SercheableSelect"

interface LugarNacimientoSectionProps {
  control: Control<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  paises: Pais[]
  paisId: number | null
  setPaisId: (id: number | null) => void
}

export const LugarNacimientoSection = ({
  control,
  errors,
  paises,
  paisId,
  setPaisId,
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
      </div>
    </FormSection>
  )
}
