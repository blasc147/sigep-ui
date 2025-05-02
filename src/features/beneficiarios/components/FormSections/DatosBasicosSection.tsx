"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SelectField } from "@/features/beneficiarios/components/SelectField"
import { CLASE_DOCUMENTO_OPTIONS, SEXO_OPTIONS, TIPO_DOCUMENTO_OPTIONS } from "@/constants/options"
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import type { BeneficiarioCreateRequest, Categoria } from "@/types/beneficiario"

interface DatosBasicosSectionProps {
  control: Control<BeneficiarioCreateRequest>
  register: UseFormRegister<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  categorias: Categoria[]
}

export const DatosBasicosSection = ({ control, register, errors, categorias }: DatosBasicosSectionProps) => {
  return (
    <FormSection title="Datos Básicos">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Apellido"
          {...register("apellido_benef", { required: "El apellido es requerido" })}
          error={errors.apellido_benef?.message}
          fullWidth
          required
        />

        <Input
          label="Nombre"
          {...register("nombre_benef", { required: "El nombre es requerido" })}
          error={errors.nombre_benef?.message}
          fullWidth
          required
        />

        <Controller
          name="clase_documento_benef"
          control={control}
          rules={{ required: "Este campo es requerido" }}
          render={({ field }) => (
            <RadioGroup
              name="clase_documento_benef"
              label="Clase de Documento"
              options={CLASE_DOCUMENTO_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.clase_documento_benef?.message}
              required
              inline
            />
          )}
        />

        <Controller
          name="tipo_documento"
          control={control}
          rules={{ required: "El tipo de documento es requerido" }}
          render={({ field }) => (
            <SelectField
              name="tipo_documento"
              label="Tipo de Documento"
              options={TIPO_DOCUMENTO_OPTIONS}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.tipo_documento?.message}
              required
            />
          )}
        />

        <Input
          label="Número de Documento"
          {...register("numero_doc", { required: "El número de documento es requerido" })}
          error={errors.numero_doc?.message}
          fullWidth
          required
        />

        <Controller
          name="id_categoria"
          control={control}
          rules={{ required: "La categoría es requerida" }}
          render={({ field }) => (
            <SelectField
              name="id_categoria"
              label="Categoría"
              options={categorias.map((cat) => ({
                value: cat.id_categoria,
                label: cat.categoria,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                const numValue = value ? Number(value) : undefined
                field.onChange(numValue)
              }}
              error={errors.id_categoria?.message}
              required
            />
          )}
        />

        <Controller
          name="sexo"
          control={control}
          rules={{ required: "El sexo es requerido" }}
          render={({ field }) => (
            <RadioGroup
              name="sexo"
              label="Sexo"
              options={SEXO_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.sexo?.message}
              required
              inline
            />
          )}
        />

        <Input
          label="Fecha de Nacimiento"
          type="date"
          {...register("fecha_nacimiento_benef", { required: "La fecha de nacimiento es requerida" })}
          error={errors.fecha_nacimiento_benef?.message}
          fullWidth
          required
        />
      </div>
    </FormSection>
  )
}
