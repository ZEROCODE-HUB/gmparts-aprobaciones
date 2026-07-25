import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GM Parts - Taller Mecánico',
  description: 'Aprobación de cotizaciones y conformidad de servicio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
