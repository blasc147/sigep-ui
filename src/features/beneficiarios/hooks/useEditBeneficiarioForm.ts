"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/Toast"
import { beneficiarioService } from "@/services/beneficiarioService"
import type { BeneficiarioCreateRequest, SiNo, Sexo, Responsable } from "@/types/beneficiario"
import { Beneficiario } from "@/types/beneficiario"

export const useEditBeneficiarioForm = (id?: number) => {
  const router = useRouter()
  const { addToast } = useToast()
  const queryClient = useQueryClient()

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
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<Beneficiario>({
    defaultValues: id ? undefined : {},
  })

  // Valores observados para renderizado condicional
  const sexo = watch("sexo") as Sexo
  const responsable = watch("responsable") as Responsable | undefined
  const idCategoria = watch("id_categoria") as number | undefined
  const indigena = watch("indigena") as SiNo
  const menorEmbarazada = watch("menor_embarazada") as SiNo

  // Consulta para obtener el beneficiario a editar
  const {
    data: beneficiario,
    isLoading: isLoadingBeneficiario,
    error: beneficiarioError,
  } = useQuery<Beneficiario>({
    queryKey: ["beneficiario", id],
    queryFn: () => beneficiarioService.getBeneficiarioById(id!),
    enabled: !!id,
  })

  // Consultas para datos de referencia
  const { data: paises = [] } = useQuery({
    queryKey: ["paises"],
    queryFn: () => beneficiarioService.getPaises(),
  })

  const { data: provinciasNac = [] } = useQuery({
    queryKey: ["provinciasNac", paisId],
    queryFn: () => beneficiarioService.getProvincias(paisId?.toString() || ""),
    enabled: !!paisId,
  })

  const { data: departamentosNac = [] } = useQuery({
    queryKey: ["departamentosNac", provinciaNacId],
    queryFn: () => beneficiarioService.getDepartamentos(provinciaNacId?.toString() || ""),
    enabled: !!provinciaNacId,
  })

  const { data: localidadesNac = [] } = useQuery({
    queryKey: ["localidadesNac", departamentoNacId],
    queryFn: () => beneficiarioService.getLocalidades(departamentoNacId?.toString() || ""),
    enabled: !!departamentoNacId,
  })

  const { data: provinciasResidencia = [] } = useQuery({
    queryKey: ["provinciasResidencia", paisResidenciaId],
    queryFn: () => beneficiarioService.getProvincias(paisResidenciaId?.toString() || ""),
    enabled: !!paisResidenciaId,
  })

  const { data: departamentosResidencia = [] } = useQuery({
    queryKey: ["departamentosResidencia", provinciaResidenciaId],
    queryFn: () => beneficiarioService.getDepartamentos(provinciaResidenciaId?.toString() || ""),
    enabled: !!provinciaResidenciaId,
  })

  const { data: localidadesResidencia = [] } = useQuery({
    queryKey: ["localidadesResidencia", departamentoResidenciaId],
    queryFn: () => beneficiarioService.getLocalidades(departamentoResidenciaId?.toString() || ""),
    enabled: !!departamentoResidenciaId,
  })

  const { data: municipios = [] } = useQuery({
    queryKey: ["municipios", localidadResidenciaId],
    queryFn: () => beneficiarioService.getMunicipios(localidadResidenciaId?.toString() || ""),
    enabled: !!localidadResidenciaId,
  })

  const { data: barrios = [] } = useQuery({
    queryKey: ["barrios", municipioId],
    queryFn: () => beneficiarioService.getBarrios(municipioId?.toString() || ""),
    enabled: !!municipioId,
  })

  const { data: codigosPostales = [] } = useQuery({
    queryKey: ["codigosPostales", localidadResidenciaId],
    queryFn: () => beneficiarioService.getCodigosPostales(localidadResidenciaId?.toString() || ""),
    enabled: !!localidadResidenciaId,
  })

  const { data: calles = [] } = useQuery({
    queryKey: ["calles", localidadResidenciaId],
    queryFn: () => beneficiarioService.getCalles(localidadResidenciaId?.toString() || ""),
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
    mutationFn: (data: Beneficiario) => beneficiarioService.updateBeneficiario(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiarios"] })
      router.push(`/beneficiarios/${id}`)
    },
  })

  // Efecto para cargar los datos del beneficiario en el formulario
  useEffect(() => {
    if (beneficiario && !isFormLoaded) {
      // Cargar los datos del beneficiario en el formulario
      Object.entries(beneficiario).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof Beneficiario, value)
        }
      })

      // Establecer los IDs de ubicación
      if (beneficiario.pais_nac) {
        setPaisId(beneficiario.pais_nac)
      }
      if (beneficiario.pais_residencia) {
        setPaisResidenciaId(beneficiario.pais_residencia)
      }
      if (beneficiario.provincia) {
        setProvinciaResidenciaId(beneficiario.provincia)
      }
      if (beneficiario.departamento) {
        setDepartamentoResidenciaId(beneficiario.departamento)
      }
      if (beneficiario.localidad) {
        setLocalidadResidenciaId(beneficiario.localidad)
      }
      if (beneficiario.municipio) {
        setMunicipioId(beneficiario.municipio)
      }

      setIsFormLoaded(true)
    }
  }, [beneficiario, isFormLoaded, setValue])

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
      setValue("provincia", 0)
      setValue("departamento", 0)
      setValue("localidad", 0)
      setProvinciaNacId(null)
      setDepartamentoNacId(null)
    }
  }, [paisId, setValue])

  useEffect(() => {
    if (provinciaNacId === null) {
      setValue("departamento", 0)
      setValue("localidad", 0)
      setDepartamentoNacId(null)
    }
  }, [provinciaNacId, setValue])

  useEffect(() => {
    if (departamentoNacId === null) {
      setValue("localidad", 0)
    }
  }, [departamentoNacId, setValue])

  useEffect(() => {
    if (paisResidenciaId === null) {
      setValue("provincia", 0)
      setValue("departamento", 0)
      setValue("localidad", 0)
      setValue("municipio", 0)
      setValue("barrio", 0)
      setValue("cod_pos", "")
      setProvinciaResidenciaId(null)
      setDepartamentoResidenciaId(null)
      setLocalidadResidenciaId(null)
      setMunicipioId(null)
    }
  }, [paisResidenciaId, setValue])

  useEffect(() => {
    if (provinciaResidenciaId === null) {
      setValue("departamento", 0)
      setValue("localidad", 0)
      setValue("municipio", 0)
      setValue("barrio", 0)
      setValue("cod_pos", "")
      setDepartamentoResidenciaId(null)
      setLocalidadResidenciaId(null)
      setMunicipioId(null)
    }
  }, [provinciaResidenciaId, setValue])

  useEffect(() => {
    if (departamentoResidenciaId === null) {
      setValue("localidad", 0)
      setValue("municipio", 0)
      setValue("barrio", 0)
      setValue("cod_pos", "")
      setLocalidadResidenciaId(null)
      setMunicipioId(null)
    }
  }, [departamentoResidenciaId, setValue])

  useEffect(() => {
    if (localidadResidenciaId === null) {
      setValue("municipio", 0)
      setValue("barrio", 0)
      setValue("cod_pos", "")
      setMunicipioId(null)
    } else {
      // Si hay un solo código postal disponible, establecerlo automáticamente
      if (codigosPostales && codigosPostales.length === 1) {
        setValue("cod_pos", codigosPostales[0])
      }
    }
  }, [localidadResidenciaId, codigosPostales, setValue])

  useEffect(() => {
    if (municipioId === null) {
      setValue("barrio", 0)
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
  const onSubmit = (data: Beneficiario) => {
    updateBeneficiarioMutation.mutate(data)
  }

  return {
    // Form state
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit,
    updateBeneficiarioMutation,

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

    // Beneficiario data
    beneficiario,
    isLoadingBeneficiario,
    beneficiarioError,
    isFormLoaded,

    // Navigation
    router,
  }
}
