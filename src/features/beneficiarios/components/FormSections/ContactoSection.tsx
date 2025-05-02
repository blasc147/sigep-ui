import { Input } from "@/components/ui/Input"
import { FormSection } from "@/features/beneficiarios/components/FormSection"

interface ContactoSectionProps {
  register: any
  errors: any
}

export const ContactoSection = ({ register, errors }: ContactoSectionProps) => {
  return (
    <FormSection title="Contacto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Teléfono" {...register("telefono")} error={errors.telefono?.message} fullWidth />

        <Input label="Celular" {...register("celular")} error={errors.celular?.message} fullWidth />

        <Input label="Otro Teléfono" {...register("otrotel")} error={errors.otrotel?.message} fullWidth />

        <Input
          label="Email"
          type="email"
          {...register("mail", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido",
            },
          })}
          error={errors.mail?.message}
          fullWidth
        />
      </div>
    </FormSection>
  )
}
