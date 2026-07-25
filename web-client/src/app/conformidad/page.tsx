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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <SuccessScreen
          title="¡Gracias por tu conformidad!"
          message="Tu conformidad ha sido registrada exitosamente. Agradecemos tu preferencia y esperamos verte pronto."
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
        <h1 className="text-white text-xl font-bold">Conformidad de servicio</h1>
        <p className="text-gmp-text-secondary text-sm">Revisa el trabajo realizado y danos tu opinión</p>
      </div>

      {state.status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gmp-primary animate-spin mb-4" />
          <p className="text-gmp-text-secondary text-sm">Cargando informe...</p>
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
          <ReportSummary data={state.data} />
          <SatisfactionSurvey value={survey} onChange={setSurvey} />

          {submitError && (
            <div className="bg-gmp-primary/10 border border-gmp-primary/30 rounded-lg p-3 mt-4">
              <p className="text-gmp-primary text-sm">{submitError}</p>
            </div>
          )}

          <div className="mt-8 mb-12">
            <button
              onClick={handleSubmit}
              className="w-full bg-gmp-primary text-white py-3.5 rounded-xl font-bold text-base hover:bg-gmp-primary/90 transition-colors active:scale-[0.98]"
            >
              Enviar conformidad
            </button>
            <p className="text-gmp-text-secondary text-xs text-center mt-2">
              Al enviar, confirmas que el servicio fue realizado a tu satisfacción.
            </p>
          </div>
        </>
      )}

      {state.status === 'submitting' && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gmp-primary animate-spin mb-4" />
          <p className="text-gmp-text-secondary text-sm">Enviando conformidad...</p>
        </div>
      )}
    </div>
  )
}

export default function ConformidadPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gmp-primary animate-spin mb-4" />
        <p className="text-gmp-text-secondary text-sm">Cargando...</p>
      </div>
    }>
      <ConformidadContent />
    </Suspense>
  )
}
