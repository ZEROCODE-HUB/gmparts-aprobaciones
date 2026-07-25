'use client'

import type { RecepcionData } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ReportSummaryProps {
  data: RecepcionData
}

export default function ReportSummary({ data }: ReportSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gmp-dark-secondary rounded-xl p-5 border border-gmp-border">
        <h3 className="text-gmp-text-secondary text-xs uppercase tracking-wider mb-3">
          Información del servicio
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gmp-text-secondary text-xs">N° de orden</p>
            <p className="text-white font-medium">#{data.numeroorden}</p>
          </div>
          <div>
            <p className="text-gmp-text-secondary text-xs">Estado</p>
            <span className="inline-block bg-gmp-card text-gmp-primary text-xs font-medium px-2 py-0.5 rounded">
              {data.status}
            </span>
          </div>
          {data.fechaIngreso && (
            <div>
              <p className="text-gmp-text-secondary text-xs">Fecha ingreso</p>
              <p className="text-white font-medium">{formatDate(data.fechaIngreso)}</p>
            </div>
          )}
          {data.fechaSalida && (
            <div>
              <p className="text-gmp-text-secondary text-xs">Fecha finalización</p>
              <p className="text-white font-medium">{formatDate(data.fechaSalida)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gmp-dark-secondary rounded-xl p-5 border border-gmp-border">
        <h3 className="text-gmp-text-secondary text-xs uppercase tracking-wider mb-3">
          Datos del vehículo
        </h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-gmp-text-secondary text-xs">Placa</p>
            <p className="text-white font-medium uppercase">{data.placa}</p>
          </div>
          <div>
            <p className="text-gmp-text-secondary text-xs">Marca</p>
            <p className="text-white font-medium">{data.marca}</p>
          </div>
          <div>
            <p className="text-gmp-text-secondary text-xs">Modelo</p>
            <p className="text-white font-medium">{data.modelo}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-white font-semibold text-lg">Trabajo realizado</h2>

        {data.diagnosticos.map((diag, idx) => (
          <div key={idx} className="bg-gmp-dark-secondary rounded-xl p-5 border border-gmp-border space-y-4">
            <div>
              <h3 className="text-white font-semibold">{diag.nombreFalla}</h3>
              <p className="text-gmp-text-secondary text-sm mt-1">{diag.solucion}</p>
            </div>

            {diag.fotos && diag.fotos.length > 0 && (
              <div>
                <h4 className="text-gmp-text-secondary text-xs uppercase tracking-wider mb-2">
                  Imágenes de finalización
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {diag.fotos.map((foto, fidx) => (
                    <img
                      key={fidx}
                      src={foto}
                      alt={`Imagen finalización ${idx + 1}-${fidx + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border border-gmp-border"
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
