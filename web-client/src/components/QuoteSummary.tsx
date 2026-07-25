'use client'

import type { RecepcionData } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface QuoteSummaryProps {
  data: RecepcionData
}

export default function QuoteSummary({ data }: QuoteSummaryProps) {
  return (
    <div className="space-y-5">
      <div className="bg-gmp-white-bg border border-gray-100 rounded-gmp p-4 shadow-sm">
        <h3 className="text-gmp-text font-semibold text-base mb-3">Datos del cliente</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gmp-accent2 text-xs font-medium">Cliente:</span>
            <span className="text-gmp-text text-sm font-bold">{data.nombreCliente}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gmp-accent2 text-xs font-medium">Celular:</span>
            <span className="text-gmp-text text-sm font-bold">{data.telefono}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gmp-accent2 text-xs font-medium">Correo electrónico:</span>
            <span className="text-gmp-text text-sm font-bold">{data.correoElectronico}</span>
          </div>
        </div>
      </div>

      <div className="bg-gmp-white-bg border border-gray-100 rounded-gmp p-4 shadow-sm">
        <h3 className="text-gmp-text font-semibold text-base mb-3">Datos del vehículo</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gmp-accent2 text-xs font-medium">Placa:</span>
            <span className="text-gmp-text text-sm font-bold uppercase">{data.placa}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gmp-accent2 text-xs font-medium">Marca:</span>
            <span className="text-gmp-text text-sm font-bold">{data.marca}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gmp-accent2 text-xs font-medium">Modelo:</span>
            <span className="text-gmp-text text-sm font-bold">{data.modelo}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.diagnosticos.map((diag, idx) => (
          <div key={idx} className="bg-gmp-card border border-gray-100 rounded-gmp p-4 shadow-sm">
            <h3 className="text-gmp-text font-semibold text-lg mb-4">
              Nueva Falla #{idx + 1}
            </h3>

            <div className="mb-4">
              <p className="text-gmp-accent2 text-xs font-medium mb-1">Nombre de falla</p>
              <p className="text-gmp-text text-sm">{diag.nombreFalla}</p>
            </div>

            <div className="mb-4">
              <p className="text-gmp-accent2 text-xs font-medium mb-1">Solución</p>
              <p className="text-gmp-text text-sm">{diag.solucion}</p>
            </div>

            {diag.fotos && diag.fotos.length > 0 && (
              <div className="mb-4">
                <p className="text-gmp-accent2 text-xs font-medium mb-2">Fotos</p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {diag.fotos.map((foto, fidx) => (
                    <img
                      key={fidx}
                      src={foto}
                      alt={`Foto ${idx + 1}-${fidx + 1}`}
                      className="w-24 h-24 object-cover rounded-gmp-sm flex-shrink-0"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}

            {diag.repuestos && diag.repuestos.length > 0 && (
              <div className="mb-4">
                <p className="text-gmp-accent2 text-xs font-medium mb-2">Repuestos</p>
                <div className="space-y-2">
                  {diag.repuestos.map((rep, ridx) => (
                    <div key={ridx} className="bg-gmp-card-alt rounded-gmp-sm p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gmp-text text-sm font-medium">{rep.nombre}</span>
                        <span className="text-gmp-accent2 text-xs">Cant: {rep.cantidad}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gmp-text text-sm">Precio: {formatCurrency(rep.precio)}</span>
                        <span className="text-gmp-text text-sm font-semibold">Total: {formatCurrency(rep.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diag.manoDeObra > 0 && (
              <div className="bg-gmp-card-alt rounded-gmp p-3 flex justify-between items-center">
                <span className="text-gmp-text text-sm">Mano de obra</span>
                <span className="text-gmp-text text-sm font-semibold">{formatCurrency(diag.manoDeObra)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gmp-white-bg border border-gray-100 rounded-gmp p-4 shadow-sm">
        <div className="flex justify-between items-center py-1">
          <span className="text-gmp-text font-semibold">Subtotal</span>
          <span className="text-gmp-text font-semibold">{formatCurrency(data.subtotal)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-gmp-text font-semibold">IGV</span>
          <span className="text-gmp-text font-semibold">{formatCurrency(data.igv)}</span>
        </div>
        <div className="border-t border-gmp-accent4 my-2 pt-2 flex justify-between items-center">
          <span className="text-gmp-text font-bold text-lg">Total</span>
          <span className="text-gmp-primary font-bold text-lg">{formatCurrency(data.total)}</span>
        </div>
      </div>
    </div>
  )
}
