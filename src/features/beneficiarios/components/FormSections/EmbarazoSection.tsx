"use client"

import { Controller, useWatch } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SI_NO_OPTIONS } from "@/constants/options"
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"
import type { BeneficiarioCreateRequest, SiNo } from "@/types/beneficiario"
import { useEffect } from "react"

interface EmbarazoSectionProps {
  control: Control<BeneficiarioCreateRequest>
  register: UseFormRegister<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  menorEmbarazada: SiNo
  setValue: UseFormSetValue<BeneficiarioCreateRequest>
}

export const EmbarazoSection = ({
  control,
  register,
  errors,
  menorEmbarazada,
  setValue,
}: EmbarazoSectionProps) => {
  // Observar cambios en la FUM y fecha de diagnóstico
  const fum = useWatch({
    control,
    name: "fum",
  })

  const fechaDiagnostico = useWatch({
    control,
    name: "fecha_diagnostico_embarazo",
  })

  // Función para calcular la fecha probable de parto
  const calcularFechaProbableParto = (fum: string) => {
    if (!fum) return

    const fecha = new Date(fum)
    fecha.setDate(fecha.getDate() + 7) // Sumar 7 días
    fecha.setMonth(fecha.getMonth() - 3) // Restar 3 meses
    fecha.setFullYear(fecha.getFullYear() + 1) // Sumar 1 año

    // Formatear la fecha a YYYY-MM-DD
    const fechaProbable = fecha.toISOString().split('T')[0]
    setValue("fecha_probable_parto", fechaProbable)
  }

  // Función para calcular las semanas de embarazo
  const calcularSemanasEmbarazo = (fum: string, fechaDiagnostico: string) => {
    if (!fum || !fechaDiagnostico) return

    const fechaFUM = new Date(fum)
    const fechaDiag = new Date(fechaDiagnostico)

    // Calcular la diferencia en milisegundos
    const diffTime = Math.abs(fechaDiag.getTime() - fechaFUM.getTime())
    // Convertir a días
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    // Convertir a semanas (redondeando al entero más cercano)
    const semanas = Math.round(diffDays / 7)

    setValue("semanas_embarazo", semanas)
  }

  // Calcular FPP cuando cambia la FUM
  useEffect(() => {
    if (fum) {
      calcularFechaProbableParto(fum)
    }
  }, [fum, setValue])

  // Calcular semanas cuando cambia la FUM o la fecha de diagnóstico
  useEffect(() => {
    if (fum && fechaDiagnostico) {
      calcularSemanasEmbarazo(fum, fechaDiagnostico)
    }
  }, [fum, fechaDiagnostico, setValue])

  return (
    <FormSection title="Datos de Embarazo">
      <div className="space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="FUM"
              type="date"
              {...register("fum")}
              error={errors.fum?.message}
              fullWidth
            />

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
              {...register("semanas_embarazo")}
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
          </div>
        )}
      </div>
    </FormSection>
  )
}
