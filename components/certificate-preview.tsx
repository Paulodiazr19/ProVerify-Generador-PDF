import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { CertificatePreviewProps } from "@/types/certificate-preview"

export function CertificatePreview({ personaData, causas }: CertificatePreviewProps) {
  const riskValue = Number.parseInt(personaData.indicadorRiesgo)
  let riskColor = "bg-green-100 text-green-800 border-green-300"
  let riskText = "BAJO RIESGO"

  if (riskValue > 500) {
    riskColor = "bg-yellow-100 text-yellow-800 border-yellow-300"
    riskText = "RIESGO MEDIO"
  }
  if (riskValue > 800) {
    riskColor = "bg-red-100 text-red-800 border-red-300"
    riskText = "ALTO RIESGO"
  }

  const activos = causas.filter((c) => c.estado === "Activo").length
  const concluidos = causas.filter((c) => c.estado === "Concluido").length
  const fallidos = causas.filter((c) => c.estado === "Fallido").length

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Primera página */}
      <Card className="bg-white shadow-2xl border-0 overflow-hidden" id="certificate">
        {/* Barra azul superior con logo ProVerify */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/images/proverify-logo.png" alt="ProVerify Logo" className="h-16 w-auto" />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Certificado de Litigios</p>
              <p className="text-xs text-blue-200">Documento Oficial</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Datos personales con indicador de riesgo a la derecha */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Datos del Solicitante</h2>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">Nombre:</span>
                  <p className="text-gray-900 font-medium">{personaData.nombre}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">RUT:</span>
                  <p className="text-gray-900 font-medium">{personaData.rut}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Edad:</span>
                  <p className="text-gray-900 font-medium">{personaData.edad}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Fecha de emisión:</span>
                  <p className="text-gray-900 font-medium">{personaData.fecha}</p>
                </div>
              </div>
            </div>

            {/* Indicador de Riesgo en óvalo azul tenue a la derecha */}
            <div className="ml-8">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-full px-8 py-6 text-center shadow-lg">
                <h3 className="text-sm font-bold text-blue-700 mb-2">INDICADOR DE RIESGO</h3>
                <div className="text-4xl font-bold text-blue-600 mb-1">{personaData.indicadorRiesgo}</div>
                <div className="text-xs font-semibold text-blue-600">{riskText}</div>
              </div>
            </div>
          </div>

          {/* Sección Litigios con fondo azul claro */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">Litigios</h2>
              <div className="text-sm text-blue-600">Se observaron un total de {causas.length} causas.</div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{causas.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600">{activos}</div>
                <div className="text-sm text-gray-600">Activos</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-600">{concluidos}</div>
                <div className="text-sm text-gray-600">Concluidos</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-red-600">{fallidos}</div>
                <div className="text-sm text-gray-600">Fallidos</div>
              </div>
            </div>
          </div>

          {/* Sección Detalle con fondo azul claro */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-6">Detalle</h2>

            {/* Primera tabla */}
            <div className="mb-8 bg-white rounded-lg overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">ID</th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">Tipo</th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">Estado</th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">
                      Inicio del Procedimiento
                    </th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">Tribunal</th>
                  </tr>
                </thead>
                <tbody>
                  {causas.map((causa, index) => (
                    <tr key={causa.id} className={index % 2 === 0 ? "bg-blue-25" : "bg-white"}>
                      <td className="p-4 border-b border-gray-100">{causa.id}</td>
                      <td className="p-4 border-b border-gray-100">{causa.tipo}</td>
                      <td className="p-4 border-b border-gray-100">
                        <Badge
                          variant={
                            causa.estado === "Activo"
                              ? "default"
                              : causa.estado === "Fallido"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {causa.estado}
                        </Badge>
                      </td>
                      <td className="p-4 border-b border-gray-100 text-sm">{causa.inicio}</td>
                      <td className="p-4 border-b border-gray-100 text-sm">{causa.tribunal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Segunda tabla */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">ID</th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">Materia</th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">Demandado</th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">
                      Segundo Demandado
                    </th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">Cuantía</th>
                  </tr>
                </thead>
                <tbody>
                  {causas.map((causa, index) => (
                    <tr key={causa.id} className={index % 2 === 0 ? "bg-blue-25" : "bg-white"}>
                      <td className="p-4 border-b border-gray-100">{causa.id}</td>
                      <td className="p-4 border-b border-gray-100 text-sm">{causa.materia}</td>
                      <td className="p-4 border-b border-gray-100 text-sm">{causa.demandado}</td>
                      <td className="p-4 border-b border-gray-100 text-sm">{causa.segundoDemandado}</td>
                      <td className="p-4 border-b border-gray-100">
                        <Badge
                          variant={
                            causa.cuantia === "Alta"
                              ? "destructive"
                              : causa.cuantia === "Media"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {causa.cuantia}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer con disclaimers en gris claro */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                El presente certificado no contiene información respecto de aquellas causas que se encuentran reservadas
                de acuerdo con el Acta N°44-2022 de la Corte Suprema y Ley 20.866.
              </p>
              <p>
                El presente certificado solo contiene información respecto de aquellas causas visibles en la oficina
                judicial virtual.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-500">ProVerify Certificados | Documento generado automáticamente</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Segunda página - Tercera tabla y leyenda */}
      <Card className="bg-white shadow-2xl border-0 overflow-hidden">
        {/* Header de segunda página */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/images/proverify-logo.png" alt="ProVerify Logo" className="h-12 w-auto" />
            </div>
            <span className="text-sm text-blue-200">Página 2</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Tercera tabla */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-6">Detalle de Relaciones Laborales</h2>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">ID</th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">ROL</th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">
                      Inicio/Termino de Relación Laboral
                    </th>
                    <th className="p-4 text-left font-semibold text-blue-800 border-b border-blue-200">Fallo</th>
                  </tr>
                </thead>
                <tbody>
                  {causas.map((causa, index) => (
                    <tr key={causa.id} className={index % 2 === 0 ? "bg-blue-25" : "bg-white"}>
                      <td className="p-4 border-b border-gray-100">{causa.id}</td>
                      <td className="p-4 border-b border-gray-100">{causa.rol}</td>
                      <td className="p-4 border-b border-gray-100">{causa.relacionLaboral}</td>
                      <td className="p-4 border-b border-gray-100">
                        <Badge variant={causa.fallo === "Acogida" ? "default" : "secondary"} className="text-xs">
                          {causa.fallo}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leyenda */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-6">Descripción y Leyenda</h2>

            <div className="bg-white rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Leyenda:</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>ID:</strong> Número de identificación de cada causa, correlativo a las demás tablas.
                  </p>
                  <p>
                    <strong>Estado:</strong> Representa el estado de tramitación de la causa.
                  </p>
                  <p className="ml-6">
                    <strong>Fallido:</strong> Representa un termino distinto a una sentencia definitiva, transacción,
                    conciliación o avenimiento.
                  </p>
                  <p>
                    <strong>Clasificación de Cuantía:</strong> Determinación de lo solicitado por postulante en base a
                    escala propia creada por "ProVerify".
                  </p>
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span>
                        <strong>Baja Cuantia:</strong> En un rango de $0 a $5.000.000
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span>
                        <strong>Media Cuantia:</strong> En un rango de $5.000.000 a $15.000.001
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span>
                        <strong>Cuantia Alta:</strong> Sobre los $15.000.001
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
