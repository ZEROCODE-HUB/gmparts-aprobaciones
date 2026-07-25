'use client'

import type { RecepcionData } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface QuoteSummaryProps {
  data: RecepcionData
}

export default function QuoteSummary({ data }: QuoteSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gmp-dark-secondary rounded-xl p-5 border border-gmp-border">
        <h3 className="text-gmp-text-secondary text-xs uppercase tracking-wider mb-3">
          Datos del cliente
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gmp-text-secondary text-xs">Nombre</p>
            <p className="text-white font-medium">{data.nombreCliente}</p>
          </div>
          <div>
            <p className="text-gmp-text-secondary text-xs">Teléfono</p>
            <p className="text-white font-medium">{data.telefono}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gmp-text-secondary text-xs">Correo</p>
            <p className="text-white font-medium">{data.correoElectronico}</p>
          </div>
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
        <h2 className="text-white font-semibold text-lg">Diagnósticos</h2>

        {data.diagnosticos.map((diag, idx) => (
          <div key={idx} className="bg-gmp-dark-secondary rounded-xl p-5 border border-gmp-border space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold">{diag.nombreFalla}</h3>
                <p className="text-gmp-text-secondary text-sm mt-1">{diag.solucion}</p>
              </div>
              <span className="text-gmp-text-secondary text-xs bg-gmp-card px-2 py-1 rounded ml-2 whitespace-nowrap">
                #{idx + 1}
              </span>
            </div>

            {diag.fotos && diag.fotos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {diag.fotos.map((foto, fidx) => (
                  <img
                    key={fidx}
                    src={foto}
                    alt={`Foto diagnóstico ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-gmp-border flex-shrink-0"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            {diag.repuestos && diag.repuestos.length > 0 && (
              <div>
                <h4 className="text-gmp-text-secondary text-xs uppercase tracking-wider mb-2">
                  Repuestos
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gmp-border">
                        <th className="text-left text-gmp-text-secondary py-2 pr-2 font-medium">Descripción</th>
                        <th className="text-right text-gmp-text-secondary py-2 px-2 font-medium">Cant.</th>
                        <th className="text-right text-gmp-text-secondary py-2 px-2 font-medium">Precio</th>
                        <th className="text-right text-gmp-text-secondary py-2 pl-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diag.repuestos.map((rep, ridx) => (
                        <tr key={ridx} className="border-b border-gmp-border/50">
                          <td className="text-white py-2 pr-2">{rep.nombre}</td>
                          <td className="text-white text-right py-2 px-2">{rep.cantidad}</td>
                          <td className="text-white text-right py-2 px-2">{formatCurrency(rep.precio)}</td>
                          <td className="text-white text-right py-2 pl-2 font-medium">{formatCurrency(rep.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {diag.manoDeObra > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-gmp-border">
                <span className="text-gmp-text-secondary text-sm">Mano de obra</span>
                <span className="text-white font-medium">{formatCurrency(diag.manoDeObra)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gmp-dark-secondary rounded-xl p-5 border border-gmp-border space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gmp-text-secondary">Subtotal</span>
          <span className="text-white">{formatCurrency(data.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gmp-text-secondary">IGV (18%)</span>
          <span className="text-white">{formatCurrency(data.igv)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gmp-border">
          <span className="text-white">Total</span>
          <span className="text-gmp-primary">{formatCurrency(data.total)}</span>
        </div>
      </div>

      {data.fechaIngreso && (
        <div className="text-center text-gmp-text-secondary text-xs">
          Fecha de ingreso: {formatDate(data.fechaIngreso)}
        </div>
      )}
    </div>
  )
}
