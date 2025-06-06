"use client"

import { Controller, useWatch } from "react-hook-form"
import { useEffect } from "react"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SelectField } from "@/features/beneficiarios/components/SelectField"
import { CLASE_DOCUMENTO_OPTIONS, SEXO_OPTIONS, TIPO_DOCUMENTO_OPTIONS } from "@/constants/options"
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"
import type { BeneficiarioCreateRequest, Categoria } from "@/types/beneficiario"

interface DatosBasicosSectionProps {
  control: Control<BeneficiarioCreateRequest>
  register: UseFormRegister<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  categorias: Categoria[]
  setValue: UseFormSetValue<BeneficiarioCreateRequest>
  isEditMode?: boolean
}

export const DatosBasicosSection = ({ control, register, errors, categorias, setValue, isEditMode = false }: DatosBasicosSectionProps) => {
  const fechaNacimiento = useWatch({
    control,
    name: "fecha_nacimiento_benef"
  });
  const edad = fechaNacimiento ? calcularEdad(fechaNacimiento) : null;
  const categoriaId = edad && edad > 19 ? 6 : 5;

  useEffect(() => {
    if (fechaNacimiento) {
      setValue("id_categoria", categoriaId);
    }
  }, [fechaNacimiento, categoriaId, setValue]);

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
              disabled={isEditMode}
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
              value={field.value}
              onChange={field.onChange}
              error={errors.tipo_documento?.message}
              required
              disabled={isEditMode}
            />
          )}
        />

        <Input
          label="Número de Documento"
          {...register("numero_doc", { required: "El número de documento es requerido" })}
          error={errors.numero_doc?.message}
          fullWidth
          required
          disabled={isEditMode}
        />

        <Input
          label="Fecha de Nacimiento"
          type="date"
          {...register("fecha_nacimiento_benef", { required: "La fecha de nacimiento es requerida" })}
          error={errors.fecha_nacimiento_benef?.message}
          fullWidth
          required
        />

        <Controller
          name="id_categoria"
          control={control}
          rules={{ required: "La categoría es requerida" }}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <div className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {categorias.find(cat => cat.id_categoria === field.value)?.categoria || "Categoría 5"}
              </div>
              {errors.id_categoria?.message && (
                <p className="mt-1 text-sm text-red-500">{errors.id_categoria.message}</p>
              )}
            </div>
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
      </div>
    </FormSection>
  )
}

const calcularEdad = (fechaNacimiento: string) => {
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = fechaNac.getMonth();
  
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  return edad;
};
