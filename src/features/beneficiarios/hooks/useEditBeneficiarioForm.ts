"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/Toast"
import { beneficiarioService } from "@/services/beneficiarioService"
import type { BeneficiarioCreateRequest, SiNo, Sexo, Responsable } from "@/types/beneficiario"

export const useEditBeneficiarioForm = (beneficiarioId: number | undefined) => {
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
  const [isFormLoaded, setIsFormLoaded] = useState(false)

  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiarioCreateRequest>()

  // Valores observados para renderizado condicional
  const sexo = watch("sexo") as Sexo
  const responsable = watch("responsable") as Responsable | undefined
  const idCategoria = watch("id_categoria") as number | undefined
  const indigena = watch("indigena") as SiNo
  const menorEmbarazada = watch("menor_embarazada") as SiNo

  // Función para cargar los datos del beneficiario en el formulario
  const loadBeneficiarioData = useCallback(
    (data: any) => {
      console.log("Ejecutando loadBeneficiarioData con datos:", data)
      try {
        if (!data) {
          console.error("No se encontraron datos del beneficiario")
          setIsFormLoaded(true)
          return
        }

        // Establecer los valores de los campos simples
        setValue("apellido_benef", data.apellido_benef || "")
        setValue("nombre_benef", data.nombre_benef || "")
        setValue("clase_documento_benef", data.clase_documento_benef || "")
        setValue("tipo_documento", data.tipo_documento || "")
        setValue("numero_doc", data.numero_doc || "")
        setValue("id_categoria", data.id_categoria || "")
        setValue("sexo", data.sexo || "")
        setValue("fecha_nacimiento_benef", formatDateForInput(data.fecha_nacimiento_benef))
        setValue("indigena", data.indigena || "N")
        setValue("id_tribu", data.id_tribu || "")
        setValue("id_lengua", data.id_lengua || "")
        setValue("alfabeta", data.alfabeta || "N")
        setValue("estudios", data.estudios || "")
        setValue("anio_mayor_nivel", data.anio_mayor_nivel || "")
        setValue("estadoest", data.estadoest || "")
        setValue("responsable", data.responsable || "")

        // Datos de la madre
        setValue("tipo_doc_madre", data.tipo_doc_madre || "")
        setValue("nro_doc_madre", data.nro_doc_madre || "")
        setValue("nombre_madre", data.nombre_madre || "")
        setValue("apellido_madre", data.apellido_madre || "")
        setValue("alfabeta_madre", data.alfabeta_madre || "N")
        setValue("estudios_madre", data.estudios_madre || "")
        setValue("anio_mayor_nivel_madre", data.anio_mayor_nivel_madre || "")
        setValue("estadoest_madre", data.estadoest_madre || "")

        // Datos del padre
        setValue("tipo_doc_padre", data.tipo_doc_padre || "")
        setValue("nro_doc_padre", data.nro_doc_padre || "")
        setValue("nombre_padre", data.nombre_padre || "")
        setValue("apellido_padre", data.apellido_padre || "")
        setValue("alfabeta_padre", data.alfabeta_padre || "N")
        setValue("estudios_padre", data.estudios_padre || "")
        setValue("anio_mayor_nivel_padre", data.anio_mayor_nivel_padre || "")
        setValue("estadoest_padre", data.estadoest_padre || "")

        // Datos del tutor
        setValue("tipo_doc_tutor", data.tipo_doc_tutor || "")
        setValue("nro_doc_tutor", data.nro_doc_tutor || "")
        setValue("nombre_tutor", data.nombre_tutor || "")
        setValue("apellido_tutor", data.apellido_tutor || "")
        setValue("alfabeta_tutor", data.alfabeta_tutor || "N")
        setValue("estudios_tutor", data.estudios_tutor || "")
        setValue("anio_mayor_nivel_tutor", data.anio_mayor_nivel_tutor || "")
        setValue("estadoest_tutor", data.estadoest_tutor || "")

        // Embarazo
        setValue("menor_embarazada", data.menor_embarazada || "N")
        setValue("fecha_diagnostico_embarazo", formatDateForInput(data.fecha_diagnostico_embarazo))
        setValue("semanas_embarazo", data.semanas_embarazo || "")
        setValue("fecha_probable_parto", formatDateForInput(data.fecha_probable_parto))
        setValue("fecha_efectiva_parto", formatDateForInput(data.fecha_efectiva_parto))
        setValue("fum", formatDateForInput(data.fum))

        // Efectores
        setValue("cuie_ea", data.cuie_ea || "")
        setValue("cuie_ah", data.cuie_ah || "")
        setValue("cuieefectoracargo", data.cuieefectoracargo || "")

        // Convivencia
        setValue("menor_convive_con_adulto", data.menor_convive_con_adulto || "N")

        // Dirección
        setValue("calle", data.calle || "")
        setValue("numero_calle", data.numero_calle || "")
        setValue("piso", data.piso || "")
        setValue("dpto", data.dpto || "")
        setValue("manzana", data.manzana || "")
        setValue("entre_calle_1", data.entre_calle_1 || "")
        setValue("entre_calle_2", data.entre_calle_2 || "")
        setValue("cod_pos", data.cod_pos?.codigopostal || data.cod_pos || "")

        // Contacto
        setValue("telefono", data.telefono || "")
        setValue("celular", data.celular || "")
        setValue("otrotel", data.otrotel || "")
        setValue("mail", data.mail || "")

        // Discapacidades
        setValue("discv", data.discv || "N")
        setValue("disca", data.disca || "N")
        setValue("discmo", data.discmo || "N")
        setValue("discme", data.discme || "N")
        setValue("otradisc", data.otradisc || "")

        // Factores de riesgo
        setValue("fumador", data.fumador || "N")
        setValue("diabetes", data.diabetes || "N")
        setValue("infarto", data.infarto || "N")
        setValue("acv", data.acv || "N")
        setValue("hta", data.hta || "N")
        setValue("estatinas", data.estatinas || "N")
        setValue("score_riesgo", data.score_riesgo || "")

        // Geo-ubicación
        setValue("ubicacionlatitud", data.ubicacionlatitud || "")
        setValue("ubicacionlongitud", data.ubicacionlongitud || "")
        setValue("precision", data.precision || "")

        // Administrativos
        setValue("tipo_ficha", data.tipo_ficha || "")
        setValue("fecha_inscripcion", formatDateForInput(data.fecha_inscripcion))
        setValue("observaciones", data.observaciones || "")
        setValue("obsgenerales", data.obsgenerales || "")

        // Manejar campos de ubicación anidados
        // País de nacimiento
        if (data.pais_nac && data.pais_nac.id_pais) {
          setPaisId(data.pais_nac.id_pais)
          setValue("pais_nac", data.pais_nac.id_pais)
        } else {
          setPaisId(2) // Argentina
          setValue("pais_nac", 2)
        }

        // Provincia de nacimiento
        if (data.provincia_nac && data.provincia_nac.id_provincia) {
          setProvinciaNacId(data.provincia_nac.id_provincia)
          setValue("provincia_nac", data.provincia_nac.id_provincia)
        } else {
          setProvinciaNacId(2) // Chaco
          setValue("provincia_nac", 2)
        }

        // Localidad de nacimiento
        if (data.localidad_nac && data.localidad_nac.id_localidad) {
          setDepartamentoNacId(data.departamento_nac?.id_departamento)
          setValue("departamento_nac", data.departamento_nac?.id_departamento)
          setValue("localidad_nac", data.localidad_nac.id_localidad)
        }

        // País de residencia (Argentina por defecto)
        setPaisResidenciaId(2) // Argentina
        setValue("pais_residencia", 2)

        // Provincia, departamento, localidad de residencia
        if (data.departamento && data.departamento.id_departamento) {
          setProvinciaResidenciaId(data.provincia?.id_provincia || 2) // 2 es para Chaco
          setValue("provincia", data.provincia?.id_provincia || 2)

          setDepartamentoResidenciaId(data.departamento.id_departamento)
          setValue("departamento", data.departamento.id_departamento)
        } else {
          setProvinciaResidenciaId(2) // Chaco
          setValue("provincia", 2)
        }

        if (data.localidad && data.localidad.id_localidad) {
          setLocalidadResidenciaId(data.localidad.id_localidad)
          setValue("localidad", data.localidad.id_localidad)
        }

        if (data.municipio && data.municipio.id_municipio) {
          setMunicipioId(data.municipio.id_municipio)
          setValue("municipio", data.municipio.id_municipio)
        }

        if (data.barrio) {
          // Para barrio, si viene como string y no como objeto
          setValue("barrio", data.barrio.id_barrio || data.barrio)
        }

        console.log("Estableciendo valores de ubicación:")
        console.log("País nacimiento:", data.pais_nac)
        console.log("Provincia nacimiento:", data.provincia_nac)
        console.log("Departamento:", data.departamento)
        console.log("Localidad:", data.localidad)
        console.log("Municipio:", data.municipio)
        console.log("Código postal:", data.cod_pos)

        console.log("Formulario cargado correctamente")
      } catch (error) {
        console.error("Error al cargar datos del beneficiario:", error)
        addToast("Error al cargar datos del beneficiario", "error")
      } finally {
        // Siempre marcamos el formulario como cargado, incluso si hay errores
        setIsFormLoaded(true)
      }
    },
    [
      setValue,
      addToast,
      setPaisId,
      setProvinciaNacId,
      setDepartamentoNacId,
      setPaisResidenciaId,
      setProvinciaResidenciaId,
      setDepartamentoResidenciaId,
      setLocalidadResidenciaId,
      setMunicipioId,
    ],
  )

  // Consulta para obtener el beneficiario a editar
  const {
    data: beneficiario,
    isLoading: isLoadingBeneficiario,
    error: beneficiarioError,
  } = useQuery({
    queryKey: ["beneficiario", beneficiarioId],
    queryFn: () => beneficiarioService.getBeneficiarioById(beneficiarioId!),
    enabled: !!beneficiarioId,
    onSuccess: (data) => {
      console.log("Beneficiario cargado:", data)
      // Cargar los datos del beneficiario en el formulario
      if (data && !isFormLoaded) {
        loadBeneficiarioData(data)
      }
    },
    onError: (error) => {
      console.error("Error al cargar beneficiario:", error)
      setIsFormLoaded(true) // Marcar como cargado incluso en caso de error
    },
    retry: 1, // Reducir el número de reintentos
  })

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

  // Mutación para actualizar beneficiario
  const updateBeneficiarioMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BeneficiarioCreateRequest> }) =>
      beneficiarioService.updateBeneficiario(id, data),
    onSuccess: () => {
      addToast("Beneficiario actualizado correctamente", "success")
      router.push(`/beneficiarios/${beneficiarioId}`)
    },
    onError: (error: any) => {
      // Extraer el mensaje de error de la respuesta
      let errorMessage = "Error al actualizar beneficiario"

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

  // Función para formatear fechas para inputs de tipo date
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return ""

    // Ignorar fechas por defecto (1900-01-01 o similares)
    if (dateString.includes("1900-01-01") || dateString.includes("1899-12-30")) {
      return ""
    }

    try {
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    } catch (error) {
      return ""
    }
  }

  // Manejar cambios en selects dependientes
  useEffect(() => {
    if (paisId === null) {
      setValue("provincia_nac", undefined)
      setValue("departamento_nac", undefined)
      setValue("localidad_nac", undefined)
      setProvinciaNacId(null)
      setDepartamentoNacId(null)
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
    if (!beneficiario?.id) return

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

      // Enviar el formulario usando el ID del beneficiario
      await updateBeneficiarioMutation.mutateAsync({ id: beneficiario.id, data: formData })
    } catch (error: any) {
      console.error("Error al actualizar beneficiario:", error)

      // Mostrar mensaje de error más detallado
      let errorMessage = "Error al actualizar beneficiario"
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

  // For debugging purposes, let's add some additional info when the form loads
  useEffect(() => {
    if (beneficiario && !isFormLoaded) {
      console.log("Beneficiario data recibida, pero formulario aún no cargado:", beneficiario)
    }
  }, [beneficiario, isFormLoaded])

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
    updateBeneficiarioMutation,

    // Beneficiario data
    beneficiario,
    isLoadingBeneficiario,
    beneficiarioError,
    isFormLoaded,

    // Navigation
    router,

    // Expose loadBeneficiarioData for manual loading
    loadBeneficiarioData,
  }
}
