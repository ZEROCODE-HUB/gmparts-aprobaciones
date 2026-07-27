'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { AlertCircle, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react'
import { validateKey, approveReception } from '@/lib/api'
import type { RecepcionData } from '@/lib/types'

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'expired' }
  | { status: 'already-approved' }
      | { status: 'ready'; data: RecepcionData }
  | { status: 'approving' }
  | { status: 'approved' }

function RecepcionContent() {
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
      const res = await validateKey(key, 'reception')
      if (!res.valid) {
        setState({ status: 'expired' })
        return
      }
      if (!res.data) {
        setState({ status: 'error', message: 'No se encontraron datos para esta recepción.' })
        return
      }
      if (res.data.aprobacionCliente) {
        setState({ status: 'already-approved' })
        return
      }
      setState({ status: 'ready', data: res.data })
    } catch {
      setState({ status: 'error', message: 'Error de conexión. Verifica tu internet e intente de nuevo.' })
    }
  }

  useEffect(() => {
    fetchData()
  }, [key])

  const handleApprove = async () => {
    if (!key || state.status !== 'ready') return
    setState({ status: 'approving' })
    try {
      await approveReception(key)
      setState({ status: 'approved' })
    } catch {
      setState({ status: 'error', message: 'Error al confirmar la recepción. Intente de nuevo.' })
    }
  }

  const handleReject = async () => {
    window.location.href = `mailto:?subject=Inconformidad con recepción #${state.status === 'ready' ? state.data.numeroorden : ''}&body=Por favor contactarme para revisar los datos de mi recepción.`
  }

  if (state.status === 'approved') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-5">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-[#171717] font-bold text-xl mb-2">¡Recepción confirmada!</h1>
          <p className="text-[#262626] text-sm">
            Tus datos han sido confirmados. El taller procederá con el diagnóstico de tu vehículo.
          </p>
        </div>
      </div>
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
            Recepción #{state.status === 'ready' ? state.data.numeroorden : ''}
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
            <p className="text-gray-500 text-sm">Cargando recepción...</p>
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
            <h2 className="text-[#171717] font-bold text-lg mb-2">Recepción ya confirmada</h2>
            <p className="text-[#262626] text-sm">Esta recepción ya fue confirmada anteriormente.</p>
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
          <div className="space-y-4">
            <div className="bg-[#F7F7F7] rounded-[10px] p-5 space-y-3">
              <h2 className="font-semibold text-[#171717] text-sm uppercase tracking-wide">Datos del cliente</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#636363] text-sm">Nombre</span>
                  <span className="text-[#171717] text-sm font-medium">{state.data.nombreCliente}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-sm">Teléfono</span>
                  <span className="text-[#171717] text-sm font-medium">{state.data.telefono}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-sm">Email</span>
                  <span className="text-[#171717] text-sm font-medium">{state.data.correoElectronico}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F7F7F7] rounded-[10px] p-5 space-y-3">
              <h2 className="font-semibold text-[#171717] text-sm uppercase tracking-wide">Vehículo</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#636363] text-sm">Placa</span>
                  <span className="text-[#171717] text-sm font-medium">{state.data.placa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-sm">Marca</span>
                  <span className="text-[#171717] text-sm font-medium">{state.data.marca}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-sm">Modelo</span>
                  <span className="text-[#171717] text-sm font-medium">{state.data.modelo}</span>
                </div>
                {state.data.anio && (
                  <div className="flex justify-between">
                    <span className="text-[#636363] text-sm">Año</span>
                    <span className="text-[#171717] text-sm font-medium">{state.data.anio}</span>
                  </div>
                )}
                {state.data.nivelCombustible && (
                  <div className="flex justify-between">
                    <span className="text-[#636363] text-sm">Combustible</span>
                    <span className="text-[#171717] text-sm font-medium">{state.data.nivelCombustible}</span>
                  </div>
                )}
              </div>
            </div>

            {state.data.motivoIngreso && (
              <div className="bg-[#F7F7F7] rounded-[10px] p-5 space-y-3">
                <h2 className="font-semibold text-[#171717] text-sm uppercase tracking-wide">Motivo de ingreso</h2>
                <p className="text-[#171717] text-sm">{state.data.motivoIngreso}</p>
              </div>
            )}

            {state.data.inventario && state.data.inventario.length > 0 && (
              <div className="bg-[#F7F7F7] rounded-[10px] p-5 space-y-3">
                <h2 className="font-semibold text-[#171717] text-sm uppercase tracking-wide">Inventario del vehículo</h2>
                <div className="space-y-1">
                  {state.data.inventario.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-green-600 text-sm">✓</span>
                      <span className="text-[#171717] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-[#636363] text-xs pt-2">
              Verifica si los datos son correctos. Al confirmar, avanzarás automáticamente a la fase de diagnóstico.
            </p>

            <div className="flex flex-col gap-3 pb-8">
              <button
                onClick={handleApprove}
                className="w-full bg-[#FF1D25] text-white text-sm font-semibold rounded-[8px] shadow-[0_6px_20px_rgba(255,29,37,0.35)] hover:shadow-[0_8px_25px_rgba(255,29,37,0.45)] hover:bg-[#E61920] active:scale-[0.98] transition-all"
                style={{ height: '44px' }}
              >
                Conforme
              </button>
              <button
                onClick={handleReject}
                className="w-full bg-white text-[#FF1D25] border-2 border-[#FF1D25] text-sm font-semibold rounded-[8px] hover:bg-red-50 active:scale-[0.98] transition-all"
                style={{ height: '44px' }}
              >
                No conforme
              </button>
            </div>
          </div>
        )}

        {state.status === 'approving' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF1D25] animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Confirmando recepción...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RecepcionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF1D25] animate-spin" />
      </div>
    }>
      <RecepcionContent />
    </Suspense>
  )
}
