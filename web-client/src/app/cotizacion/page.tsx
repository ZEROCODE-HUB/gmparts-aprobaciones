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
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-5 py-6">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="GM Parts"
            className="w-36 h-auto"
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[#171717] font-bold text-xl">
            Servicio #{state.status === 'ready' ? state.data.numeroorden : ''}
          </h1>
          {state.status === 'ready' && (
            <span className="bg-[#FF1D25] text-white text-[10px] font-semibold px-4 py-1.5 rounded shadow-md">
              {state.data.status}
            </span>
          )}
        </div>

        {state.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF1D25] animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Cargando cotización...</p>
          </div>
        )}

        {state.status === 'expired' && (
          <div className="bg-[#F7F7F7] rounded-[10px] p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h2 className="text-[#171717] font-bold text-lg mb-2">Enlace no válido</h2>
            <p className="text-[#262626] text-sm">Este enlace ya fue utilizado o no es válido. Si crees que es un error, contacta al taller.</p>
          </div>
        )}

        {state.status === 'already-approved' && (
          <div className="bg-[#F7F7F7] rounded-[10px] p-6 text-center">
            <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-[#171717] font-bold text-lg mb-2">Cotización ya aprobada</h2>
            <p className="text-[#262626] text-sm">Esta cotización ya fue aprobada anteriormente.</p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="bg-[#F7F7F7] rounded-[10px] p-6 text-center">
            <AlertCircle className="w-12 h-12 text-[#FF1D25] mx-auto mb-3" />
            <h2 className="text-[#171717] font-bold text-lg mb-2">Error</h2>
            <p className="text-[#262626] text-sm mb-4">{state.message}</p>
            <button onClick={fetchData} className="inline-flex items-center gap-2 bg-[#FF1D25] text-white px-6 py-2.5 rounded-[8px] font-medium text-sm hover:bg-[#E61920] transition-colors shadow-md">
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <QuoteSummary data={state.data} />
            <div className="mt-8 mb-12">
              <button
                onClick={handleApprove}
                className="w-full bg-[#FF1D25] text-white text-sm font-semibold rounded-[8px] shadow-[0_6px_20px_rgba(255,29,37,0.35)] hover:shadow-[0_8px_25px_rgba(255,29,37,0.45)] hover:bg-[#E61920] active:scale-[0.98] transition-all"
                style={{ height: '44px' }}
              >
                Aprobar cotización
              </button>
            </div>
          </>
        )}

        {state.status === 'approving' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF1D25] animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Aprobando cotización...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CotizacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF1D25] animate-spin" />
      </div>
    }>
      <CotizacionContent />
    </Suspense>
  )
}
