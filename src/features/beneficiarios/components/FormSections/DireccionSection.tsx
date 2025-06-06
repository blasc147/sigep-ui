"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { useState } from "react"
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import type {
  BeneficiarioCreateRequest,
  Pais,
  Provincia,
  Departamento,
  Localidad,
  Municipio,
  Barrio,
  CodigoPostal,
  Calle,
} from "@/types/beneficiario"
import { SearchableSelect } from "../SercheableSelect"

interface DireccionSectionProps {
  control: Control<BeneficiarioCreateRequest>
  register: UseFormRegister<BeneficiarioCreateRequest>
  errors: FieldErrors<BeneficiarioCreateRequest>
  setValue: (name: any, value: any) => void
  paises: Pais[]
  provinciasResidencia: Provincia[]
  departamentosResidencia: Departamento[]
  localidadesResidencia: Localidad[]
  municipios: Municipio[]
  barrios: Barrio[]
  calles: Calle[]
  codigosPostales: CodigoPostal[]
  paisResidenciaId: number | null
  setPaisResidenciaId: (id: number | null) => void
  provinciaResidenciaId: number | null
  setProvinciaResidenciaId: (id: number | null) => void
  departamentoResidenciaId: number | null
  setDepartamentoResidenciaId: (id: number | null) => void
  localidadResidenciaId: number | null
  setLocalidadResidenciaId: (id: number | null) => void
  municipioId: number | null
  setMunicipioId: (id: number | null) => void
}

