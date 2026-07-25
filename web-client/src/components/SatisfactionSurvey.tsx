'use client'

import type { SurveyData } from '@/lib/types'

interface SatisfactionSurveyProps {
  value: SurveyData
  onChange: (survey: SurveyData) => void
}

const QUESTIONS = [
  {
    id: 'rating1' as const,
    text: '¿Cómo calificarías tu experiencia general?',
  },
  {
    id: 'rating2' as const,
    text: '¿Cómo evalúas la facilidad de uso de la aplicación?',
  },
  {
    id: 'rating3' as const,
    text: '¿Las notificaciones fueron útiles y oportunas?',
  },
]

function RatingGroup({
  question,
  value,
  onChange,
}: {
  question: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="text-white text-sm mb-3">{question}</p>
      <div className="flex gap-3 items-center justify-center">
        {[1, 2, 3, 4, 5].map((num) => (
          <label key={num} className="flex flex-col items-center gap-1 cursor-pointer group">
            <input
              type="radio"
              name={question}
              value={num}
              checked={value === num.toString()}
              onChange={() => onChange(num.toString())}
              className="peer sr-only"
            />
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-200 border-2
                ${value === num.toString()
                  ? 'bg-gmp-primary border-gmp-primary text-white scale-110'
                  : 'bg-transparent border-gmp-text-secondary text-gmp-text-secondary hover:border-gmp-primary hover:text-gmp-primary'
                }
              `}
            >
              {num}
            </div>
            <span className="text-[10px] text-gmp-text-secondary">
              {num === 1 ? 'Malo' : num === 2 ? 'Regular' : num === 3 ? 'Bueno' : num === 4 ? 'Muy bueno' : 'Excelente'}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function SatisfactionSurvey({ value, onChange }: SatisfactionSurveyProps) {
  const handleRatingChange = (id: keyof SurveyData, val: string) => {
    onChange({ ...value, [id]: val })
  }

  return (
    <div className="bg-gmp-dark-secondary rounded-xl p-5 border border-gmp-border space-y-6">
      <h2 className="text-white font-semibold text-lg">Encuesta de satisfacción</h2>
      <p className="text-gmp-text-secondary text-sm">
        Ayúdanos a mejorar calificando nuestro servicio
      </p>

      <div className="space-y-6">
        {QUESTIONS.map((q) => (
          <RatingGroup
            key={q.id}
            question={q.text}
            value={value[q.id]}
            onChange={(v) => handleRatingChange(q.id, v)}
          />
        ))}
      </div>

      <div>
        <label className="block text-white text-sm mb-2">
          Comentario adicional <span className="text-gmp-text-secondary">(opcional)</span>
        </label>
        <textarea
          value={value.comment}
          onChange={(e) => onChange({ ...value, comment: e.target.value })}
          placeholder="Escribe aquí tus comentarios..."
          rows={4}
          className="w-full bg-gmp-dark border border-gmp-border rounded-lg p-3 text-white text-sm placeholder:text-gmp-text-secondary focus:outline-none focus:border-gmp-primary transition-colors"
        />
      </div>
    </div>
  )
}
