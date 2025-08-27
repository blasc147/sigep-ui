"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/Toast"
import { beneficiarioService } from "@/services/beneficiarioService"
import type { BeneficiarioCreateRequest, SiNo, Sexo, Responsable, ClaseDocumento, TipoDocumento } from "@/types/beneficiario"

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
      tipo_documento: "DNI" as TipoDocumento,
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
      pais_nac: 2, // Argentina
      provincia_nac: undefined, // Se establecerá cuando se carguen las provincias
      departamento_nac: undefined,
      localidad_nac: undefined,
      pais_residencia: 2, // Argentina
      provincia: undefined, // Se establecerá cuando se carguen las provincias
      departamento: undefined,
      localidad: undefined,
      municipio: undefined,
      barrio: undefined,
      cod_pos: undefined, // Puede ser string, objeto o undefined
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
    queryFn: () => beneficiarioService.getProvincias(paisId!.toString()),
    enabled: !!paisId,
  })

  const { data: departamentosNac = [] } = useQuery({
    queryKey: ["departamentosNac", provinciaNacId],
    queryFn: () => beneficiarioService.getDepartamentos(provinciaNacId!.toString()),
    enabled: !!provinciaNacId,
  })

  const { data: localidadesNac = [] } = useQuery({
    queryKey: ["localidadesNac", departamentoNacId],
    queryFn: () => beneficiarioService.getLocalidades(departamentoNacId!.toString()),
    enabled: !!departamentoNacId,
  })

  const { data: provinciasResidencia = [] } = useQuery({
    queryKey: ["provinciasResidencia", paisResidenciaId],
    queryFn: () => beneficiarioService.getProvincias(paisResidenciaId!.toString()),
    enabled: !!paisResidenciaId,
  })

  const { data: departamentosResidencia = [] } = useQuery({
    queryKey: ["departamentosResidencia", provinciaResidenciaId],
    queryFn: () => beneficiarioService.getDepartamentos(provinciaResidenciaId!.toString()),
    enabled: !!provinciaResidenciaId,
  })

  const { data: localidadesResidencia = [] } = useQuery({
    queryKey: ["localidadesResidencia", departamentoResidenciaId],
    queryFn: () => beneficiarioService.getLocalidades(departamentoResidenciaId!.toString()),
    enabled: !!departamentoResidenciaId,
  })

  const { data: municipios = [] } = useQuery({
    queryKey: ["municipios", localidadResidenciaId],
    queryFn: () => beneficiarioService.getMunicipios(localidadResidenciaId!.toString()),
    enabled: !!localidadResidenciaId,
  })

  const { data: barrios = [] } = useQuery({
    queryKey: ["barrios", municipioId],
    queryFn: () => beneficiarioService.getBarrios(municipioId!.toString()),
    enabled: !!municipioId,
  })

  const { data: codigosPostales = [] } = useQuery({
    queryKey: ["codigosPostales", localidadResidenciaId],
    queryFn: () => beneficiarioService.getCodigosPostales(localidadResidenciaId!.toString()),
    enabled: !!localidadResidenciaId,
  })

  const { data: calles = [] } = useQuery({
    queryKey: ["calles", localidadResidenciaId],
    queryFn: () => beneficiarioService.getCalles(localidadResidenciaId!.toString()),
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

  // Establecer valores por defecto al montar el componente
  useEffect(() => {
    setValue("tipo_documento", "DNI" as TipoDocumento)
    
    // Establecer provincia por defecto solo cuando las provincias estén cargadas
    if (provinciasResidencia.length > 0) {
      const provinciaChaco = provinciasResidencia.find(p => p.id_provincia === 2)
      if (provinciaChaco) {
        setValue("provincia", provinciaChaco.id_provincia)
        setProvinciaResidenciaId(2)
      }
    }
  }, [setValue, provinciasResidencia])

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
      setValue("cod_pos", undefined)
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
      setValue("cod_pos", undefined)
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
      setValue("cod_pos", undefined)
      setLocalidadResidenciaId(null)
      setMunicipioId(null)
    }
  }, [departamentoResidenciaId, setValue])

  useEffect(() => {
    if (localidadResidenciaId === null) {
      setValue("municipio", undefined)
      setValue("barrio", undefined)
      setValue("cod_pos", undefined)
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

  // Establecer los IDs iniciales para los selects dependientes
  useEffect(() => {
    setPaisId(2) // Argentina
    setProvinciaNacId(2) // Chaco
    setPaisResidenciaId(2) // Argentina
    setProvinciaResidenciaId(2) // Chaco
  }, [setPaisId, setProvinciaNacId, setPaisResidenciaId, setProvinciaResidenciaId])

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

      // Procesar fechas para evitar problemas de zona horaria
      if (formData.fecha_nacimiento_benef) {
        // Asegurar que la fecha se envíe en el formato correcto sin zona horaria
        const fechaNac = new Date(formData.fecha_nacimiento_benef + 'T00:00:00')
        formData.fecha_nacimiento_benef = fechaNac.toISOString().split('T')[0]
      }

      if (formData.fecha_inscripcion) {
        // Asegurar que la fecha se envíe en el formato correcto sin zona horaria
        const fechaInsc = new Date(formData.fecha_inscripcion + 'T00:00:00')
        formData.fecha_inscripcion = fechaInsc.toISOString().split('T')[0]
      }

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
        // Si el barrio es un número, es un ID y necesitamos obtener el nombre
        if (typeof formData.barrio === 'number') {
          formData.barrio = getNombreById(formData.barrio, barrios, "id_barrio", "nombre") as any
        }
        // Si es un string, lo dejamos como está (es un ingreso manual)
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

      // Para código postal
      if (formData.cod_pos) {
        formData.cod_pos = typeof formData.cod_pos === 'object' ? formData.cod_pos.codigopostal : formData.cod_pos
      }

      console.log("Datos que se enviarán a la API:", formData)

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

  const handleProvinciaNacChange = (value: number | BeneficiarioResponseProvinciaNac | undefined) => {
    if (typeof value === "number") {
      setValue("provincia_nac", value)
      setProvinciaNacId(value)
    } else if (value) {
      setValue("provincia_nac", value.id_provincia)
      setProvinciaNacId(value.id_provincia)
    } else {
      setValue("provincia_nac", undefined)
      setProvinciaNacId(undefined)
    }
    setValue("departamento_nac", undefined)
    setValue("localidad_nac", undefined)
  }

  const handleDepartamentoNacChange = (value: number | BeneficiarioResponseDepartamento | undefined) => {
    if (typeof value === "number") {
      setValue("departamento_nac", value)
      setDepartamentoNacId(value)
    } else if (value) {
      setValue("departamento_nac", value.id_departamento)
      setDepartamentoNacId(value.id_departamento)
    } else {
      setValue("departamento_nac", undefined)
      setDepartamentoNacId(undefined)
    }
    setValue("localidad_nac", undefined)
  }

  const handleLocalidadNacChange = (value: number | BeneficiarioResponseLocalidad | undefined) => {
    if (typeof value === "number") {
      setValue("localidad_nac", value)
      setLocalidadNacId(value)
    } else if (value) {
      setValue("localidad_nac", value.id_localidad)
      setLocalidadNacId(value.id_localidad)
    } else {
      setValue("localidad_nac", undefined)
      setLocalidadNacId(undefined)
    }
  }

  const handleProvinciaResidenciaChange = (value: number | BeneficiarioResponseProvinciaNac | undefined) => {
    if (typeof value === "number") {
      setValue("provincia", value)
      setProvinciaResidenciaId(value)
    } else if (value) {
      setValue("provincia", value.id_provincia)
      setProvinciaResidenciaId(value.id_provincia)
    } else {
      setValue("provincia", undefined)
      setProvinciaResidenciaId(undefined)
    }
    setValue("departamento", undefined)
    setValue("localidad", undefined)
    setValue("municipio", undefined)
  }

  const handleDepartamentoResidenciaChange = (value: number | BeneficiarioResponseDepartamento | undefined) => {
    if (typeof value === "number") {
      setValue("departamento", value)
      setDepartamentoResidenciaId(value)
    } else if (value) {
      setValue("departamento", value.id_departamento)
      setDepartamentoResidenciaId(value.id_departamento)
    } else {
      setValue("departamento", undefined)
      setDepartamentoResidenciaId(undefined)
    }
    setValue("localidad", undefined)
    setValue("municipio", undefined)
  }

  const handleLocalidadResidenciaChange = (value: number | BeneficiarioResponseLocalidad | undefined) => {
    if (typeof value === "number") {
      setValue("localidad", value)
      setLocalidadResidenciaId(value)
    } else if (value) {
      setValue("localidad", value.id_localidad)
      setLocalidadResidenciaId(value.id_localidad)
    } else {
      setValue("localidad", undefined)
      setLocalidadResidenciaId(undefined)
    }
    setValue("municipio", undefined)
  }

  const handleMunicipioChange = (value: number | BeneficiarioResponseMunicipio | undefined) => {
    if (typeof value === "number") {
      setValue("municipio", value)
      setMunicipioId(value)
    } else if (value) {
      setValue("municipio", value.id_municipio)
      setMunicipioId(value.id_municipio)
    } else {
      setValue("municipio", undefined)
      setMunicipioId(undefined)
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
