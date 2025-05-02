"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SI_NO_OPTIONS } from "@/constants/options"

interface EmbarazoSectionProps {
  control: any
  register: any
  errors: any
  menorEmbarazada: string
}

export const EmbarazoSection = ({ control, register, errors, menorEmbarazada }: EmbarazoSectionProps) => {
  return (
    <FormSection title="Datos de Embarazo">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="menor_embarazada"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="menor_embarazada"
              label="¿Está embarazada?"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.menor_embarazada?.message}
              inline
            />
          )}
        />

        {menorEmbarazada === "S" && (
          <>
            <Input
              label="Fecha de Diagnóstico"
              type="date"
              {...register("fecha_diagnostico_embarazo")}
              error={errors.fecha_diagnostico_embarazo?.message}
              fullWidth
            />

            <Input
              label="Semanas de Embarazo"
              type="number"
              {...register("semanas_embarazo", {
                valueAsNumber: true,
                min: { value: 1, message: "Debe ser mayor a 0" },
                max: { value: 42, message: "Debe ser menor a 43" },
              })}
              error={errors.semanas_embarazo?.message}
              fullWidth
            />

            <Input
              label="Fecha Probable de Parto"
              type="date"
              {...register("fecha_probable_parto")}
              error={errors.fecha_probable_parto?.message}
              fullWidth
            />

            <Input
              label="Fecha Efectiva de Parto"
              type="date"
              {...register("fecha_efectiva_parto")}
              error={errors.fecha_efectiva_parto?.message}
              fullWidth
            />

            <Input
              label="Fecha Última Menstruación"
              type="date"
              {...register("fum")}
              error={errors.fum?.message}
              fullWidth
            />
          </>
        )}
      </div>
    </FormSection>
  )
}
