'use client'

import { useEffect } from 'react'

interface SuccessScreenProps {
  title: string
  message: string
}

export default function SuccessScreen({ title, message }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gmp-dark-secondary flex flex-col items-center justify-center px-5">
      <img
        src="/logo.png"
        alt="GM Parts"
        className="w-48 h-auto mb-8 rounded-gmp-sm"
      />
      <h2 className="text-white text-xl font-semibold text-center mb-3">{title}</h2>
      <p className="text-gmp-text-secondary text-sm text-center leading-relaxed max-w-sm">
        {message}
      </p>
    </div>
  )
}
