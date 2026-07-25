import * as functions from 'firebase-functions/v1'
import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'notificaciones@gmparts.pe'

interface SendEmailData {
  to: string
  subject: string
  body: string
  url: string
}

function buildEmailHtml({ subject, body, url }: Omit<SendEmailData, 'to'>): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #1A1A2E;
      font-family: 'Inter', Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background-color: #E94560;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: bold;
      color: #FFFFFF;
    }
    .title {
      color: #FFFFFF;
      font-size: 22px;
      font-weight: bold;
      margin: 16px 0 8px;
    }
    .body-text {
      color: #A0A0B0;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background-color: #E94560;
      color: #FFFFFF;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
    }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #2A2A4A;
      text-align: center;
      color: #A0A0B0;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">G</div>
      <h1 class="title">${subject}</h1>
    </div>
    <p class="body-text">${body}</p>
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${url}" class="button">Ir a GM Parts</a>
    </div>
    <div class="footer">
      <p>GM Parts - Taller Mecánico</p>
      <p>Si tienes problemas con el botón, copia y pega este enlace en tu navegador:</p>
      <p style="word-break: break-all; color: #E94560; font-size: 12px;">${url}</p>
    </div>
  </div>
</body>
</html>`
}

export const sendEmail = functions.https.onCall(async (data: SendEmailData) => {
  const { to, subject, body, url } = data

  if (!to || !subject || !url) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requieren to, subject y url'
    )
  }

  if (!RESEND_API_KEY) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'RESEND_API_KEY no está configurada'
    )
  }

  const resend = new Resend(RESEND_API_KEY)

  const html = buildEmailHtml({ subject, body, url })

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    throw new functions.https.HttpsError(
      'internal',
      'Error al enviar el email'
    )
  }
})
