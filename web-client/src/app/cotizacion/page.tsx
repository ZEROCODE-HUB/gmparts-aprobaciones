'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react'
import { validateKey, approveQuote } from '@/lib/api'
import QuoteSummary from '@/components/QuoteSummary'
import SuccessScreen from '@/components/SuccessScreen'
import type { RecepcionData } from '@/lib/types'

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'expired' }
  | { status: 'already-approved' }
  | { status: 'ready'; data: RecepcionData }
  | { status: 'approving' }
  | { status: 'approved' }

function CotizacionContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')
  const [state, setState] = useState<PageState>({ status: 'loading' })

  const fetchData = async () => {
    if (!key) {
      setState({ status: 'error', message: 'No se proporcionó un enlace válido.' })
      return
    }
    setState({ status: 'loading' })
    try {
      const res = await validateKey(key, 'quote')
      if (!res.valid) {
        setState({ status: 'expired' })
        return
      }
      if (!res.data) {
        setState({ status: 'error', message: 'No se encontraron datos para esta cotización.' })
        return
      }
      if (res.data.aprobacionCotizacion) {
        setState({ status: 'already-approved' })
        return
      }
      setState({ status: 'ready', data: res.data })
    } catch {
      setState({ status: 'error', message: 'Error de conexión. Verifica tu internet e intenta de nuevo.' })
    }
  }

  useEffect(() => {
    fetchData()
  }, [key])

  const handleApprove = async () => {
    if (!key || state.status !== 'ready') return
    setState({ status: 'approving' })
    try {
      await approveQuote(key)
      setState({ status: 'approved' })
    } catch {
      setState({ status: 'error', message: 'Error al aprobar la cotización. Intenta de nuevo.' })
    }
  }

  if (state.status === 'approved') {
    return (
      <SuccessScreen
        title="¡Cotización aprobada!"
        message="Tu cotización ha sido aprobada exitosamente. El taller recibirá la notificación y procederá con el servicio."
      />
    )
  }

  return (
    <div className="min-h-screen bg-gmp-white-bg">
      <div className="max-w-2xl mx-auto px-5 py-6">
        <div className="flex items-center justify-center mb-6">
          <img
            src="/logo.png"
            alt="GM Parts"
            className="w-36 h-auto rounded-gmp-sm"
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gmp-text font-bold text-xl">Servicio #{state.status === 'ready' ? state.data.numeroorden : ''}</h1>
          <span className="bg-gmp-primary text-white text-[10px] font-semibold px-3 py-1 rounded-gmp-tag shadow-md">
            Cotización
          </span>
        </div>

        {state.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gmp-primary animate-spin mb-4" />
            <p className="text-gmp-accent2 text-sm">Cargando cotización...</p>
          </div>
        )}

        {state.status === 'expired' && (
          <div className="bg-gmp-card rounded-gmp p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h2 className="text-gmp-text font-bold text-lg mb-2">Enlace no válido</h2>
            <p className="text-gmp-accent2 text-sm">
              Este enlace ya fue utilizado o no es válido. Si crees que es un error, contacta al taller.
            </p>
          </div>
        )}

        {state.status === 'already-approved' && (
          <div className="bg-gmp-card rounded-gmp p-6 text-center">
            <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-gmp-text font-bold text-lg mb-2">Cotización ya aprobada</h2>
            <p className="text-gmp-accent2 text-sm">
              Esta cotización ya fue aprobada anteriormente. No es necesario volver a aprobarla.
            </p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="bg-gmp-card rounded-gmp p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gmp-primary mx-auto mb-3" />
            <h2 className="text-gmp-text font-bold text-lg mb-2">Error</h2>
            <p className="text-gmp-accent2 text-sm mb-4">{state.message}</p>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 bg-gmp-primary text-white px-6 py-2.5 rounded-gmp-sm font-medium text-sm hover:bg-gmp-primary-hover transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <QuoteSummary data={state.data} />

            <div className="mt-8 mb-12">
              <button
                onClick={handleApprove}
                className="w-full bg-gmp-primary text-white py-2.5 rounded-gmp-sm font-semibold text-sm shadow-md hover:bg-gmp-primary-hover transition-colors active:scale-[0.98]"
                style={{ height: '40px' }}
              >
                Aprobar cotización
              </button>
            </div>
          </>
        )}

        {state.status === 'approving' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gmp-primary animate-spin mb-4" />
            <p className="text-gmp-accent2 text-sm">Aprobando cotización...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CotizacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gmp-white-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gmp-primary animate-spin" />
      </div>
    }>
      <CotizacionContent />
    </Suspense>
  )
}
