"use client"

import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { SelectField } from "@/features/beneficiarios/components/SelectField"
import { TIPO_FICHA_OPTIONS } from "@/constants/options"
import { useEffect } from "react"

interface DatosAdministrativosSectionProps {
  control: any
  register: any
  errors: any
  setValue: any
}

export const DatosAdministrativosSection = ({ control, register, errors, setValue }: DatosAdministrativosSectionProps) => {
  // Set tipo_ficha to "2" by default when component mounts
  useEffect(() => {
    setValue("tipo_ficha", "2")
  }, [setValue])

  return (
    <FormSection title="Datos Administrativos">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fecha de Inscripción"
          type="date"
          {...register("fecha_inscripcion", { required: "La fecha de inscripción es requerida" })}
          error={errors.fecha_inscripcion?.message}
          fullWidth
          required
          disabled
        />

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
          <textarea
            {...register("observaciones")}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            rows={3}
          ></textarea>
          {errors.observaciones && <p className="mt-1 text-sm text-red-500">{errors.observaciones.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Observaciones Generales
          </label>
          <textarea
            {...register("obsgenerales")}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            rows={3}
          ></textarea>
          {errors.obsgenerales && <p className="mt-1 text-sm text-red-500">{errors.obsgenerales.message}</p>}
        </div>
      </div>
    </FormSection>
  )
}
