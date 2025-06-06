// Opciones para los selects del formulario de beneficiarios

export const TIPO_DOCUMENTO_OPTIONS = [
    { value: "DNI", label: "DNI" },
    { value: "LE", label: "Libreta de Enrolamiento" },
    { value: "LC", label: "Libreta Cívica" },
    { value: "PASAPORTE", label: "Pasaporte" },
]
  
export const CLASE_DOCUMENTO_OPTIONS = [
    { value: "P", label: "Propio" },
    { value: "A", label: "Ajeno" },
]
  
export const SEXO_OPTIONS = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" },
]
  
export const SI_NO_OPTIONS = [
    { value: "S", label: "Sí" },
    { value: "N", label: "No" },
]
  
export const NIVEL_ESTUDIOS_OPTIONS = [
    { value: "PRIMARIO", label: "Primario" },
    { value: "SECUNDARIO", label: "Secundario" },
    { value: "UNIVERSITARIO", label: "Universitario" },
    { value: "NINGUNO", label: "Ninguno" },
    { value: "OTRO", label: "Otro" },
]
  
export const ESTADO_ESTUDIOS_OPTIONS = [
    { value: "C", label: "Completo" },
    { value: "I", label: "Incompleto" },
]
  
export const RESPONSABLE_OPTIONS = [
    { value: "MADRE", label: "Madre" },
    { value: "PADRE", label: "Padre" },
    { value: "TUTOR", label: "Tutor" },
    { value: "OTRO", label: "Otro" },
]
  
export const TIPO_FICHA_OPTIONS = [
    { value: "1", label: "Papel" },
    { value: "2", label: "Digital" },
    { value: "3", label: "Otro" },
]
  