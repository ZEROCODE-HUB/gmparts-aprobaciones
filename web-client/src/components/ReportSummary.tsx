'use client'

import type { RecepcionData } from '@/lib/types'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

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
              <span className="text-white text-sm font-bold">{formatDateTime(data.fechaIngreso)}</span>
            </div>
          )}
          {data.fechaSalida && (
            <div className="flex justify-between">
              <span className="text-white/70 text-xs font-medium">Fecha finalización:</span>
              <span className="text-white text-sm font-bold">{formatDateTime(data.fechaSalida)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
        <h3 className="text-white font-semibold text-base mb-3">Datos del cliente</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70 text-xs font-medium">Nombre:</span>
            <span className="text-white text-sm font-bold">{data.nombreCliente}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs font-medium">Teléfono:</span>
            <span className="text-white text-sm font-bold">{data.telefono}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70 text-xs font-medium">Email:</span>
            <span className="text-white text-sm font-bold">{data.correoElectronico}</span>
          </div>
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

      {data.fotos && data.fotos.length > 0 && (
        <div className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
          <h3 className="text-white font-semibold text-base mb-3">Fotos de recepción</h3>
          <div className="grid grid-cols-3 gap-2">
            {data.fotos.map((foto, fidx) => (
              <img
                key={fidx}
                src={foto}
                alt={`Foto recepción ${fidx + 1}`}
                className="w-full aspect-square object-cover rounded-gmp-sm border border-gray-600"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-white font-semibold text-lg">Trabajo realizado</h2>

        {data.diagnosticos.map((diag, idx) => (
          <div key={idx} className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
            <h3 className="text-white font-semibold mb-2">{diag.nombreFalla}</h3>
            <p className="text-white/70 text-sm mb-4">{diag.solucion}</p>

            {diag.fotos && diag.fotos.length > 0 && (
              <div className="mb-4">
                <p className="text-white/70 text-xs font-medium mb-2">Fotos de la falla</p>
                <div className="grid grid-cols-3 gap-2">
                  {diag.fotos.map((foto, fidx) => (
                    <img
                      key={fidx}
                      src={foto}
                      alt={`Foto falla ${idx + 1}-${fidx + 1}`}
                      className="w-full aspect-square object-cover rounded-gmp-sm border border-gray-600"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}

            {diag.repuestos && diag.repuestos.length > 0 && (
              <div className="mb-4">
                <p className="text-white/70 text-xs font-medium mb-2">Repuestos utilizados</p>
                <div className="space-y-2">
                  {diag.repuestos.map((rep, ridx) => (
                    <div key={ridx} className="bg-[#E0E3E7]/10 rounded-[8px] p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-sm font-medium">{rep.nombre}</span>
                        <span className="text-white/70 text-xs">Cant: {rep.cantidad}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">Precio: {formatCurrency(rep.precio)}</span>
                        <span className="text-white text-sm font-semibold">Total: {formatCurrency(rep.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diag.manoDeObra > 0 && (
              <div className="bg-[#E0E3E7]/10 rounded-[10px] p-3 flex justify-between items-center mb-4">
                <span className="text-white text-sm">
                  {diag.nombreServicio || diag.nombreFalla || 'Mano de obra'}
                </span>
                <span className="text-white text-sm font-semibold">{formatCurrency(diag.manoDeObra)}</span>
              </div>
            )}

            {(() => {
              const fotosFinalizacion = [
                ...(diag.imagenesFinalizado || []),
                ...(diag.fotosfinalizar || []),
              ]
              return fotosFinalizacion.length > 0 ? (
                <div>
                  <p className="text-white/70 text-xs font-medium mb-2">Imágenes de finalización</p>
                  <div className="grid grid-cols-3 gap-2">
                    {fotosFinalizacion.map((foto, fidx) => (
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
              ) : null
            })()}
          </div>
        ))}
      </div>

      {data.comentariosFinalizacion && (
        <div className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
          <h3 className="text-white font-semibold text-base mb-3">Comentarios de finalización</h3>
          <p className="text-white/70 text-sm">{data.comentariosFinalizacion}</p>
        </div>
      )}

      {data.fotosFinalizacion && data.fotosFinalizacion.length > 0 && (
        <div className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
          <h3 className="text-white font-semibold text-base mb-3">Fotos de finalización</h3>
          <div className="grid grid-cols-3 gap-2">
            {data.fotosFinalizacion.map((foto, fidx) => (
              <img
                key={fidx}
                src={foto}
                alt={`Foto finalización ${fidx + 1}`}
                className="w-full aspect-square object-cover rounded-gmp-sm border border-gray-600"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-gmp-accent2 border border-gray-700 rounded-gmp p-4">
        <div className="flex justify-between items-center py-1">
          <span className="text-white font-semibold">Subtotal</span>
          <span className="text-white font-semibold">{formatCurrency(data.subtotal)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-white font-semibold">IGV</span>
          <span className="text-white font-semibold">{formatCurrency(data.igv)}</span>
        </div>
        <div className="border-t border-gray-700 my-2 pt-2 flex justify-between items-center">
          <span className="text-white font-bold text-lg">Total</span>
          <span className="text-gmp-primary font-bold text-lg">{formatCurrency(data.total)}</span>
        </div>
      </div>
    </div>
  )
}
