"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/Toast"
import { beneficiarioService } from "@/services/beneficiarioService"
import type { BeneficiarioCreateRequest, SiNo, Sexo, Responsable, ClaseDocumento } from "@/types/beneficiario"

export const useBeneficiarioForm = () => {
  const router = useRouter()
  const { addToast } = useToast()

  // Estados para los selects dependientes - ahora como números
  const [paisId, setPaisId] = useState<number | null>(null)
  const [provinciaNacId, setProvinciaNacId] = useState<number | null>(null)
  const [departamentoNacId, setDepartamentoNacId] = useState<number | null>(null)
  const [paisResidenciaId, setPaisResidenciaId] = useState<number | null>(null)
  const [provinciaResidenciaId, setProvinciaResidenciaId] = useState<number | null>(null)
  const [departamentoResidenciaId, setDepartamentoResidenciaId] = useState<number | null>(null)
  const [localidadResidenciaId, setLocalidadResidenciaId] = useState<number | null>(null)
  const [municipioId, setMunicipioId] = useState<number | null>(null)

  // Fecha actual para valores por defecto
  const currentDate = new Date().toISOString().split("T")[0]

  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BeneficiarioCreateRequest>({
    defaultValues: {
      clase_documento_benef: "P" as ClaseDocumento,
      sexo: "M" as Sexo,
      fecha_inscripcion: currentDate,
      indigena: "N" as SiNo,
      alfabeta: "N" as SiNo,
      menor_embarazada: "N" as SiNo,
      menor_convive_con_adulto: "N" as SiNo,
      discv: "N" as SiNo,
      disca: "N" as SiNo,
      discmo: "N" as SiNo,
      discme: "N" as SiNo,
      fumador: "N" as SiNo,
      diabetes: "N" as SiNo,
      infarto: "N" as SiNo,
      acv: "N" as SiNo,
      hta: "N" as SiNo,
      estatinas: "N" as SiNo,
    },
  })

  // Valores observados para renderizado condicional
  const sexo = watch("sexo") as Sexo
  const responsable = watch("responsable") as Responsable | undefined
  const idCategoria = watch("id_categoria") as number | undefined
  const indigena = watch("indigena") as SiNo
  const menorEmbarazada = watch("menor_embarazada") as SiNo

  // Consultas para datos de referencia
  const { data: paises = [] } = useQuery({
    queryKey: ["paises"],
    queryFn: beneficiarioService.getPaises,
  })

  const { data: provinciasNac = [] } = useQuery({
    queryKey: ["provinciasNac", paisId],
    queryFn: () => beneficiarioService.getProvincias(paisId!),
    enabled: !!paisId,
  })

  const { data: departamentosNac = [] } = useQuery({
    queryKey: ["departamentosNac", provinciaNacId],
    queryFn: () => beneficiarioService.getDepartamentos(provinciaNacId!),
    enabled: !!provinciaNacId,
  })

  const { data: localidadesNac = [] } = useQuery({
    queryKey: ["localidadesNac", departamentoNacId],
    queryFn: () => beneficiarioService.getLocalidades(departamentoNacId!),
    enabled: !!departamentoNacId,
  })

  const { data: provinciasResidencia = [] } = useQuery({
    queryKey: ["provinciasResidencia", paisResidenciaId],
    queryFn: () => beneficiarioService.getProvincias(paisResidenciaId!),
    enabled: !!paisResidenciaId,
  })

  const { data: departamentosResidencia = [] } = useQuery({
    queryKey: ["departamentosResidencia", provinciaResidenciaId],
    queryFn: () => beneficiarioService.getDepartamentos(provinciaResidenciaId!),
    enabled: !!provinciaResidenciaId,
  })

  const { data: localidadesResidencia = [] } = useQuery({
    queryKey: ["localidadesResidencia", departamentoResidenciaId],
    queryFn: () => beneficiarioService.getLocalidades(departamentoResidenciaId!),
    enabled: !!departamentoResidenciaId,
  })

  const { data: municipios = [] } = useQuery({
    queryKey: ["municipios", localidadResidenciaId],
    queryFn: () => beneficiarioService.getMunicipios(localidadResidenciaId!),
    enabled: !!localidadResidenciaId,
  })

  const { data: barrios = [] } = useQuery({
    queryKey: ["barrios", municipioId],
    queryFn: () => beneficiarioService.getBarrios(municipioId!),
    enabled: !!municipioId,
  })

  const { data: codigosPostales = [] } = useQuery({
    queryKey: ["codigosPostales", localidadResidenciaId],
    queryFn: () => beneficiarioService.getCodigosPostales(localidadResidenciaId!),
    enabled: !!localidadResidenciaId,
  })

  const { data: calles = [] } = useQuery({
    queryKey: ["calles", localidadResidenciaId],
    queryFn: () => beneficiarioService.getCalles(localidadResidenciaId!),
    enabled: !!localidadResidenciaId,
  })

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: beneficiarioService.getCategorias,
  })

  const { data: tribus = [] } = useQuery({
    queryKey: ["tribus"],
    queryFn: beneficiarioService.getTribus,
    enabled: indigena === "S",
  })

  const { data: lenguas = [] } = useQuery({
    queryKey: ["lenguas"],
    queryFn: beneficiarioService.getLenguas,
    enabled: indigena === "S",
  })

  const { data: efectores = [], isLoading: isLoadingEfectores } = useQuery({
    queryKey: ["efectores"],
    queryFn: beneficiarioService.getEfectores,
  })

  // Mutación para crear beneficiario
  const createBeneficiarioMutation = useMutation({
    mutationFn: beneficiarioService.createBeneficiario,
    onSuccess: () => {
      addToast("Beneficiario creado correctamente", "success")
      router.push("/beneficiarios")
    },
    onError: (error: any) => {
      // Extraer el mensaje de error de la respuesta
      let errorMessage = "Error al crear beneficiario"

      if (error.response) {
        // Si hay una respuesta con datos, intentar obtener el mensaje
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data && typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`
        }
      } else if (error.message) {
        // Si hay un mensaje de error directo
        errorMessage = error.message
      }

      addToast(errorMessage, "error")
    },
  })

  // Manejar cambios en selects dependientes
  useEffect(() => {
    if (paisId === null) {
      setValue("provincia_nac", undefined)
      setValue("departamento_nac", undefined)
      setValue("localidad_nac", undefined)
      setProvinciaNacId(null)
      setDepartamentoNacId(null)
    }
  }, [paisId, setValue])

  useEffect(() => {
    if (provinciaNacId === null) {
      setValue("departamento_nac", undefined)
      setValue("localidad_nac", undefined)
      setDepartamentoNacId(null)
    }
  }, [provinciaNacId, setValue])

  useEffect(() => {
    if (departamentoNacId === null) {
      setValue("localidad_nac", undefined)
    }
  }, [departamentoNacId, setValue])

  useEffect(() => {
    if (paisResidenciaId === null) {
      setValue("provincia", undefined)
      setValue("departamento", undefined)
      setValue("localidad", undefined)
      setValue("municipio", undefined)
      setValue("barrio", undefined)
      setValue("cod_pos", "")
      setProvinciaResidenciaId(null)
      setDepartamentoResidenciaId(null)
      setLocalidadResidenciaId(null)
      setMunicipioId(null)
    }
  }, [paisResidenciaId, setValue])

  useEffect(() => {
    if (provinciaResidenciaId === null) {
      setValue("departamento", undefined)
      setValue("localidad", undefined)
      setValue("municipio", undefined)
      setValue("barrio", undefined)
      setValue("cod_pos", "")
      setDepartamentoResidenciaId(null)
      setLocalidadResidenciaId(null)
      setMunicipioId(null)
    }
  }, [provinciaResidenciaId, setValue])

  useEffect(() => {
    if (departamentoResidenciaId === null) {
      setValue("localidad", undefined)
      setValue("municipio", undefined)
      setValue("barrio", undefined)
      setValue("cod_pos", "")
      setLocalidadResidenciaId(null)
      setMunicipioId(null)
    }
  }, [departamentoResidenciaId, setValue])

  useEffect(() => {
    if (localidadResidenciaId === null) {
      setValue("municipio", undefined)
      setValue("barrio", undefined)
      setValue("cod_pos", "")
      setMunicipioId(null)
    } else {
      // Si hay un solo código postal disponible, establecerlo automáticamente
      if (codigosPostales && codigosPostales.length === 1) {
        setValue("cod_pos", codigosPostales[0].codigopostal || codigosPostales[0])
      }
    }
  }, [localidadResidenciaId, codigosPostales, setValue])

  useEffect(() => {
    if (municipioId === null) {
      setValue("barrio", undefined)
    }
  }, [municipioId, setValue])

  // Función para obtener el nombre a partir del ID
  const getNombreById = (
    id: number | string | undefined,
    items: any[],
    idField: string,
    nombreField: string,
  ): string => {
    if (!id || !items || items.length === 0) return ""
    const item = items.find((i) => String(i[idField]) === String(id))
    return item ? item[nombreField] : ""
  }

  // Enviar formulario
  const onSubmit = async (data: BeneficiarioCreateRequest) => {
    try {
      // Crear una copia de los datos para modificarlos
      const formData = { ...data }

      // Convertir IDs a nombres para los campos de ubicación
      // Lugar de nacimiento
      if (formData.pais_nac) {
        formData.pais_nac = getNombreById(formData.pais_nac, paises, "id_pais", "nombre") as any
      }
      if (formData.provincia_nac) {
        formData.provincia_nac = getNombreById(formData.provincia_nac, provinciasNac, "id_provincia", "nombre") as any
      }
      if (formData.departamento_nac) {
        formData.departamento_nac = getNombreById(
          formData.departamento_nac,
          departamentosNac,
          "id_departamento",
          "nombre",
        ) as any
      }
      if (formData.localidad_nac) {
        formData.localidad_nac = getNombreById(formData.localidad_nac, localidadesNac, "id_localidad", "nombre") as any
      }

      // Dirección
      if (formData.pais_residencia) {
        formData.pais_residencia = getNombreById(formData.pais_residencia, paises, "id_pais", "nombre") as any
      }
      if (formData.provincia) {
        formData.provincia = getNombreById(formData.provincia, provinciasResidencia, "id_provincia", "nombre") as any
      }
      if (formData.departamento) {
        formData.departamento = getNombreById(
          formData.departamento,
          departamentosResidencia,
          "id_departamento",
          "nombre",
        ) as any
      }
      if (formData.localidad) {
        formData.localidad = getNombreById(formData.localidad, localidadesResidencia, "id_localidad", "nombre") as any
      }
      if (formData.municipio) {
        formData.municipio = getNombreById(formData.municipio, municipios, "id_municipio", "nombre") as any
      }
      if (formData.barrio) {
        formData.barrio = getNombreById(formData.barrio, barrios, "id_barrio", "nombre") as any
      }

      // Asegurarse de que los campos numéricos sean números
      if (typeof formData.id_categoria === "string") {
        formData.id_categoria = Number(formData.id_categoria)
      }

      if (typeof formData.id_tribu === "string" && formData.id_tribu) {
        formData.id_tribu = Number(formData.id_tribu)
      }

      if (typeof formData.id_lengua === "string" && formData.id_lengua) {
        formData.id_lengua = Number(formData.id_lengua)
      }

      // Enviar el formulario
      await createBeneficiarioMutation.mutateAsync(formData)
    } catch (error: any) {
      console.error("Error al crear beneficiario:", error)

      // Mostrar mensaje de error más detallado
      let errorMessage = "Error al crear beneficiario"
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      addToast(errorMessage, "error")
    }
  }

  return {
    // Form state
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    watch,
    setValue,

    // Conditional rendering values
    sexo,
    responsable,
    idCategoria,
    indigena,
    menorEmbarazada,

    // Data for selects
    paises,
    provinciasNac,
    departamentosNac,
    localidadesNac,
    provinciasResidencia,
    departamentosResidencia,
    localidadesResidencia,
    municipios,
    barrios,
    categorias,
    tribus,
    lenguas,
    efectores,
    isLoadingEfectores,
    codigosPostales,
    calles,

    // Select state handlers
    paisId,
    setPaisId,
    paisResidenciaId,
    setPaisResidenciaId,
    provinciaNacId,
    setProvinciaNacId,
    provinciaResidenciaId,
    setProvinciaResidenciaId,
    departamentoNacId,
    setDepartamentoNacId,
    departamentoResidenciaId,
    setDepartamentoResidenciaId,
    localidadResidenciaId,
    setLocalidadResidenciaId,
    municipioId,
    setMunicipioId,

    // Form submission
    onSubmit,
    createBeneficiarioMutation,

    // Navigation
    router,
  }
}
