"use client"

import { Controller } from "react-hook-form"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import type { Control, FieldErrors } from "react-hook-form"
import type { BeneficiarioCreateRequest, Efector } from "@/types/beneficiario"
import { SearchableSelect } from "../SercheableSelect"
import { LoadingSelect } from "../LoadingSelect"

interface EfectoresSectionProps {
  control: Control<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  efectores: Efector[]
  isLoading?: boolean
}

export const EfectoresSection = ({ control, errors, efectores, isLoading = false }: EfectoresSectionProps) => {
  // Preparar las opciones para los selectores
  const efectoresOptions = efectores.map((efector) => ({
    value: efector.cuie,
    label: `${efector.nombre} (${efector.cuie}) - ${efector.localidad}`,
  }))

  if (isLoading) {
    return (
      <FormSection title="Efectores">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSelect label="Efector de Atención" required />
          <LoadingSelect label="Efector de Alta/Habitual" required />
          <LoadingSelect label="Efector a Cargo" />
        </div>
      </FormSection>
    )
  }

  return (
    <FormSection title="Efectores">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="cuie_ea"
          control={control}
          rules={{ required: "El efector de atención es requerido" }}
          render={({ field }) => (
            <SearchableSelect
              name="cuie_ea"
              label="Efector de Atención"
              options={efectoresOptions}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.cuie_ea?.message}
              required
            />
          )}
        />

        <Controller
          name="cuie_ah"
          control={control}
          rules={{ required: "El efector de alta/habitual es requerido" }}
          render={({ field }) => (
            <SearchableSelect
              name="cuie_ah"
              label="Efector de Alta/Habitual"
              options={efectoresOptions}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.cuie_ah?.message}
              required
            />
          )}
        />

        <Controller
          name="cuieefectoracargo"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              name="cuieefectoracargo"
              label="Efector a Cargo"
              options={efectoresOptions}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.cuieefectoracargo?.message}
            />
          )}
        />
      </div>
    </FormSection>
  )
}