export const DireccionSection = ({
  control,
  register,
  errors,
  setValue,
  paises,
  provinciasResidencia,
  departamentosResidencia,
  localidadesResidencia,
  municipios,
  barrios,
  calles,
  codigosPostales,
  paisResidenciaId,
  setPaisResidenciaId,
  provinciaResidenciaId,
  setProvinciaResidenciaId,
  departamentoResidenciaId,
  setDepartamentoResidenciaId,
  localidadResidenciaId,
  setLocalidadResidenciaId,
  municipioId,
  setMunicipioId,
}: DireccionSectionProps) => {
  const [usarCallePersonalizada, setUsarCallePersonalizada] = useState(false)
  const [usarBarrioPersonalizado, setUsarBarrioPersonalizado] = useState(false)

  return (
    <FormSection title="Dirección">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="pais_residencia"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              name="pais_residencia"
              label="País de Residencia"
              options={paises.map((pais) => ({
                value: pais.id_pais,
                label: pais.nombre,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value)
                setPaisResidenciaId(value ? Number(value) : null)
              }}
              error={errors.pais_residencia?.message}
              
            />
          )}
        />

        <Controller
          name="provincia"
          control={control}
          rules={{ required: "La provincia es requerida" }}
          render={({ field }) => (
            <SearchableSelect
              name="provincia"
              label="Provincia"
              options={provinciasResidencia.map((prov) => ({
                value: prov.id_provincia,
                label: prov.nombre,
              }))}
              value={field.value}
              onChange={(value) => {
                field.onChange(value)
                setProvinciaResidenciaId(value ? Number(value) : null)
              }}
              error={errors.provincia?.message}
              disabled={!paisResidenciaId}
              required
            />
          )}
        />

        <Controller
          name="departamento"
          control={control}
          rules={{ required: "El departamento es requerido" }}
          render={({ field }) => (
            <SearchableSelect
              name="departamento"
              label="Departamento"
              options={departamentosResidencia.map((dep) => ({
                value: dep.id_departamento,
                label: dep.nombre,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value)
                setDepartamentoResidenciaId(value ? Number(value) : null)
              }}
              error={errors.departamento?.message}
              disabled={!provinciaResidenciaId}
              required
            />
          )}
        />

        <Controller
          name="localidad"
          control={control}
          rules={{ required: "La localidad es requerida" }}
          render={({ field }) => (
            <SearchableSelect
              name="localidad"
              label="Localidad"
              options={localidadesResidencia.map((loc) => ({
                value: loc.id_localidad,
                label: loc.nombre,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value)
                setLocalidadResidenciaId(value ? Number(value) : null)
              }}
              error={errors.localidad?.message}
              disabled={!departamentoResidenciaId}
              required
            />
          )}
        />

        <Controller
          name="municipio"
          control={control}
          rules={{ required: "El municipio es requerido" }}
          render={({ field }) => (
            <SearchableSelect
              name="municipio"
              label="Municipio"
              options={municipios.map((mun) => ({
                value: mun.id_municipio,
                label: mun.nombre,
              }))}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value)
                setMunicipioId(value ? Number(value) : null)
              }}
              error={errors.municipio?.message}
              disabled={!localidadResidenciaId}
              required
            />
          )}
        />

        <Controller
          name="barrio"
          control={control}
          rules={{ required: "El barrio es requerido" }}
          render={({ field }) => (
            <div className="relative">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Barrio</label>
                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setUsarBarrioPersonalizado(!usarBarrioPersonalizado)
                      setValue("barrio", "") // Limpiar el valor al cambiar
                    }}
                    className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    {usarBarrioPersonalizado ? "Seleccionar de la lista" : "Ingresar manualmente"}
                  </button>
                </div>
              </div>

              {usarBarrioPersonalizado ? (
                <Input
                  {...register("barrio")}
                  error={errors.barrio?.message}
                  fullWidth
                  placeholder="Ingrese el nombre del barrio"
                />
              ) : (
                <SearchableSelect
                  name="barrio"
                  options={barrios.map((bar) => ({
                    value: bar.id_barrio,
                    label: bar.nombre,
                  }))}
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.barrio?.message}
                  disabled={!municipioId}
                  required
                />
              )}
            </div>
          )}
        />

        <div className="col-span-2">
          <div className="flex items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Calle</label>
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => {
                  setUsarCallePersonalizada(!usarCallePersonalizada)
                  setValue("calle", "") // Limpiar el valor al cambiar
                }}
                className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
              >
                {usarCallePersonalizada ? "Seleccionar de la lista" : "Ingresar manualmente"}
              </button>
            </div>
          </div>

          {usarCallePersonalizada ? (
            <Input
              {...register("calle")}
              error={errors.calle?.message}
              fullWidth
              placeholder="Ingrese el nombre de la calle"
            />
          ) : (
            <Controller
              name="calle"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  name="calle"
                  options={calles.map((calle) => ({
                    value: calle.nombre,
                    label: calle.nombre,
                  }))}
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.calle?.message}
                  disabled={!localidadResidenciaId}
                  placeholder="Buscar y seleccionar calle..."
                />
              )}
            />
          )}
        </div>

        <Input label="Número" {...register("numero_calle")} error={errors.numero_calle?.message} fullWidth />

        <Input label="Piso" {...register("piso")} error={errors.piso?.message} fullWidth />

        <Input label="Departamento" {...register("dpto")} error={errors.dpto?.message} fullWidth />

        <Input label="Manzana" {...register("manzana")} error={errors.manzana?.message} fullWidth />

        <Input label="Entre Calle 1" {...register("entre_calle_1")} error={errors.entre_calle_1?.message} fullWidth />

        <Input label="Entre Calle 2" {...register("entre_calle_2")} error={errors.entre_calle_2?.message} fullWidth />

        <Controller
          name="cod_pos"
          control={control}
          rules={{ required: "El código postal es requerido" }}
          render={({ field }) => (
            <SearchableSelect
              name="cod_pos"
              label="Código Postal"
              options={codigosPostales.map((cp) => ({
                value: cp.codigopostal || cp,
                label: cp.codigopostal || cp,
              }))}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.cod_pos?.message}
              disabled={!localidadResidenciaId}
              required
            />
          )}
        />
      </div>
    </FormSection>
  )
}
