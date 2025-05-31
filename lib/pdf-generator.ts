import jsPDF from "jspdf"

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

export async function generatePDF(personaData: PersonaData, causas: Causa[]) {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = 210
  const pageHeight = 297
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  // Colores exactos de la vista previa
  const primaryBlue = [37, 99, 235]
  const darkBlue = [30, 58, 138]
  const lightBlue = [239, 246, 255]
  const darkGray = [31, 41, 55]
  const mediumGray = [107, 114, 128]
  const borderGray = [209, 213, 219]

  // Función para truncar texto inteligentemente
  const truncateText = (text: string, maxWidth: number, fontSize: number): string => {
    pdf.setFontSize(fontSize)
    const textWidth = pdf.getTextWidth(text)
    if (textWidth <= maxWidth) return text

    let truncated = text
    while (pdf.getTextWidth(truncated + "...") > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1)
    }
    return truncated + "..."
  }

  // Función para justificar texto en múltiples líneas
  const addJustifiedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number,
    lineHeight = 4,
  ): number => {
    pdf.setFontSize(fontSize)
    const words = text.split(" ")
    let currentLine = ""
    let currentY = y

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + (currentLine ? " " : "") + words[i]
      const testWidth = pdf.getTextWidth(testLine)

      if (testWidth > maxWidth && currentLine) {
        // Justificar la línea actual (excepto la última)
        if (i < words.length - 1) {
          const lineWords = currentLine.split(" ")
          if (lineWords.length > 1) {
            const totalSpaces = lineWords.length - 1
            const extraSpace = (maxWidth - pdf.getTextWidth(currentLine.replace(/ /g, ""))) / totalSpaces
            let currentX = x

            for (let j = 0; j < lineWords.length; j++) {
              pdf.text(lineWords[j], currentX, currentY)
              if (j < lineWords.length - 1) {
                currentX += pdf.getTextWidth(lineWords[j]) + extraSpace
              }
            }
          } else {
            pdf.text(currentLine, x, currentY)
          }
        } else {
          pdf.text(currentLine, x, currentY)
        }

        currentLine = words[i]
        currentY += lineHeight
      } else {
        currentLine = testLine
      }
    }

    // Última línea (sin justificar)
    if (currentLine) {
      pdf.text(currentLine, x, currentY)
      currentY += lineHeight
    }

    return currentY
  }

  let yPos = 20

  // Header optimizado
  pdf.setFillColor(...darkBlue)
  pdf.rect(0, 0, pageWidth, 22, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Pro", margin, 15)

  pdf.setFillColor(249, 115, 22)
  pdf.circle(30, 12, 2, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.text("erify", 34, 15)

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  pdf.text("Certificado de Litigios", pageWidth - margin, 11, { align: "right" })
  pdf.setFontSize(8)
  pdf.text("Documento Oficial", pageWidth - margin, 17, { align: "right" })

  yPos = 35

  // Datos personales con mejor espaciado
  pdf.setTextColor(...darkGray)
  pdf.setFontSize(14)
  pdf.setFont("helvetica", "bold")
  pdf.text("Datos del Solicitante", margin, yPos)

  yPos += 10

  // Calcular el ancho disponible para datos personales (dejando espacio para el indicador)
  const dataWidth = contentWidth * 0.65
  const riskIndicatorSpace = contentWidth * 0.35

  pdf.setFontSize(10)
  const lineSpacing = 7

  // Datos personales justificados
  pdf.setFont("helvetica", "bold")
  pdf.text("Nombre:", margin, yPos)
  pdf.setFont("helvetica", "normal")
  const nombreTruncated = truncateText(personaData.nombre, dataWidth - 35, 10)
  pdf.text(nombreTruncated, margin + 35, yPos)

  yPos += lineSpacing
  pdf.setFont("helvetica", "bold")
  pdf.text("RUT:", margin, yPos)
  pdf.setFont("helvetica", "normal")
  pdf.text(personaData.rut, margin + 35, yPos)

  yPos += lineSpacing
  pdf.setFont("helvetica", "bold")
  pdf.text("Edad:", margin, yPos)
  pdf.setFont("helvetica", "normal")
  pdf.text(personaData.edad, margin + 35, yPos)

  yPos += lineSpacing
  pdf.setFont("helvetica", "bold")
  pdf.text("Fecha de emisión:", margin, yPos)
  pdf.setFont("helvetica", "normal")
  pdf.text(personaData.fecha, margin + 55, yPos)

  // Indicador de Riesgo posicionado correctamente
  const riskValue = Number.parseInt(personaData.indicadorRiesgo)
  let riskText = "BAJO RIESGO"

  if (riskValue > 500) {
    riskText = "RIESGO MEDIO"
  }
  if (riskValue > 800) {
    riskText = "ALTO RIESGO"
  }

  const centerX = pageWidth - margin - riskIndicatorSpace / 2
  const centerY = yPos - 15

  pdf.setFillColor(239, 246, 255)
  pdf.setDrawColor(191, 219, 254)
  pdf.setLineWidth(0.5)
  pdf.roundedRect(centerX - 22, centerY - 15, 44, 30, 15, 15, "FD")

  pdf.setTextColor(29, 78, 216)
  pdf.setFontSize(6)
  pdf.setFont("helvetica", "bold")
  pdf.text("INDICADOR DE RIESGO", centerX, centerY - 5, { align: "center" })

  pdf.setFontSize(20)
  pdf.text(personaData.indicadorRiesgo, centerX, centerY + 2, { align: "center" })

  pdf.setFontSize(5)
  pdf.text(riskText, centerX, centerY + 8, { align: "center" })

  yPos += 15

  // Sección Litigios con espaciado dinámico
  const litigiosHeight = 35
  pdf.setFillColor(...lightBlue)
  pdf.roundedRect(margin, yPos, contentWidth, litigiosHeight, 4, 4, "F")

  pdf.setTextColor(30, 64, 175)
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Litigios", margin + 5, yPos + 10)

  pdf.setFontSize(9)
  pdf.setTextColor(...primaryBlue)
  pdf.text(`Se observaron un total de ${causas.length} causas.`, pageWidth - margin - 5, yPos + 10, { align: "right" })

  // Estadísticas centradas y proporcionadas
  const activos = causas.filter((c) => c.estado === "Activo").length
  const concluidos = causas.filter((c) => c.estado === "Concluido").length
  const fallidos = causas.filter((c) => c.estado === "Fallido").length

  const statsY = yPos + 18
  const statWidth = (contentWidth - 40) / 4
  const statHeight = 15
  const statSpacing = 5

  const stats = [
    { value: causas.length, label: "Total", color: primaryBlue },
    { value: activos, label: "Activos", color: [22, 163, 74] },
    { value: concluidos, label: "Concluidos", color: mediumGray },
    { value: fallidos, label: "Fallidos", color: [220, 38, 38] },
  ]

  stats.forEach((stat, index) => {
    const statX = margin + 5 + index * (statWidth + statSpacing)

    pdf.setFillColor(255, 255, 255)
    pdf.setDrawColor(191, 219, 254)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(statX, statsY, statWidth, statHeight, 3, 3, "FD")

    pdf.setTextColor(...stat.color)
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(stat.value.toString(), statX + statWidth / 2, statsY + 8, { align: "center" })

    pdf.setFontSize(6)
    pdf.setFont("helvetica", "normal")
    pdf.text(stat.label, statX + statWidth / 2, statsY + 12, { align: "center" })
  })

  yPos += litigiosHeight + 10

  // Calcular espacio necesario para tablas dinámicamente
  const rowHeight = 8
  const headerHeight = 8
  const tableSpacing = 10
  const table1Height = headerHeight + causas.length * rowHeight
  const table2Height = headerHeight + causas.length * rowHeight
  const totalTablesHeight = table1Height + table2Height + tableSpacing + 40

  // Sección Detalle con altura dinámica
  pdf.setFillColor(...lightBlue)
  pdf.roundedRect(margin, yPos, contentWidth, totalTablesHeight, 4, 4, "F")

  pdf.setTextColor(30, 64, 175)
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Detalle", margin + 5, yPos + 10)

  yPos += 18

  // Primera tabla con columnas proporcionadas
  const table1Width = contentWidth - 10
  pdf.setFillColor(255, 255, 255)
  pdf.setDrawColor(...borderGray)
  pdf.setLineWidth(0.5)
  pdf.roundedRect(margin + 5, yPos, table1Width, table1Height, 3, 3, "FD")

  // Headers primera tabla
  pdf.setFillColor(219, 234, 254)
  pdf.rect(margin + 5, yPos, table1Width, headerHeight, "F")

  pdf.setTextColor(30, 64, 175)
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "bold")

  const headers1 = ["ID", "Tipo", "Estado", "Inicio del Procedimiento", "Tribunal"]
  const colWidths1 = [
    table1Width * 0.08, // ID: 8%
    table1Width * 0.12, // Tipo: 12%
    table1Width * 0.15, // Estado: 15%
    table1Width * 0.25, // Inicio: 25%
    table1Width * 0.4, // Tribunal: 40%
  ]

  let xPos = margin + 5
  headers1.forEach((header, i) => {
    pdf.text(header, xPos + 2, yPos + 5)
    xPos += colWidths1[i]
  })

  yPos += headerHeight

  // Filas primera tabla
  causas.forEach((causa, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(248, 250, 252)
      pdf.rect(margin + 5, yPos, table1Width, rowHeight, "F")
    }

    xPos = margin + 5
    pdf.setTextColor(...darkGray)
    pdf.setFontSize(7)
    pdf.setFont("helvetica", "normal")

    const rowData1 = [
      causa.id.toString(),
      truncateText(causa.tipo, colWidths1[1] - 4, 7),
      causa.estado,
      truncateText(causa.inicio, colWidths1[3] - 4, 7),
      truncateText(causa.tribunal, colWidths1[4] - 4, 7),
    ]

    rowData1.forEach((data, i) => {
      if (i === 2) {
        // Estado con colores
        if (causa.estado === "Activo") pdf.setTextColor(22, 163, 74)
        else if (causa.estado === "Fallido") pdf.setTextColor(220, 38, 38)
        else pdf.setTextColor(...mediumGray)
      } else {
        pdf.setTextColor(...darkGray)
      }

      pdf.text(data, xPos + 2, yPos + 5)
      xPos += colWidths1[i]
    })

    yPos += rowHeight
  })

  yPos += tableSpacing

  // Segunda tabla con columnas proporcionadas
  const table2Width = contentWidth - 10
  pdf.setFillColor(255, 255, 255)
  pdf.roundedRect(margin + 5, yPos, table2Width, table2Height, 3, 3, "FD")

  // Headers segunda tabla
  pdf.setFillColor(219, 234, 254)
  pdf.rect(margin + 5, yPos, table2Width, headerHeight, "F")

  pdf.setTextColor(30, 64, 175)
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "bold")

  const headers2 = ["ID", "Materia", "Demandado", "Segundo Demandado", "Cuantía"]
  const colWidths2 = [
    table2Width * 0.08, // ID: 8%
    table2Width * 0.25, // Materia: 25%
    table2Width * 0.25, // Demandado: 25%
    table2Width * 0.25, // Segundo Demandado: 25%
    table2Width * 0.17, // Cuantía: 17%
  ]

  xPos = margin + 5
  headers2.forEach((header, i) => {
    pdf.text(header, xPos + 2, yPos + 5)
    xPos += colWidths2[i]
  })

  yPos += headerHeight

  // Filas segunda tabla
  causas.forEach((causa, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(248, 250, 252)
      pdf.rect(margin + 5, yPos, table2Width, rowHeight, "F")
    }

    xPos = margin + 5
    pdf.setTextColor(...darkGray)
    pdf.setFontSize(7)
    pdf.setFont("helvetica", "normal")

    const rowData2 = [
      causa.id.toString(),
      truncateText(causa.materia, colWidths2[1] - 4, 7),
      truncateText(causa.demandado, colWidths2[2] - 4, 7),
      truncateText(causa.segundoDemandado, colWidths2[3] - 4, 7),
      causa.cuantia,
    ]

    rowData2.forEach((data, i) => {
      if (i === 4) {
        // Cuantía con colores
        if (causa.cuantia === "Alta") pdf.setTextColor(220, 38, 38)
        else if (causa.cuantia === "Media") pdf.setTextColor(...primaryBlue)
        else pdf.setTextColor(...mediumGray)
      } else {
        pdf.setTextColor(...darkGray)
      }

      pdf.text(data, xPos + 2, yPos + 5)
      xPos += colWidths2[i]
    })

    yPos += rowHeight
  })

  // SEGUNDA PÁGINA - Tercera tabla y leyenda
  pdf.addPage()

  // Header segunda página
  pdf.setFillColor(...darkBlue)
  pdf.rect(0, 0, pageWidth, 18, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  pdf.text("Pro", margin, 12)

  pdf.setFillColor(249, 115, 22)
  pdf.circle(27, 10, 1.5, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.text("erify", 30, 12)

  pdf.setFontSize(8)
  pdf.text("Página 2", pageWidth - margin, 12, { align: "right" })

  yPos = 30

  // Tercera tabla
  const table3Height = headerHeight + causas.length * rowHeight
  pdf.setFillColor(...lightBlue)
  pdf.roundedRect(margin, yPos, contentWidth, table3Height + 20, 4, 4, "F")

  pdf.setTextColor(30, 64, 175)
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Detalle de Relaciones Laborales", margin + 10, yPos + 12)

  yPos += 18

  const table3Width = contentWidth - 10
  pdf.setFillColor(255, 255, 255)
  pdf.roundedRect(margin + 5, yPos, table3Width, table3Height, 3, 3, "FD")

  // Headers tercera tabla
  pdf.setFillColor(219, 234, 254)
  pdf.rect(margin + 5, yPos, table3Width, headerHeight, "F")

  pdf.setTextColor(30, 64, 175)
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "bold")

  const headers3 = ["ID", "ROL", "Inicio/Termino de Relación Laboral", "Fallo"]
  const colWidths3 = [
    table3Width * 0.08, // ID: 8%
    table3Width * 0.22, // ROL: 22%
    table3Width * 0.45, // Relación Laboral: 45%
    table3Width * 0.25, // Fallo: 25%
  ]

  xPos = margin + 5
  headers3.forEach((header, i) => {
    pdf.text(header, xPos + 2, yPos + 5)
    xPos += colWidths3[i]
  })

  yPos += headerHeight

  // Filas tercera tabla
  causas.forEach((causa, index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(248, 250, 252)
      pdf.rect(margin + 5, yPos, table3Width, rowHeight, "F")
    }

    xPos = margin + 5
    pdf.setTextColor(...darkGray)
    pdf.setFontSize(7)
    pdf.setFont("helvetica", "normal")

    const rowData3 = [
      causa.id.toString(),
      truncateText(causa.rol, colWidths3[1] - 4, 7),
      truncateText(causa.relacionLaboral, colWidths3[2] - 4, 7),
      causa.fallo,
    ]

    rowData3.forEach((data, i) => {
      if (i === 3) {
        // Fallo con colores
        if (causa.fallo === "Acogida") pdf.setTextColor(...primaryBlue)
        else pdf.setTextColor(...mediumGray)
      } else {
        pdf.setTextColor(...darkGray)
      }

      pdf.text(data, xPos + 2, yPos + 5)
      xPos += colWidths3[i]
    })

    yPos += rowHeight
  })

  yPos += 25

  // Leyenda con contenedor optimizado
  const legendHeight = 95 // Reducido de 110 a 95
  pdf.setFillColor(...lightBlue)
  pdf.roundedRect(margin, yPos, contentWidth, legendHeight, 4, 4, "F")

  pdf.setTextColor(30, 64, 175)
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Descripción y Leyenda", margin + 10, yPos + 12)

  yPos += 18

  // Contenedor blanco optimizado
  const whiteContainerHeight = legendHeight - 25 // 70mm de altura
  pdf.setFillColor(255, 255, 255)
  pdf.roundedRect(margin + 5, yPos, contentWidth - 10, whiteContainerHeight, 3, 3, "F")

  pdf.setTextColor(...darkGray)
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  pdf.text("Leyenda:", margin + 15, yPos + 12)

  yPos += 16

  // Línea base para alineación vertical - TODOS los elementos alineados desde aquí
  const baseLineX = margin + 15
  pdf.setFontSize(8)

  // ID - alineado en línea base
  pdf.setFont("helvetica", "bold")
  pdf.text("ID:", baseLineX, yPos)
  pdf.setFont("helvetica", "normal")
  yPos = addJustifiedText(
    "Número de identificación de cada causa, correlativo a las demás tablas.",
    baseLineX + 15,
    yPos,
    contentWidth - 50,
    8,
    4,
  )
  yPos += 2 // Interlineado reducido

  // Estado - alineado en línea base
  pdf.setFont("helvetica", "bold")
  pdf.text("Estado:", baseLineX, yPos)
  pdf.setFont("helvetica", "normal")
  yPos = addJustifiedText(
    "Representa el estado de tramitación de la causa.",
    baseLineX + 30,
    yPos,
    contentWidth - 65,
    8,
    4,
  )
  yPos += 2

  // Fallido - alineado en línea base (sin indentación extra)
  pdf.setFont("helvetica", "bold")
  pdf.text("Fallido:", baseLineX, yPos)
  pdf.setFont("helvetica", "normal")
  yPos = addJustifiedText(
    "Representa un termino distinto a una sentencia definitiva, transacción, conciliación o avenimiento.",
    baseLineX + 30,
    yPos,
    contentWidth - 65,
    8,
    4,
  )
  yPos += 2

  // Clasificación de Cuantía - alineado en línea base
  pdf.setFont("helvetica", "bold")
  pdf.text("Clasificación de Cuantía:", baseLineX, yPos)
  pdf.setFont("helvetica", "normal")
  yPos = addJustifiedText(
    "Determinación de lo solicitado por postulante en base a escala propia creada por 'ProVerify'.",
    baseLineX + 75,
    yPos,
    contentWidth - 110,
    8,
    4,
  )
  yPos += 4 // Pequeño espacio antes de los círculos

  // Círculos de colores - ALINEADOS en la misma línea base
  const cuantiaItems = [
    { color: [34, 197, 94], label: "Baja Cuantía:", desc: "En un rango de $0 a $5.000.000" },
    { color: [234, 179, 8], label: "Media Cuantía:", desc: "En un rango de $5.000.000 a $15.000.001" },
    { color: [239, 68, 68], label: "Cuantía Alta:", desc: "Sobre los $15.000.001" },
  ]

  cuantiaItems.forEach((item) => {
    // Círculo alineado en la línea base
    pdf.setFillColor(...item.color)
    pdf.circle(baseLineX + 3, yPos, 1.5, "F") // Círculo alineado con el texto

    pdf.setTextColor(...darkGray)
    pdf.setFont("helvetica", "bold")
    pdf.text(item.label, baseLineX + 8, yPos + 1) // Texto alineado

    pdf.setFont("helvetica", "normal")
    pdf.text(item.desc, baseLineX + 8 + pdf.getTextWidth(item.label) + 3, yPos + 1)

    yPos += 6 // Interlineado reducido y consistente
  })

  // Disclaimer como pie de página en la última hoja
  const footerY = pageHeight - 35
  pdf.setFillColor(243, 244, 246)
  pdf.roundedRect(margin, footerY, contentWidth, 28, 4, 4, "F")

  pdf.setTextColor(75, 85, 99)
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "normal")

  const disclaimers = [
    "El presente certificado no contiene información respecto de aquellas causas que se encuentran reservadas de acuerdo con el Acta N°44-2022 de la Corte Suprema y Ley 20.866.",
    "El presente certificado solo contiene información respecto de aquellas causas visibles en la oficina judicial virtual.",
  ]

  let disclaimerY = footerY + 6
  disclaimers.forEach((disclaimer) => {
    disclaimerY = addJustifiedText(disclaimer, margin + 5, disclaimerY, contentWidth - 10, 8, 4)
    disclaimerY += 2
  })

  pdf.setFontSize(6)
  pdf.setTextColor(107, 114, 128)
  pdf.text("ProVerify Certificados | Documento generado automáticamente", pageWidth / 2, footerY + 24, {
    align: "center",
  })

  // Guardar el PDF
  const fileName = `Certificado_Litigios_${personaData.rut.replace(/\./g, "").replace("-", "")}_${new Date().toISOString().split("T")[0]}.pdf`
  pdf.save(fileName)
}
