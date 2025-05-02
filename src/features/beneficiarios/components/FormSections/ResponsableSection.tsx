"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SelectField } from "@/features/beneficiarios/components/SelectField"
import {
  RESPONSABLE_OPTIONS,
  TIPO_DOCUMENTO_OPTIONS,
  SI_NO_OPTIONS,
  NIVEL_ESTUDIOS_OPTIONS,
  ESTADO_ESTUDIOS_OPTIONS,
} from "@/constants/options"

interface ResponsableSectionProps {
  control: any
  register: any
  errors: any
  responsable: string
}

export const ResponsableSection = ({ control, register, errors, responsable }: ResponsableSectionProps) => {
  return (
    <FormSection title="Datos del Responsable">
      <Controller
        name="responsable"
        control={control}
        render={({ field }) => (
          <SelectField
            name="responsable"
            label="Responsable"
            options={RESPONSABLE_OPTIONS}
            value={field.value || ""}
            onChange={field.onChange}
            error={errors.responsable?.message}
          />
        )}
      />

      {/* Datos de la madre */}
      {responsable === "MADRE" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h4 className="text-md font-medium col-span-full">Datos de la Madre</h4>

          <Controller
            name="tipo_doc_madre"
            control={control}
            render={({ field }) => (
              <SelectField
                name="tipo_doc_madre"
                label="Tipo de Documento"
                options={TIPO_DOCUMENTO_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.tipo_doc_madre?.message}
              />
            )}
          />

          <Input
            label="Número de Documento"
            {...register("nro_doc_madre")}
            error={errors.nro_doc_madre?.message}
            fullWidth
          />

          <Input label="Nombre" {...register("nombre_madre")} error={errors.nombre_madre?.message} fullWidth />

          <Input label="Apellido" {...register("apellido_madre")} error={errors.apellido_madre?.message} fullWidth />

          <Controller
            name="alfabeta_madre"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="alfabeta_madre"
                label="¿Sabe leer y escribir?"
                options={SI_NO_OPTIONS}
                value={field.value || "N"}
                onChange={field.onChange}
                error={errors.alfabeta_madre?.message}
                inline
              />
            )}
          />

          <Controller
            name="estudios_madre"
            control={control}
            render={({ field }) => (
              <SelectField
                name="estudios_madre"
                label="Nivel de Estudios"
                options={NIVEL_ESTUDIOS_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.estudios_madre?.message}
              />
            )}
          />

          <Input
            label="Año del mayor nivel alcanzado"
            {...register("anio_mayor_nivel_madre")}
            error={errors.anio_mayor_nivel_madre?.message}
            fullWidth
          />

          <Controller
            name="estadoest_madre"
            control={control}
            render={({ field }) => (
              <SelectField
                name="estadoest_madre"
                label="Estado de Estudios"
                options={ESTADO_ESTUDIOS_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.estadoest_madre?.message}
              />
            )}
          />
        </div>
      )}

      {/* Datos del padre */}
      {responsable === "PADRE" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h4 className="text-md font-medium col-span-full">Datos del Padre</h4>

          <Controller
            name="tipo_doc_padre"
            control={control}
            render={({ field }) => (
              <SelectField
                name="tipo_doc_padre"
                label="Tipo de Documento"
                options={TIPO_DOCUMENTO_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.tipo_doc_padre?.message}
              />
            )}
          />

          <Input
            label="Número de Documento"
            {...register("nro_doc_padre")}
            error={errors.nro_doc_padre?.message}
            fullWidth
          />

          <Input label="Nombre" {...register("nombre_padre")} error={errors.nombre_padre?.message} fullWidth />

          <Input label="Apellido" {...register("apellido_padre")} error={errors.apellido_padre?.message} fullWidth />

          <Controller
            name="alfabeta_padre"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="alfabeta_padre"
                label="¿Sabe leer y escribir?"
                options={SI_NO_OPTIONS}
                value={field.value || "N"}
                onChange={field.onChange}
                error={errors.alfabeta_padre?.message}
                inline
              />
            )}
          />

          <Controller
            name="estudios_padre"
            control={control}
            render={({ field }) => (
              <SelectField
                name="estudios_padre"
                label="Nivel de Estudios"
                options={NIVEL_ESTUDIOS_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.estudios_padre?.message}
              />
            )}
          />

          <Input
            label="Año del mayor nivel alcanzado"
            {...register("anio_mayor_nivel_padre")}
            error={errors.anio_mayor_nivel_padre?.message}
            fullWidth
          />

          <Controller
            name="estadoest_padre"
            control={control}
            render={({ field }) => (
              <SelectField
                name="estadoest_padre"
                label="Estado de Estudios"
                options={ESTADO_ESTUDIOS_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.estadoest_padre?.message}
              />
            )}
          />
        </div>
      )}

      {/* Datos del tutor */}
      {responsable === "TUTOR" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h4 className="text-md font-medium col-span-full">Datos del Tutor</h4>

          <Controller
            name="tipo_doc_tutor"
            control={control}
            render={({ field }) => (
              <SelectField
                name="tipo_doc_tutor"
                label="Tipo de Documento"
                options={TIPO_DOCUMENTO_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.tipo_doc_tutor?.message}
              />
            )}
          />

          <Input
            label="Número de Documento"
            {...register("nro_doc_tutor")}
            error={errors.nro_doc_tutor?.message}
            fullWidth
          />

          <Input label="Nombre" {...register("nombre_tutor")} error={errors.nombre_tutor?.message} fullWidth />

          <Input label="Apellido" {...register("apellido_tutor")} error={errors.apellido_tutor?.message} fullWidth />

          <Controller
            name="alfabeta_tutor"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="alfabeta_tutor"
                label="¿Sabe leer y escribir?"
                options={SI_NO_OPTIONS}
                value={field.value || "N"}
                onChange={field.onChange}
                error={errors.alfabeta_tutor?.message}
                inline
              />
            )}
          />

          <Controller
            name="estudios_tutor"
            control={control}
            render={({ field }) => (
              <SelectField
                name="estudios_tutor"
                label="Nivel de Estudios"
                options={NIVEL_ESTUDIOS_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.estudios_tutor?.message}
              />
            )}
          />

          <Input
            label="Año del mayor nivel alcanzado"
            {...register("anio_mayor_nivel_tutor")}
            error={errors.anio_mayor_nivel_tutor?.message}
            fullWidth
          />

          <Controller
            name="estadoest_tutor"
            control={control}
            render={({ field }) => (
              <SelectField
                name="estadoest_tutor"
                label="Estado de Estudios"
                options={ESTADO_ESTUDIOS_OPTIONS}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.estadoest_tutor?.message}
              />
            )}
          />
        </div>
      )}
    </FormSection>
  )
}
