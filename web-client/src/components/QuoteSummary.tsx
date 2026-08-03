'use client'

import type { RecepcionData } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface QuoteSummaryProps {
  data: RecepcionData
}

export default function QuoteSummary({ data }: QuoteSummaryProps) {
  return (
    <div className="space-y-5">
      <div className="bg-[#F7F7F7] rounded-[10px] p-4">
        <h3 className="text-[#171717] font-semibold text-base mb-3">Datos del cliente</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[#262626] text-xs font-medium">Cliente:</span>
            <span className="text-[#171717] text-sm font-bold">{data.nombreCliente}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#262626] text-xs font-medium">Fecha:</span>
            <span className="text-[#171717] text-sm font-bold">{data.fechaIngreso ? formatDate(data.fechaIngreso) : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#262626] text-xs font-medium">Celular:</span>
            <span className="text-[#171717] text-sm font-bold">{data.telefono}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#262626] text-xs font-medium">Correo electrónico:</span>
            <span className="text-[#171717] text-sm font-bold">{data.correoElectronico}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#F7F7F7] rounded-[10px] p-4">
        <h3 className="text-[#171717] font-semibold text-base mb-3">Datos del vehículo</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[#262626] text-xs font-medium">Número de placa:</span>
            <span className="text-[#171717] text-sm font-bold uppercase">{data.placa}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#262626] text-xs font-medium">Marca:</span>
            <span className="text-[#171717] text-sm font-bold">{data.marca}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#262626] text-xs font-medium">Modelo:</span>
            <span className="text-[#171717] text-sm font-bold">{data.modelo}</span>
          </div>
          {data.anio && (
            <div className="flex justify-between">
              <span className="text-[#262626] text-xs font-medium">Año:</span>
              <span className="text-[#171717] text-sm font-bold">{data.anio}</span>
            </div>
          )}
          {data.nivelCombustible && (
            <div className="flex justify-between">
              <span className="text-[#262626] text-xs font-medium">Nivel de combustible:</span>
              <span className="text-[#171717] text-sm font-bold">{data.nivelCombustible}</span>
            </div>
          )}
          {data.inventario && data.inventario.length > 0 && (
            <div className="space-y-1">
              <span className="text-[#262626] text-xs font-medium">Inventario:</span>
              <div className="pl-1">
                {data.inventario.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-0.5">
                    <span className="text-green-600 text-sm leading-5">•</span>
                    <span className="text-[#171717] text-sm font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.observaciones && (
            <div className="flex justify-between">
              <span className="text-[#262626] text-xs font-medium">Observaciones adicionales:</span>
              <span className="text-[#171717] text-sm font-bold">{data.observaciones}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#F7F7F7] rounded-[10px] p-4">
        <h3 className="text-[#171717] font-semibold text-base mb-3">Problema técnico</h3>
        <div className="space-y-3">
          {data.tecnicoServicio && (
            <div className="flex justify-between">
              <span className="text-[#262626] text-xs font-medium">Técnico de servicio:</span>
              <span className="text-[#171717] text-sm font-bold">{data.tecnicoServicio}</span>
            </div>
          )}
          {data.tipoServicio && (
            <div className="flex justify-between">
              <span className="text-[#262626] text-xs font-medium">Tipo de servicio:</span>
              <span className="text-[#171717] text-sm font-bold">{data.tipoServicio}</span>
            </div>
          )}
          {data.motivoIngreso && (
            <div className="flex justify-between">
              <span className="text-[#262626] text-xs font-medium">Motivo de ingreso:</span>
              <span className="text-[#171717] text-sm font-bold">{data.motivoIngreso}</span>
            </div>
          )}
          {data.fotos && data.fotos.length > 0 && (
            <div>
              <p className="text-[#262626] text-xs font-medium mb-2">Fotos</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {data.fotos.map((foto, fidx) => (
                  <img
                    key={fidx}
                    src={foto}
                    alt={`Foto ${fidx + 1}`}
                    className="w-24 h-24 object-cover rounded-[8px] flex-shrink-0"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {data.diagnosticos.map((diag, idx) => (
          <div key={idx} className="bg-[#F7F7F7] border border-gray-100 rounded-[10px] p-4 shadow-sm">
            <h3 className="text-[#171717] font-semibold text-lg mb-4">
              Nueva Falla #{idx + 1}
            </h3>

            <div className="mb-4">
              <p className="text-[#262626] text-xs font-medium mb-1">Nombre de falla</p>
              <p className="text-[#171717] text-sm">{diag.nombreFalla}</p>
            </div>

            <div className="mb-4">
              <p className="text-[#262626] text-xs font-medium mb-1">Solución</p>
              <p className="text-[#171717] text-sm">{diag.solucion}</p>
            </div>

            {diag.fotos && diag.fotos.length > 0 && (
              <div className="mb-4">
                <p className="text-[#262626] text-xs font-medium mb-2">Fotos</p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {diag.fotos.map((foto, fidx) => (
                    <img
                      key={fidx}
                      src={foto}
                      alt={`Foto ${idx + 1}-${fidx + 1}`}
                      className="w-24 h-24 object-cover rounded-[8px] flex-shrink-0"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}

            {diag.repuestos && diag.repuestos.length > 0 && (
              <div className="mb-4">
                <p className="text-[#262626] text-xs font-medium mb-2">Repuestos</p>
                <div className="space-y-2">
                  {diag.repuestos.map((rep, ridx) => (
                    <div key={ridx} className="bg-[#E0E3E7] rounded-[8px] p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#171717] text-sm font-medium">{rep.nombre}</span>
                        <span className="text-[#262626] text-xs">Cant: {rep.cantidad}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#171717] text-sm">Precio: {formatCurrency(rep.precio)}</span>
                        <span className="text-[#171717] text-sm font-semibold">Total: {formatCurrency(rep.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diag.manoDeObra > 0 && (
              <div className="bg-[#E0E3E7] rounded-[10px] p-3 flex justify-between items-center">
                <span className="text-[#171717] text-sm">Mano de obra</span>
                <span className="text-[#171717] text-sm font-semibold">{formatCurrency(diag.manoDeObra)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#F7F7F7] rounded-[10px] p-4">
        <div className="flex justify-between items-center py-1">
          <span className="text-[#171717] font-semibold">Subtotal</span>
          <span className="text-[#171717] font-semibold">{formatCurrency(data.subtotal)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[#171717] font-semibold">IGV</span>
          <span className="text-[#171717] font-semibold">{formatCurrency(data.igv)}</span>
        </div>
        <div className="border-t border-[#492830] my-2 pt-2 flex justify-between items-center">
          <span className="text-[#171717] font-bold text-lg">Total</span>
          <span className="text-[#FF1D25] font-bold text-lg">{formatCurrency(data.total)}</span>
        </div>
      </div>
    </div>
  )
}
