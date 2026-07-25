'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react'
import { validateKey, approveReport } from '@/lib/api'
import ReportSummary from '@/components/ReportSummary'
import SatisfactionSurvey from '@/components/SatisfactionSurvey'
import SuccessScreen from '@/components/SuccessScreen'
import type { RecepcionData, SurveyData } from '@/lib/types'

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'expired' }
  | { status: 'ready'; data: RecepcionData }
  | { status: 'submitting' }
  | { status: 'success' }

const DEFAULT_SURVEY: SurveyData = {
  rating1: '',
  rating2: '',
  rating3: '',
  comment: '',
}

function ConformidadContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')
  const [state, setState] = useState<PageState>({ status: 'loading' })
  const [survey, setSurvey] = useState<SurveyData>(DEFAULT_SURVEY)
  const [submitError, setSubmitError] = useState('')

  const fetchData = async () => {
    if (!key) {
      setState({ status: 'error', message: 'No se proporcionó un enlace válido.' })
      return
    }
    setState({ status: 'loading' })
    try {
      const res = await validateKey(key, 'report')
      if (!res.valid) {
        setState({ status: 'expired' })
        return
      }
      if (!res.data) {
        setState({ status: 'error', message: 'No se encontraron datos para este informe.' })
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

  const handleSubmit = async () => {
    if (!key || state.status !== 'ready') return
    if (!survey.rating1 || !survey.rating2 || !survey.rating3) {
      setSubmitError('Por favor califica todas las preguntas antes de enviar.')
      return
    }
    setSubmitError('')
    setState({ status: 'submitting' })
    try {
      await approveReport(key, survey)
      setState({ status: 'success' })
    } catch {
      setSubmitError('Error al enviar la conformidad. Intenta de nuevo.')
      setState({ status: 'ready', data: state.data })
    }
  }

  if (state.status === 'success') {
    return (
      <SuccessScreen
        title="¡Gracias por tu conformidad!"
        message="Tu conformidad ha sido registrada exitosamente. Agradecemos tu preferencia y esperamos verte pronto."
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#171717]">
      <div className="max-w-lg mx-auto px-5 py-6">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="GM Parts"
            className="w-36 h-auto"
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-white font-bold text-xl">Conformidad de servicio</h1>
          <p className="text-white/70 text-sm mt-1">Revisa el trabajo realizado y danos tu opinión</p>
        </div>

        {state.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF1D25] animate-spin mb-4" />
            <p className="text-white/70 text-sm">Cargando informe...</p>
          </div>
        )}

        {state.status === 'expired' && (
          <div className="bg-[#262626] rounded-[10px] p-6 text-center border border-gray-700">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h2 className="text-white font-bold text-lg mb-2">Enlace no válido</h2>
            <p className="text-white/70 text-sm">Este enlace ya fue utilizado o no es válido. Si crees que es un error, contacta al taller.</p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="bg-[#262626] rounded-[10px] p-6 text-center border border-gray-700">
            <AlertCircle className="w-12 h-12 text-[#FF1D25] mx-auto mb-3" />
            <h2 className="text-white font-bold text-lg mb-2">Error</h2>
            <p className="text-white/70 text-sm mb-4">{state.message}</p>
            <button onClick={fetchData} className="inline-flex items-center gap-2 bg-[#FF1D25] text-white px-6 py-2.5 rounded-[8px] font-medium text-sm hover:bg-[#E61920] transition-colors shadow-md">
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <ReportSummary data={state.data} />
            <div className="mt-5">
              <SatisfactionSurvey value={survey} onChange={setSurvey} />
            </div>

            {submitError && (
              <div className="bg-[#FF1D25]/10 border border-[#FF1D25]/30 rounded-[8px] p-3 mt-4">
                <p className="text-[#FF1D25] text-sm">{submitError}</p>
              </div>
            )}

            <div className="mt-8 mb-12">
              <button
                onClick={handleSubmit}
                className="w-full bg-[#FF1D25] text-white text-sm font-semibold rounded-[8px] shadow-[0_6px_20px_rgba(255,29,37,0.35)] hover:shadow-[0_8px_25px_rgba(255,29,37,0.45)] hover:bg-[#E61920] active:scale-[0.98] transition-all"
                style={{ height: '44px' }}
              >
                Enviar conformidad
              </button>
            </div>
          </>
        )}

        {state.status === 'submitting' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF1D25] animate-spin mb-4" />
            <p className="text-white/70 text-sm">Enviando conformidad...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ConformidadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#171717] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF1D25] animate-spin" />
      </div>
    }>
      <ConformidadContent />
    </Suspense>
  )
}
