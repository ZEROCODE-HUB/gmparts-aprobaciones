export interface Repuesto {
  nombre: string
  cantidad: number
  precio: number
  total: number
}

export interface Diagnostico {
  nombreFalla: string
  solucion: string
  fotos: string[]
  repuestos: Repuesto[]
  manoDeObra: number
  imagenesFinalizado?: string[]
  fotosfinalizar?: string[]
  precioservicio?: number
  nombreServicio?: string
  aprobacionCliente?: boolean
}

export interface RecepcionData {
  id: string
  numeroorden: number
  nombreCliente: string
  telefono: string
  correoElectronico: string
  placa: string
  marca: string
  modelo: string
  anio?: string
  nivelCombustible?: string
  inventario?: string[]
  observaciones?: string
  status: string
  aprobacionCotizacion: boolean
  subtotal: number
  igv: number
  total: number
  fechaIngreso?: string
  fechaSalida?: string
  tecnicoServicio?: string
  tipoServicio?: string
  motivoIngreso?: string
  fotos?: string[]
  fotosFinalizacion?: string[]
  diagnosticos: Diagnostico[]
  quote_access_key?: string
  report_access_key?: string
  reception_access_key?: string
  aprobacionCliente?: boolean
  clientecontrolcalidad1?: string
  clientecontrolcalidad2?: string
  clientecontrolcalidad3?: string
  clientecontrolcalidad4?: string
}

export interface ValidateKeyResponse {
  valid: boolean
  data?: RecepcionData
}

export interface ApproveQuoteResponse {
  success: boolean
}

export interface SurveyData {
  rating1: string
  rating2: string
  rating3: string
  comment: string
}

export interface ApproveReportResponse {
  success: boolean
}

export interface ApproveReceptionResponse {
  success: boolean
}

export interface GenerateLinkResponse {
  url: string
}

export interface SendEmailResponse {
  success: boolean
}
