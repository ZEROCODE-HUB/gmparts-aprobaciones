import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'

const WEB_CLIENT_URL = process.env.WEB_CLIENT_URL || 'https://web-client.vercel.app'

export const generateLink = functions.https.onCall(async (data) => {
  const { receptionId, purpose } = data

  if (!receptionId || !purpose) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requieren receptionId y purpose'
    )
  }

  if (purpose !== 'quote' && purpose !== 'report') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'purpose debe ser "quote" o "report"'
    )
  }

  const db = admin.firestore()
  const recepcionesRef = db.collection('recepciones')
  const snapshot = await recepcionesRef
    .where('numeroorden', '==', Number(receptionId))
    .limit(1)
    .get()

  if (snapshot.empty) {
    throw new functions.https.HttpsError(
      'not-found',
      `No se encontró recepción con numeroorden ${receptionId}`
    )
  }

  const doc = snapshot.docs[0]
  const key = crypto.randomUUID()
  const fieldName = `${purpose}_access_key`

  await doc.ref.update({
    [fieldName]: key,
  })

  const path = purpose === 'quote' ? 'cotizacion' : 'conformidad'
  const url = `${WEB_CLIENT_URL}/${path}?key=${key}`

  return { url }
})
