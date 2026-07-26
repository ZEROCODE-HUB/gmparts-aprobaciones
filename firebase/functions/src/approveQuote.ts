import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'

export const approveQuote = functions.https.onCall(async (data) => {
  const { key } = data

  if (!key) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requiere key'
    )
  }

  const db = admin.firestore()
  const snapshot = await db
    .collection('recepciones')
    .where('quote_access_key', '==', key)
    .limit(1)
    .get()

  if (snapshot.empty) {
    throw new functions.https.HttpsError(
      'not-found',
      'No se encontró cotización con esta clave'
    )
  }

  const doc = snapshot.docs[0]
  const docData = doc.data()

  if (docData.aprobacionCotizacion === true) {
    throw new functions.https.HttpsError(
      'already-exists',
      'Esta cotización ya fue aprobada anteriormente'
    )
  }

  await doc.ref.update({
    aprobacionCotizacion: true,
    status: 'Reparación',
    quote_access_key: admin.firestore.FieldValue.delete(),
  })

  return { success: true }
})
