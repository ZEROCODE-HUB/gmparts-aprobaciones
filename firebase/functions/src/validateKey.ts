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
  diagnosticos: Diagnostico[]
}

export const validateKey = functions.https.onCall(async (data) => {
  const { key, purpose } = data

  if (!key || !purpose) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requieren key y purpose'
    )
  }

  if (purpose !== 'quote' && purpose !== 'report') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'purpose debe ser "quote" o "report"'
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
      nombreFalla: diagData.nombreFalla || '',
      solucion: diagData.solucion || '',
      fotos: diagData.fotos || [],
      repuestos: (diagData.repuestos || []).map((r: Repuesto) => ({
        nombre: r.nombre || '',
        cantidad: r.cantidad || 0,
        precio: r.precio || 0,
        total: r.total || 0,
      })),
      manoDeObra: diagData.manoDeObra || 0,
      aprobacionCliente: diagData.aprobacionCliente || false,
    }
  })

  const recepcionData: RecepcionData = {
    id: doc.id,
    numeroorden: docData.numeroorden,
    nombreCliente: docData.nombreCliente || '',
    telefono: docData.telefono || '',
    correoElectronico: docData.correoElectronico || '',
    placa: docData.placa || '',
    marca: docData.marca || '',
    modelo: docData.modelo || '',
    anio: docData.anio || undefined,
    nivelCombustible: docData.nivelCombustible || undefined,
    inventario: docData.inventario || undefined,
    observaciones: docData.observaciones || undefined,
    status: docData.status || '',
    aprobacionCotizacion: docData.aprobacionCotizacion || false,
    subtotal: docData.subtotal || 0,
    igv: docData.igv || 0,
    total: docData.total || 0,
    fechaIngreso: docData.fechaIngreso || undefined,
    fechaSalida: docData.fechaSalida || undefined,
    tecnicoServicio: docData.tecnicoServicio || undefined,
    tipoServicio: docData.tipoServicio || undefined,
    motivoIngreso: docData.motivoIngreso || undefined,
    fotos: docData.fotos || undefined,
    diagnosticos,
  }

  return { valid: true, data: recepcionData }
})
