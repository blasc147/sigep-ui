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
  isEditMode?: boolean
}

export const DatosAdministrativosSection = ({ control, register, errors, setValue, isEditMode = false }: DatosAdministrativosSectionProps) => {
  // Set tipo_ficha to "2" by default when component mounts
  useEffect(() => {
    setValue("tipo_ficha", "2")
  }, [setValue])

  // Función para validar la fecha de inscripción
  const validateInscriptionDate = (date: string) => {
    const selectedDate = new Date(date)
    const today = new Date()
    const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    
    // Validar que la fecha no sea futura
    if (selectedDate > today) {
      return "La fecha de inscripción no puede ser futura"
    }
    
    // Validar que la fecha esté en el mes actual o en el mes anterior
    if (selectedDate < firstDayOfPreviousMonth) {
      return "La fecha de inscripción debe estar en el mes actual o en el mes anterior"
    }
    
    return true
  }

  // Calcular las fechas mínima y máxima para el date picker
  const today = new Date()
  const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  
  // Formatear las fechas para el input type="date" (YYYY-MM-DD)
  const minDate = firstDayOfPreviousMonth.toISOString().split('T')[0]
  const maxDate = today.toISOString().split('T')[0]

  return (
    <FormSection title="Datos Administrativos">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solo mostrar fecha de inscripción si NO está en modo edición */}
        {!isEditMode && (
          <Input
            label="Fecha de Inscripción"
            type="date"
            {...register("fecha_inscripcion", { 
              required: "La fecha de inscripción es requerida",
              validate: validateInscriptionDate
            })}
            error={errors.fecha_inscripcion?.message}
            fullWidth
            required
            min={minDate}
            max={maxDate}
          />
        )}

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
