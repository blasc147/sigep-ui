"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"
import { RadioGroup } from "@/features/beneficiarios/components/RadioGroup"
import { SI_NO_OPTIONS } from "@/constants/options"
import { useState } from "react"

interface FactoresRiesgoSectionProps {
  control: any
  register: any
  errors: any
}

const RISK_LEVELS = [
  { value: 0, label: "Sin riesgo", color: "bg-green-500" },
  { value: 1, label: "Riesgo muy bajo", color: "bg-green-400" },
  { value: 2, label: "Riesgo bajo", color: "bg-yellow-400" },
  { value: 3, label: "Riesgo moderado", color: "bg-yellow-500" },
  { value: 4, label: "Riesgo alto", color: "bg-orange-500" },
  { value: 5, label: "Riesgo muy alto", color: "bg-red-500" },
]

export const FactoresRiesgoSection = ({ control, register, errors }: FactoresRiesgoSectionProps) => {
  const [hoveredScore, setHoveredScore] = useState<number | null>(null)

  return (
    <FormSection title="Factores de Riesgo">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="fumador"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="fumador"
              label="Fumador"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.fumador?.message}
              inline
            />
          )}
        />

        <Controller
          name="diabetes"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="diabetes"
              label="Diabetes"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.diabetes?.message}
              inline
            />
          )}
        />

        <Controller
          name="infarto"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="infarto"
              label="Infarto"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.infarto?.message}
              inline
            />
          )}
        />

        <Controller
          name="acv"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="acv"
              label="ACV"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.acv?.message}
              inline
            />
          )}
        />

        <Controller
          name="hta"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="hta"
              label="HTA"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.hta?.message}
              inline
            />
          )}
        />

        <Controller
          name="estatinas"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="estatinas"
              label="Estatinas"
              options={SI_NO_OPTIONS}
              value={field.value || "N"}
              onChange={field.onChange}
              error={errors.estatinas?.message}
              inline
            />
          )}
        />

        <div className="col-span-2">
          <Controller
            name="score_riesgo"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Score de Riesgo Cardiovascular
                </label>
                <div className="flex items-center space-x-2">
                  {RISK_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all transform hover:scale-110 ${
                        level.color
                      } ${
                        field.value === level.value
                          ? "ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-600"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => field.onChange(level.value)}
                      onMouseEnter={() => setHoveredScore(level.value)}
                      onMouseLeave={() => setHoveredScore(null)}
                    >
                      {level.value}
                    </button>
                  ))}
                </div>
                
                {/* Contenedor con altura fija para evitar el salto del contenido */}
                <div className="h-6 mt-2 transition-all duration-200 ease-in-out">
                  <p 
                    className={`text-sm text-gray-600 dark:text-gray-400 transition-all duration-200 ease-in-out ${
                      hoveredScore !== null 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform -translate-y-1'
                    }`}
                  >
                    {hoveredScore !== null 
                      ? RISK_LEVELS.find((level) => level.value === hoveredScore)?.label 
                      : '\u00A0' // Espacio no rompible para mantener la altura
                    }
                  </p>
                </div>
               
                {errors.score_riesgo && (
                  <p className="mt-1 text-sm text-red-500">{errors.score_riesgo.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </FormSection>
  )
}
