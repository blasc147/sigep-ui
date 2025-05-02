"use client"

import { Controller } from "react-hook-form"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SI_NO_OPTIONS } from "@/constants/options"

interface ConvivenciaSectionProps {
  control: any
  errors: any
}

export const ConvivenciaSection = ({ control, errors }: ConvivenciaSectionProps) => {
  console.log(SI_NO_OPTIONS);
  return (
    <FormSection title="Convivencia">
      <Controller
        name="menor_convive_con_adulto"
        control={control}
        render={({ field }) => (
          <RadioGroup
            name="menor_convive_con_adulto"
            label="¿El menor convive con un adulto?"
            options={SI_NO_OPTIONS}
            value={field.value || "N"}
            onChange={field.onChange}
            error={errors.menor_convive_con_adulto?.message}
            inline
          />
        )}
      />
    </FormSection>
  )
}
