'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { AlertCircle, RefreshCw, Loader2, ThumbsUp } from 'lucide-react'
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
    } catch (err) {
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <SuccessScreen
          title="¡Cotización aprobada!"
          message="Tu cotización ha sido aprobada exitosamente. El taller recibirá la notificación y procederá con el servicio."
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-gmp-primary rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-2">
          G
        </div>
        <h1 className="text-white text-xl font-bold">Cotización</h1>
        <p className="text-gmp-text-secondary text-sm">Revisa los detalles de tu cotización</p>
      </div>

      {state.status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gmp-primary animate-spin mb-4" />
          <p className="text-gmp-text-secondary text-sm">Cargando cotización...</p>
        </div>
      )}

      {state.status === 'expired' && (
        <div className="bg-gmp-dark-secondary rounded-xl p-8 border border-gmp-border text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Enlace no válido</h2>
          <p className="text-gmp-text-secondary text-sm">
            Este enlace ya fue utilizado o no es válido. Si crees que es un error, contacta al taller.
          </p>
        </div>
      )}

      {state.status === 'already-approved' && (
        <div className="bg-gmp-dark-secondary rounded-xl p-8 border border-gmp-border text-center">
          <ThumbsUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Cotización ya aprobada</h2>
          <p className="text-gmp-text-secondary text-sm">
            Esta cotización ya fue aprobada anteriormente. No es necesario volver a aprobarla.
          </p>
        </div>
      )}

      {state.status === 'error' && (
        <div className="bg-gmp-dark-secondary rounded-xl p-8 border border-gmp-border text-center">
          <AlertCircle className="w-12 h-12 text-gmp-primary mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Error</h2>
          <p className="text-gmp-text-secondary text-sm mb-4">{state.message}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 bg-gmp-primary text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gmp-primary/90 transition-colors"
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
              className="w-full bg-gmp-primary text-white py-3.5 rounded-xl font-bold text-base hover:bg-gmp-primary/90 transition-colors active:scale-[0.98]"
            >
              Aprobar cotización
            </button>
            <p className="text-gmp-text-secondary text-xs text-center mt-2">
              Al aprobar, aceptas los términos y condiciones del servicio.
            </p>
          </div>
        </>
      )}

      {state.status === 'approving' && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gmp-primary animate-spin mb-4" />
          <p className="text-gmp-text-secondary text-sm">Aprobando cotización...</p>
        </div>
      )}
    </div>
  )
}

export default function CotizacionPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gmp-primary animate-spin mb-4" />
        <p className="text-gmp-text-secondary text-sm">Cargando...</p>
      </div>
    }>
      <CotizacionContent />
    </Suspense>
  )
}
