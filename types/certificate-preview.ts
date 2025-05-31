export interface CertificatePreviewProps {
  personaData: {
    nombre: string
    rut: string
    edad: string
    indicadorRiesgo: string
    fecha: string
  }
  causas: {
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
  }[]
}
