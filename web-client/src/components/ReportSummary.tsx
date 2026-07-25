'use client'

import type { RecepcionData } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ReportSummaryProps {
  data: RecepcionData
}

export default function ReportSummary({ data }: ReportSummaryProps) {
  return (
    <div className="space-y-5">
      <div className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
        <h3 className="text-white font-semibold text-base mb-3">Información del servicio</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70 text-xs font-medium">N° de orden:</span>
            <span className="text-white text-sm font-bold">#{data.numeroorden}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs font-medium">Estado:</span>
            <span className="text-gmp-primary text-sm font-bold">{data.status}</span>
          </div>
          {data.fechaIngreso && (
            <div className="flex justify-between">
              <span className="text-white/70 text-xs font-medium">Fecha ingreso:</span>
              <span className="text-white text-sm font-bold">{formatDate(data.fechaIngreso)}</span>
            </div>
          )}
          {data.fechaSalida && (
            <div className="flex justify-between">
              <span className="text-white/70 text-xs font-medium">Fecha finalización:</span>
              <span className="text-white text-sm font-bold">{formatDate(data.fechaSalida)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
        <h3 className="text-white font-semibold text-base mb-3">Datos del vehículo</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70 text-xs font-medium">Placa:</span>
            <span className="text-white text-sm font-bold uppercase">{data.placa}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs font-medium">Marca:</span>
            <span className="text-white text-sm font-bold">{data.marca}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs font-medium">Modelo:</span>
            <span className="text-white text-sm font-bold">{data.modelo}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-white font-semibold text-lg">Trabajo realizado</h2>

        {data.diagnosticos.map((diag, idx) => (
          <div key={idx} className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
            <h3 className="text-white font-semibold mb-2">{diag.nombreFalla}</h3>
            <p className="text-white/70 text-sm mb-4">{diag.solucion}</p>

            {diag.fotos && diag.fotos.length > 0 && (
              <div>
                <p className="text-white/70 text-xs font-medium mb-2">Imágenes de finalización</p>
                <div className="grid grid-cols-3 gap-2">
                  {diag.fotos.map((foto, fidx) => (
                    <img
                      key={fidx}
                      src={foto}
                      alt={`Imagen ${idx + 1}-${fidx + 1}`}
                      className="w-full aspect-square object-cover rounded-gmp-sm border border-gray-600"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
