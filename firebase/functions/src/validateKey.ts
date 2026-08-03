import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'

interface Repuesto {
  nombre: string
  cantidad: number
  precio: number
  total: number
}

interface Diagnostico {
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

interface RecepcionData {
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
  inventario?: string
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
  comentariosFinalizacion?: string
  aprobacionCliente?: boolean
  diagnosticos: Diagnostico[]
}

function toIso(value: unknown): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') return value
  const v = value as { toDate?: () => Date }
  if (typeof v.toDate === 'function') return v.toDate().toISOString()
  return undefined
}

export const validateKey = functions.https.onCall(async (data) => {
  const { key, purpose } = data

  if (!key || !purpose) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requieren key y purpose'
    )
  }

  if (purpose !== 'quote' && purpose !== 'report' && purpose !== 'reception') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'purpose debe ser "quote", "report" o "reception"'
    )
  }

  const db = admin.firestore()
  const fieldName = `${purpose}_access_key`
  const snapshot = await db
    .collection('recepciones')
    .where(fieldName, '==', key)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return { valid: false }
  }

  const doc = snapshot.docs[0]
  const docData = doc.data()

  const diagnosticosSnapshot = await doc.ref.collection('diagnosticos').get()
  const diagnosticos: Diagnostico[] = diagnosticosSnapshot.docs.map((d) => {
    const diagData = d.data()
    return {
      nombreFalla: diagData.nombreFalla ?? diagData.Nombre_falla ?? '',
      solucion: diagData.solucion ?? diagData.Solucion ?? '',
      fotos: diagData.fotos ?? diagData.Fotos ?? [],
      repuestos: ((diagData.repuestos ?? diagData.Repuestos) || []).map((r: Repuesto) => ({
        nombre: r.nombre || '',
        cantidad: r.cantidad || 0,
        precio: r.precio || 0,
        total: r.total || 0,
      })),
      manoDeObra: diagData.manoDeObra ?? diagData.Mano_de_obra ?? 0,
      imagenesFinalizado: diagData.imagenes_finalizado ?? diagData.imagenesFinalizado ?? [],
      fotosfinalizar: diagData.Fotosfinalizar ?? diagData.fotosfinalizar ?? [],
      precioservicio: diagData.precioservicio ?? 0,
      nombreServicio: diagData.nombre_servicio ?? diagData.nombreServicio ?? diagData.Solucion ?? diagData.solucion ?? '',
      aprobacionCliente: diagData.aprobacionCliente ?? diagData.aprobacion_cliente ?? false,
    }
  })

  const recepcionData: RecepcionData = {
    id: doc.id,
    numeroorden: docData.numeroorden,
    nombreCliente: docData.nombreCliente ?? docData.nombre_cliente ?? '',
    telefono: docData.telefono || '',
    correoElectronico: docData.correoElectronico ?? docData.Correo_electronico ?? '',
    placa: docData.placa || '',
    marca: docData.marca || '',
    modelo: docData.modelo || '',
    anio: docData.anio ?? docData.Ano_fabricacion ?? undefined,
    nivelCombustible: docData.nivelCombustible ?? docData.Nivel_combustible ?? undefined,
    inventario: docData.inventario ?? docData.Inventario ?? undefined,
    observaciones: docData.observaciones ?? docData.Observaciones_adicionales ?? undefined,
    status: docData.status || '',
    aprobacionCotizacion: docData.aprobacionCotizacion ?? docData.aprobacion_cotizacion ?? false,
    subtotal: docData.subtotal ?? docData.Subtotal ?? 0,
    igv: docData.igv ?? docData.IGV ?? 0,
    total: docData.total ?? docData.Total ?? 0,
    fechaIngreso: toIso(docData.fechaIngreso) ?? toIso(docData.fecha_creacion),
    fechaSalida: toIso(docData.fechaSalida) ?? toIso(docData.fecha_salida),
    tecnicoServicio: docData.tecnicoServicio ?? docData.tecnico_servicio ?? undefined,
    tipoServicio: docData.tipoServicio ?? docData.tipo_servicio ?? undefined,
    motivoIngreso: docData.motivoIngreso ?? docData.motivo_ingreso ?? undefined,
    fotos: docData.fotos ?? undefined,
    fotosFinalizacion: docData.fotosFinalizacion ?? docData.fotos_finalizacion ?? undefined,
    comentariosFinalizacion: docData.comentariosFinalizacion ?? docData.comentarios_finalizacion ?? undefined,
    aprobacionCliente: docData.aprobacionCliente ?? docData.aprobacion_cliente ?? false,
    diagnosticos,
  }

  return { valid: true, data: recepcionData }
})
