import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'

export const approveReport = functions.https.onCall(async (data) => {
  const { key, survey } = data

  if (!key || !survey) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requieren key y survey'
    )
  }

  const { rating1, rating2, rating3, comment } = survey

  if (!rating1 || !rating2 || !rating3) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Los ratings 1, 2 y 3 son obligatorios'
    )
  }

  const db = admin.firestore()
  const snapshot = await db
    .collection('recepciones')
    .where('report_access_key', '==', key)
    .limit(1)
    .get()

  if (snapshot.empty) {
    throw new functions.https.HttpsError(
      'not-found',
      'No se encontró informe con esta clave'
    )
  }

  const doc = snapshot.docs[0]

  await doc.ref.update({
    clientecontrolcalidad1: rating1.toString(),
    clientecontrolcalidad2: rating2.toString(),
    clientecontrolcalidad3: rating3.toString(),
    clientecontrolcalidad4: comment || '',
    status: 'Finalizado',
    report_access_key: admin.firestore.FieldValue.delete(),
  })

  return { success: true }
})
