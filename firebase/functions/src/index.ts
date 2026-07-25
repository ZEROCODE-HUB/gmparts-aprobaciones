import * as admin from 'firebase-admin'

admin.initializeApp()

export { generateLink } from './generateLink'
export { validateKey } from './validateKey'
export { approveQuote } from './approveQuote'
export { approveReport } from './approveReport'
export { sendEmail } from './sendEmail'
