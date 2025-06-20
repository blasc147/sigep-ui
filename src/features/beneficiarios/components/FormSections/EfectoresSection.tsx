"use client"

import { Controller, useWatch } from "react-hook-form"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form"
import type { BeneficiarioCreateRequest, Efector } from "@/types/beneficiario"
import { SearchableSelect } from "../SercheableSelect"
import { LoadingSelect } from "../LoadingSelect"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

interface EfectoresSectionProps {
  control: Control<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  efectores: Efector[]
  isLoading?: boolean
  setValue: UseFormSetValue<BeneficiarioCreateRequest>
}

export const EfectoresSection = ({ control, errors, efectores, isLoading = false, setValue }: EfectoresSectionProps) => {
  const { user } = useAuth()

  // Filtrar los efectores que están asignados al usuario
  const userEfectores = efectores.filter(efector => user?.cuies?.includes(efector.cuie))

  // Preparar las opciones para los selectores
  const efectoresOptions = userEfectores.map((efector) => ({
    value: efector.cuie,
    label: `${efector.nombre} (${efector.cuie}) - ${efector.localidad}`,
  }))

  // Observar el valor del efector asignado
  const efectorAsignado = useWatch({
    control,
    name: "cuie_ah"
  });

  // Cuando cambia el efector asignado, actualizar los otros efectores
  useEffect(() => {
    if (efectorAsignado) {
      setValue("cuie_ea", efectorAsignado);
      setValue("cuieefectoracargo", efectorAsignado);
    }
  }, [efectorAsignado, setValue]);

  if (isLoading) {
    return (
      <FormSection title="Efectores">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSelect label="Efector Habitual" required />
        </div>
      </FormSection>
    )
  }

  return (
    <FormSection title="Efectores">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="cuie_ah"
          control={control}
          rules={{ required: "El efector habitual es requerido" }}
          render={({ field }) => (
            <SearchableSelect
              name="cuie_ah"
              label="Efector Habitual"
              options={efectoresOptions}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.cuie_ah?.message}
              required
            />
          )}
        />
      </div>
    </FormSection>
  )
}
