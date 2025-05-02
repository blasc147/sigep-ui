"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SI_NO_OPTIONS } from "@/constants/options"

interface FactoresRiesgoSectionProps {
  control: any
  register: any
  errors: any
}

export const FactoresRiesgoSection = ({ control, register, errors }: FactoresRiesgoSectionProps) => {
  return (
    <FormSection title="Factores de Riesgo">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="fumador"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="fumador"
              label="Fumador"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.fumador?.message}
              inline
            />
          )}
        />

        <Controller
          name="diabetes"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="diabetes"
              label="Diabetes"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.diabetes?.message}
              inline
            />
          )}
        />

        <Controller
          name="infarto"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="infarto"
              label="Infarto"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.infarto?.message}
              inline
            />
          )}
        />

        <Controller
          name="acv"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="acv"
              label="ACV"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.acv?.message}
              inline
            />
          )}
        />

        <Controller
          name="hta"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="hta"
              label="HTA"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.hta?.message}
              inline
            />
          )}
        />

        <Controller
          name="estatinas"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="estatinas"
              label="Estatinas"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.estatinas?.message}
              inline
            />
          )}
        />

        <Input
          label="Score de Riesgo"
          type="number"
          {...register("score_riesgo", {
            valueAsNumber: true,
            min: { value: 0, message: "Debe ser mayor o igual a 0" },
          })}
          error={errors.score_riesgo?.message}
          fullWidth
        />
      </div>
    </FormSection>
  )
}
