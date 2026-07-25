'use client'

import { CheckCircle } from 'lucide-react'

interface SuccessScreenProps {
  title: string
  message: string
}

export default function SuccessScreen({ title, message }: SuccessScreenProps) {
  return (
    <div className="max-w-md mx-auto text-center py-12 px-4">
      <div className="bg-gmp-dark-secondary rounded-2xl p-8 border border-gmp-border">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <div className="w-12 h-12 bg-gmp-primary rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4">
          G
        </div>

        <h2 className="text-white text-xl font-bold mb-2">{title}</h2>
        <p className="text-gmp-text-secondary text-sm mb-6">{message}</p>

        <div className="bg-gmp-card rounded-lg p-3 inline-block">
          <p className="text-gmp-text-secondary text-xs">GM Parts - Taller Mecánico</p>
        </div>
      </div>
    </div>
  )
}
