import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <div className="min-h-screen bg-gmp-dark flex flex-col">
          <header className="bg-gmp-dark-secondary border-b border-gmp-border px-4 py-3">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <div className="w-10 h-10 bg-gmp-primary rounded-lg flex items-center justify-center font-bold text-lg">
                G
              </div>
              <div>
                <h1 className="text-white font-bold text-sm leading-tight">GM Parts</h1>
                <p className="text-gmp-text-secondary text-xs">Taller Mecánico</p>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="bg-gmp-dark-secondary border-t border-gmp-border px-4 py-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gmp-text-secondary text-xs">
                © {new Date().getFullYear()} GM Parts. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
