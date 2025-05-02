// Enums para opciones de selección
export type ClaseDocumento = "P" | "S"
export type Sexo = "M" | "F"
export type SiNo = "S" | "N"
export type Responsable = "MADRE" | "PADRE" | "TUTOR" | "OTRO"
export type TipoDocumento = "DNI" | "LE" | "LC" | "CI" | "PASAPORTE" | "OTRO"
export type NivelEstudios = "PRIMARIO" | "SECUNDARIO" | "UNIVERSITARIO" | "NINGUNO" | "OTRO"
export type EstadoEstudios = "COMPLETO" | "INCOMPLETO" | "CURSANDO" | "ABANDONADO" | "EN_CURSO"
export type TipoFicha = "1" | "2" | "3"

// Interfaz principal para el beneficiario
export interface Beneficiario {
  // Datos básicos (obligatorios)
  id?: number
  apellido_benef: string
  nombre_benef: string
  clase_documento_benef: ClaseDocumento
  tipo_documento: TipoDocumento
  numero_doc: string
  id_categoria: number
  sexo: Sexo
  fecha_nacimiento_benef: string

  // Lugar de nacimiento
  pais_nac: number // ID del país
  provincia_nac?: number // ID de la provincia
  departamento_nac?: number // ID del departamento
  localidad_nac?: number // ID de la localidad

  // Datos educativos
  indigena?: SiNo
  id_tribu?: number
  id_lengua?: number
  alfabeta?: SiNo
  estudios?: NivelEstudios
  anio_mayor_nivel?: string
  estadoest?: EstadoEstudios

  // Responsable
  responsable?: Responsable

  // Datos de la madre (condicional)
  tipo_doc_madre?: TipoDocumento
  nro_doc_madre?: string
  nombre_madre?: string
  apellido_madre?: string
  alfabeta_madre?: SiNo
  estudios_madre?: NivelEstudios
  anio_mayor_nivel_madre?: string
  estadoest_madre?: EstadoEstudios

  // Datos del padre (condicional)
  tipo_doc_padre?: TipoDocumento
  nro_doc_padre?: string
  nombre_padre?: string
  apellido_padre?: string
  alfabeta_padre?: SiNo
  estudios_padre?: NivelEstudios
  anio_mayor_nivel_padre?: string
  estadoest_padre?: EstadoEstudios

  // Datos del tutor (condicional)
  tipo_doc_tutor?: TipoDocumento
  nro_doc_tutor?: string
  nombre_tutor?: string
  apellido_tutor?: string
  alfabeta_tutor?: SiNo
  estudios_tutor?: NivelEstudios
  anio_mayor_nivel_tutor?: string
  estadoest_tutor?: EstadoEstudios

  // Embarazo (condicional para sexo F)
  menor_embarazada?: SiNo
  fecha_diagnostico_embarazo?: string
  semanas_embarazo?: number
  fecha_probable_parto?: string
  fecha_efectiva_parto?: string
  fum?: string

  // Efectores
  cuie_ea: string
  cuie_ah: string
  cuieefectoracargo?: string

  // Convive con adulto (condicional para id_categoria 5)
  menor_convive_con_adulto?: SiNo

  // Dirección
  pais_residencia: number // ID del país
  provincia: number // ID de la provincia
  departamento: number // ID del departamento
  localidad: number // ID de la localidad
  municipio: number // ID del municipio
  barrio: number // ID del barrio
  calle?: string
  numero_calle?: string
  piso?: string
  dpto?: string
  manzana?: string
  entre_calle_1?: string
  entre_calle_2?: string
  cod_pos: string

  // Contacto
  telefono?: string
  celular?: string
  otrotel?: string
  mail?: string

  // Discapacidades
  discv?: SiNo
  disca?: SiNo
  discmo?: SiNo
  discme?: SiNo
  otradisc?: string

  // Factores de riesgo
  fumador?: SiNo
  diabetes?: SiNo
  infarto?: SiNo
  acv?: SiNo
  hta?: SiNo
  estatinas?: SiNo
  score_riesgo?: number

  // Geo-ubicación
  ubicacionlatitud?: number
  ubicacionlongitud?: number
  precision?: number

  // Administrativos
  tipo_ficha?: TipoFicha
  fecha_inscripcion: string
  observaciones?: string
  obsgenerales?: string

  // Campos ocultos mencionados en la especificación
  estado_envio?: string
  clave_beneficiario?: string
  tipo_transaccion?: string
  fecha_carga?: string
  usuario_carga?: string
  activo?: boolean
}

export interface BeneficiarioCreateRequest extends Omit<Beneficiario, "id"> {}

// Interfaces para los datos de referencia
export interface Pais {
  id: number
  nombre: string
  codigo: string
}

export interface Provincia {
  id: number
  nombre: string
  codigo: string
  pais_id: number
}

export interface Departamento {
  id: number
  nombre: string
  codigo: string
  provincia_id: number
}

export interface Localidad {
  id: number
  nombre: string
  codigo: string
  departamento_id: number
}

export interface CodigoPostal {
  id: number
  codigo: string
  localidad_id: number
}

export interface Municipio {
  id: number
  nombre: string
  codigo: string
  localidad_id: number
}

export interface Barrio {
  id: number
  nombre: string
  codigo: string
  municipio_id: number
}

export interface Calle {
  id: number
  nombre: string
  localidad_id: number
}

export interface Categoria {
  id: number
  nombre: string
  codigo: string
}

export interface Tribu {
  id: number
  nombre: string
  codigo: string
}

export interface Lengua {
  id: number
  nombre: string
}

export interface Efector {
  cuie: string
  nombre: string
  localidad: string
}
