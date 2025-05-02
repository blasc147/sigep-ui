"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SelectField } from "@/features/beneficiarios/components/SelectField"
import { SI_NO_OPTIONS, NIVEL_ESTUDIOS_OPTIONS, ESTADO_ESTUDIOS_OPTIONS } from "@/constants/options"
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import type { BeneficiarioCreateRequest, SiNo, Tribu, Lengua } from "@/types/beneficiario"

interface DatosEducativosSectionProps {
  control: Control<BeneficiarioCreateRequest>
  register: UseFormRegister<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  indigena: SiNo
  tribus: Tribu[]
  lenguas: Lengua[]
}

export const DatosEducativosSection = ({
  control,
  register,
  errors,
  indigena,
  tribus,
  lenguas,
}: DatosEducativosSectionProps) => {
  return (
    <FormSection title="Datos Educativos">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="indigena"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="indigena"
              label="¿Pertenece a pueblo indígena?"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.indigena?.message}
              inline
            />
          )}
        />

        {indigena === "S" && (
          <>
            <Controller
              name="id_tribu"
              control={control}
              render={({ field }) => (
                <SelectField
                  name="id_tribu"
                  label="Tribu"
                  options={tribus.map((tribu) => ({
                    value: tribu.id_tribu,
                    label: tribu.nombre,
                  }))}
                  value={field.value || ""}
                  onChange={(value) => {
                    const numValue = value ? Number(value) : undefined
                    field.onChange(numValue)
                  }}
                  error={errors.id_tribu?.message}
                />
              )}
            />

            <Controller
              name="id_lengua"
              control={control}
              render={({ field }) => (
                <SelectField
                  name="id_lengua"
                  label="Lengua"
                  options={lenguas.map((lengua) => ({
                    value: lengua.id_lengua,
                    label: lengua.nombre,
                  }))}
                  value={field.value || ""}
                  onChange={(value) => {
                    const numValue = value ? Number(value) : undefined
                    field.onChange(numValue)
                  }}
                  error={errors.id_lengua?.message}
                />
              )}
            />
          </>
        )}

        <Controller
          name="alfabeta"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="alfabeta"
              label="¿Sabe leer y escribir?"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.alfabeta?.message}
              inline
            />
          )}
        />

        <Controller
          name="estudios"
          control={control}
          render={({ field }) => (
            <SelectField
              name="estudios"
              label="Nivel de Estudios"
              options={NIVEL_ESTUDIOS_OPTIONS}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.estudios?.message}
            />
          )}
        />

        <Input
          label="Año del mayor nivel alcanzado"
          {...register("anio_mayor_nivel")}
          error={errors.anio_mayor_nivel?.message}
          fullWidth
        />

        <Controller
          name="estadoest"
          control={control}
          render={({ field }) => (
            <SelectField
              name="estadoest"
              label="Estado de Estudios"
              options={ESTADO_ESTUDIOS_OPTIONS}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.estadoest?.message}
            />
          )}
        />
      </div>
    </FormSection>
  )
}
