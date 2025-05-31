"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Plus, Trash2 } from "lucide-react"
import { CertificatePreview } from "@/components/certificate-preview"
import { generatePDF } from "@/lib/pdf-generator"

interface Causa {
  id: number
  tipo: string
  estado: string
  inicio: string
  tribunal: string
  materia: string
  demandado: string
  segundoDemandado: string
  cuantia: string
  rol: string
  relacionLaboral: string
  fallo: string
}

interface PersonaData {
  nombre: string
  rut: string
  edad: string
  indicadorRiesgo: string
  fecha: string
}

export default function Home() {
  const [personaData, setPersonaData] = useState<PersonaData>({
    nombre: "PAULO ANDRES DIAZ RAYGADA",
    rut: "19.149.605-1",
    edad: "29 años",
    indicadorRiesgo: "999",
    fecha: new Date().toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  })

  const [causas, setCausas] = useState<Causa[]>([
    {
      id: 1,
      tipo: "Laboral",
      estado: "Activo",
      inicio: "23 de septiembre de 2024",
      tribunal: "Juzgado de Letras del Trabajo de Arica",
      materia: "Despido Indirecto",
      demandado: "Alimentos S.A.",
      segundoDemandado: "Transportes LTDA",
      cuantia: "Media",
      rol: "O-100-2023",
      relacionLaboral: "01/01/2020 – 08/12/2022",
      fallo: "Acogida",
    },
    {
      id: 2,
      tipo: "Laboral",
      estado: "Concluido",
      inicio: "11 de julio de 2020",
      tribunal: "1° Juzgado de Letras del Trabajo de Vallenar",
      materia: "Indemnización Sustitutiva de Aviso Previo",
      demandado: "Transportes S.P.A.",
      segundoDemandado: "N/A",
      cuantia: "Baja",
      rol: "M-245-2024",
      relacionLaboral: "05/09/2023 – 10/11/2024",
      fallo: "Rechazada",
    },
    {
      id: 3,
      tipo: "Laboral",
      estado: "Fallido",
      inicio: "7 de marzo de 2022",
      tribunal: "1° Juzgado de Letras del Trabajo de Santiago",
      materia: "Despido Injustificado",
      demandado: "Minera S.A.",
      segundoDemandado: "Contratistas EIRL",
      cuantia: "Alta",
      rol: "T-1550-2025",
      relacionLaboral: "20/12/2024 – 03/05/2025",
      fallo: "Rechazada",
    },
  ])

  const [showPreview, setShowPreview] = useState(false)

  const addCausa = () => {
    const newId = Math.max(...causas.map((c) => c.id)) + 1
    setCausas([
      ...causas,
      {
        id: newId,
        tipo: "Laboral",
        estado: "Activo",
        inicio: "",
        tribunal: "",
        materia: "",
        demandado: "",
        segundoDemandado: "",
        cuantia: "Baja",
        rol: "",
        relacionLaboral: "",
        fallo: "",
      },
    ])
  }

  const removeCausa = (id: number) => {
    setCausas(causas.filter((c) => c.id !== id))
  }

  const updateCausa = (id: number, field: keyof Causa, value: string) => {
    setCausas(causas.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleGeneratePDF = async () => {
    await generatePDF(personaData, causas)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProVerify Certificados
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generador profesional de certificados de litigios laborales para empresas
          </p>
        </div>

        {!showPreview ? (
          <div className="grid gap-8">
            {/* Datos Personales */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Datos Personales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input
                      id="nombre"
                      value={personaData.nombre}
                      onChange={(e) => setPersonaData({ ...personaData, nombre: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rut">RUT</Label>
                    <Input
                      id="rut"
                      value={personaData.rut}
                      onChange={(e) => setPersonaData({ ...personaData, rut: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edad">Edad</Label>
                    <Input
                      id="edad"
                      value={personaData.edad}
                      onChange={(e) => setPersonaData({ ...personaData, edad: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="indicador">Indicador de Riesgo</Label>
                    <Input
                      id="indicador"
                      value={personaData.indicadorRiesgo}
                      onChange={(e) => setPersonaData({ ...personaData, indicadorRiesgo: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Causas */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Causas Laborales ({causas.length})
                  </span>
                  <Button
                    onClick={addCausa}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Causa
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {causas.map((causa) => (
                    <div key={causa.id} className="p-4 border rounded-lg bg-gray-50/50 relative">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Causa #{causa.id}
                        </Badge>
                        <Button
                          onClick={() => removeCausa(causa.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>Tipo</Label>
                          <Select value={causa.tipo} onValueChange={(value) => updateCausa(causa.id, "tipo", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Laboral">Laboral</SelectItem>
                              <SelectItem value="Civil">Civil</SelectItem>
                              <SelectItem value="Comercial">Comercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Estado</Label>
                          <Select
                            value={causa.estado}
                            onValueChange={(value) => updateCausa(causa.id, "estado", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Activo">Activo</SelectItem>
                              <SelectItem value="Concluido">Concluido</SelectItem>
                              <SelectItem value="Fallido">Fallido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Cuantía</Label>
                          <Select
                            value={causa.cuantia}
                            onValueChange={(value) => updateCausa(causa.id, "cuantia", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Baja">Baja</SelectItem>
                              <SelectItem value="Media">Media</SelectItem>
                              <SelectItem value="Alta">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Inicio del Procedimiento</Label>
                          <Input
                            value={causa.inicio}
                            onChange={(e) => updateCausa(causa.id, "inicio", e.target.value)}
                            className="mt-1"
                            placeholder="ej: 23 de septiembre de 2024"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label>Tribunal</Label>
                          <Input
                            value={causa.tribunal}
                            onChange={(e) => updateCausa(causa.id, "tribunal", e.target.value)}
                            className="mt-1"
                            placeholder="ej: Juzgado de Letras del Trabajo de Arica"
                          />
                        </div>

                        <div>
                          <Label>Materia</Label>
                          <Input
                            value={causa.materia}
                            onChange={(e) => updateCausa(causa.id, "materia", e.target.value)}
                            className="mt-1"
                            placeholder="ej: Despido Indirecto"
                          />
                        </div>

                        <div>
                          <Label>Demandado</Label>
                          <Input
                            value={causa.demandado}
                            onChange={(e) => updateCausa(causa.id, "demandado", e.target.value)}
                            className="mt-1"
                            placeholder="ej: Alimentos S.A."
                          />
                        </div>

                        <div>
                          <Label>Segundo Demandado</Label>
                          <Input
                            value={causa.segundoDemandado}
                            onChange={(e) => updateCausa(causa.id, "segundoDemandado", e.target.value)}
                            className="mt-1"
                            placeholder="ej: Transportes LTDA o N/A"
                          />
                        </div>

                        <div>
                          <Label>ROL</Label>
                          <Input
                            value={causa.rol}
                            onChange={(e) => updateCausa(causa.id, "rol", e.target.value)}
                            className="mt-1"
                            placeholder="ej: O-100-2023"
                          />
                        </div>

                        <div>
                          <Label>Relación Laboral</Label>
                          <Input
                            value={causa.relacionLaboral}
                            onChange={(e) => updateCausa(causa.id, "relacionLaboral", e.target.value)}
                            className="mt-1"
                            placeholder="ej: 01/01/2020 – 08/12/2022"
                          />
                        </div>

                        <div>
                          <Label>Fallo</Label>
                          <Select value={causa.fallo} onValueChange={(value) => updateCausa(causa.id, "fallo", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Acogida">Acogida</SelectItem>
                              <SelectItem value="Rechazada">Rechazada</SelectItem>
                              <SelectItem value="Pendiente">Pendiente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowPreview(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              >
                <Eye className="h-5 w-5 mr-2" />
                Vista Previa
              </Button>
              <Button
                onClick={handleGeneratePDF}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Generar PDF
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Vista Previa del Certificado</h2>
              <div className="flex gap-2">
                <Button onClick={() => setShowPreview(false)} variant="outline">
                  Volver a Editar
                </Button>
                <Button
                  onClick={handleGeneratePDF}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
            <CertificatePreview personaData={personaData} causas={causas} />
          </div>
        )}
      </div>
    </div>
  )
}
