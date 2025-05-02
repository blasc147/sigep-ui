"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SI_NO_OPTIONS } from "@/constants/options"

interface DiscapacidadesSectionProps {
  control: any
  register: any
  errors: any
}

export const DiscapacidadesSection = ({ control, register, errors }: DiscapacidadesSectionProps) => {
  return (
    <FormSection title="Discapacidades">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="discv"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="discv"
              label="Discapacidad Visual"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.discv?.message}
              inline
            />
          )}
        />

        <Controller
          name="disca"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="disca"
              label="Discapacidad Auditiva"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.disca?.message}
              inline
            />
          )}
        />

        <Controller
          name="discmo"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="discmo"
              label="Discapacidad Motriz"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.discmo?.message}
              inline
            />
          )}
        />

        <Controller
          name="discme"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="discme"
              label="Discapacidad Mental"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.discme?.message}
              inline
            />
          )}
        />

        <Input
          label="Otra Discapacidad"
          {...register("otradisc")}
          error={errors.otradisc?.message}
          fullWidth
          className="col-span-2"
        />
      </div>
    </FormSection>
  )
}
