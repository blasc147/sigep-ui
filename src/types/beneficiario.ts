// Enums para opciones de selección
export type ClaseDocumento = "P" | "S"
export type Sexo = "M" | "F"
export type SiNo = "S" | "N"
export type Responsable = "MADRE" | "PADRE" | "TUTOR" | "OTRO"
export type TipoDocumento = "DNI" | "LE" | "LC" | "PASAPORTE"
export type NivelEstudios = "PRIMARIO" | "SECUNDARIO" | "UNIVERSITARIO" | "NINGUNO"
export type EstadoEstudios = "COMPLETO" | "INCOMPLETO" | "CURSANDO" | "ABANDONADO" | "EN_CURSO"
export type TipoFicha = "1" | "2" | "3"

// Add these interfaces at the appropriate place in the file
export interface BeneficiarioResponsePaisNac {
  id_pais: number
  nombre: string
}

export interface BeneficiarioResponseProvinciaNac {
  id_provincia: number
  nombre: string
}

export interface BeneficiarioResponseLocalidadNac {
  id_localidad: number
  nombre: string
}

export interface BeneficiarioResponseDepartamento {
  id_departamento: number
  nombre: string
}

export interface BeneficiarioResponseLocalidad {
  id_localidad: number
  nombre: string
}

export interface BeneficiarioResponseMunicipio {
  id_municipio: number
  nombre: string
}

export interface BeneficiarioResponseCodPos {
  id_codpos: number
  codigopostal: string
}

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

  // Lugar de nacimiento - ahora con objetos anidados
  pais_nac: BeneficiarioResponsePaisNac | number // ID del país o objeto
  provincia_nac?: BeneficiarioResponseProvinciaNac | number // ID o objeto
  departamento_nac?: BeneficiarioResponseDepartamento | number // ID o objeto
  localidad_nac?: BeneficiarioResponseLocalidadNac | number // ID o objeto

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
  fum?: string

  // Efectores
  cuie_ea: string
  cuie_ah: string
  cuieefectoracargo?: string

  // Convive con adulto (condicional para id_categoria 5)
  menor_convive_con_adulto?: SiNo

  // Dirección - actualizada con objetos anidados
  pais_residencia: number | string // ID del país o nombre
  provincia: BeneficiarioResponseProvinciaNac | number // ID o objeto
  departamento: BeneficiarioResponseDepartamento | number // ID o objeto
  localidad: BeneficiarioResponseLocalidad | number // ID o objeto
  municipio: BeneficiarioResponseMunicipio | number // ID o objeto
  barrio: any // Puede ser string, número u objeto
  calle?: string
  numero_calle?: string
  piso?: string
  dpto?: string
  manzana?: string
  entre_calle_1?: string
  entre_calle_2?: string
  cod_pos: BeneficiarioResponseCodPos | string // Objeto o string

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

// Interfaces para los datos de referencia actualizadas según la API
export interface Pais {
  id_pais: number
  nombre: string
}

export interface Provincia {
  id_provincia: number
  cod_provincia: string
  nombre: string
  id_pais: number
  pais?: Pais
}

export interface Departamento {
  id_departamento: number
  nombre: string
  id_provincia: number
  provincia?: Provincia
}

export interface Localidad {
  id_localidad: number
  codigopostal: string
  nombre: string
  id_departamento: number
  departamento?: Departamento
}

export interface CodigoPostal {
  id_codpos: number
  codigopostal: string
  id_localidad: number
  localidad?: Localidad
}

export interface Municipio {
  id_municipio: number
  nombre: string
  id_localidad: number
  id_codpos: number
  localidad?: Localidad
  codPost?: CodigoPostal
}

export interface Barrio {
  id_barrio: number
  nombre: string
  id_municipio: number
  municipio?: Municipio
}

export interface Calle {
  idcalle: number
  nombre: string
  tipo: string
  cp: string
  ciudad: string
  idlocalidad: number
  localidad?: Localidad
}

export interface Categoria {
  id_categoria: number
  categoria: string
  tipo_ficha: string
}

export interface Tribu {
  id_tribu: number
  nombre: string
}

export interface Lengua {
  id_lengua: number
  nombre: string
}

export interface Efector {
  cuie: string
  nombre: string
  localidad: string
}
