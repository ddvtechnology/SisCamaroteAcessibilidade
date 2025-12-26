import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Inscricao, Evento } from '@/types'
import { formatCPF, formatPhone, formatDate, getStatusLabel, getCategoriaLabel } from './utils'

type InscricaoComEvento = Inscricao & {
  eventos: Evento
}

export function exportToExcel(inscricoes: InscricaoComEvento[], nomeArquivo: string = 'inscricoes') {
  // Prepara os dados
  const dados = inscricoes.map((inscricao) => ({
    'Protocolo': inscricao.protocolo,
    'Senha': inscricao.senha,
    'Status': getStatusLabel(inscricao.status),
    'Nome Completo': inscricao.nome_completo,
    'CPF': formatCPF(inscricao.cpf),
    'Categoria': getCategoriaLabel(inscricao.categoria),
    'Endereço': inscricao.endereco,
    'Telefone': formatPhone(inscricao.telefone),
    'Tipo de Deficiência': inscricao.tipo_deficiencia || '-',
    'Observações': inscricao.observacoes || '-',
    'Nome Acompanhante': inscricao.nome_acompanhante || '-',
    'CPF Acompanhante': inscricao.cpf_acompanhante ? formatCPF(inscricao.cpf_acompanhante) : '-',
    'Evento': inscricao.eventos.nome,
    'Dias do Evento': inscricao.datas_eventos.map(d => formatDate(d)).join('; '),
    'Data de Inscrição': formatDate(inscricao.created_at),
  }))

  // Cria a planilha
  const worksheet = XLSX.utils.json_to_sheet(dados)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscrições')
  
  // Adiciona créditos DDV Technology na última linha
  const numCols = Object.keys(dados[0] || {}).length
  const lastRow = dados.length + 1
  
  // Adiciona linha em branco e créditos
  XLSX.utils.sheet_add_aoa(worksheet, [
    [''], // Linha em branco
    ['Sistema desenvolvido por DDV Technology']
  ], { origin: `A${lastRow}` })
  
  // Formata a linha de créditos (mescla células)
  if (!worksheet['!merges']) worksheet['!merges'] = []
  worksheet['!merges'].push({
    s: { r: lastRow, c: 0 },
    e: { r: lastRow, c: numCols - 1 }
  })
  
  // Centraliza o texto dos créditos
  const creditCell = XLSX.utils.encode_cell({ r: lastRow, c: 0 })
  if (!worksheet[creditCell]) worksheet[creditCell] = { v: 'Sistema desenvolvido por DDV Technology' }
  if (!worksheet[creditCell].s) worksheet[creditCell].s = {}
  worksheet[creditCell].s.alignment = { horizontal: 'center' }

  // Define larguras das colunas
  const columnWidths = [
    { wch: 15 }, // Protocolo
    { wch: 8 }, // Senha
    { wch: 12 }, // Status
    { wch: 30 }, // Nome Completo
    { wch: 15 }, // CPF
    { wch: 25 }, // Categoria
    { wch: 40 }, // Endereço
    { wch: 15 }, // Telefone
    { wch: 20 }, // Tipo de Deficiência
    { wch: 30 }, // Observações
    { wch: 30 }, // Nome Acompanhante
    { wch: 15 }, // CPF Acompanhante
    { wch: 30 }, // Evento
    { wch: 25 }, // Dias do Evento
    { wch: 18 }, // Data de Inscrição
  ]
  worksheet['!cols'] = columnWidths

  // Faz o download
  XLSX.writeFile(workbook, `${nomeArquivo}.xlsx`)
}

export function exportToPDF(inscricoes: InscricaoComEvento[], nomeArquivo: string = 'inscricoes', titulo: string = 'Lista de Inscrições') {
  const doc = new jsPDF('l', 'mm', 'a4') // landscape, mm, A4

  // Cabeçalho com gradiente (simulado)
  doc.setFillColor(14, 165, 233) // primary-600
  doc.rect(0, 0, 297, 20, 'F')
  
  // Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(titulo, 14, 14)

  // Informações gerais
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total de inscrições: ${inscricoes.length}`, 14, 28)
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 33)

  // Prepara os dados da tabela
  const dados = inscricoes.map((inscricao) => [
    inscricao.protocolo,
    inscricao.nome_completo,
    formatCPF(inscricao.cpf),
    getCategoriaLabel(inscricao.categoria),
    inscricao.tipo_deficiencia || '-',
    inscricao.nome_acompanhante || '-',
    inscricao.eventos.nome,
    inscricao.datas_eventos.map(d => formatDate(d)).join(', '),
    getStatusLabel(inscricao.status),
  ])

  // Cria a tabela
  autoTable(doc, {
    head: [['Protocolo', 'Nome', 'CPF', 'Categoria', 'Deficiência', 'Acompanhante', 'Evento', 'Dias', 'Status']],
    body: dados,
    startY: 40,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [14, 165, 233] }, // primary-600
    margin: { top: 40 },
  })

  // Rodapé com créditos DDV Technology
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.height
    const pageWidth = doc.internal.pageSize.width
    
    // Linha separadora
    doc.setDrawColor(200, 200, 200)
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)
    
    // Créditos
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.setFont('helvetica', 'normal')
    doc.text('Sistema desenvolvido por DDV Technology', pageWidth / 2, pageHeight - 8, { align: 'center' })
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' })
  }

  // Salva o PDF
  doc.save(`${nomeArquivo}.pdf`)
}

export function exportEventoPDF(
  evento: Evento,
  inscricoes: InscricaoComEvento[]
) {
  const doc = new jsPDF('p', 'mm', 'a4') // portrait, mm, A4

  // Cabeçalho
  doc.setFontSize(20)
  doc.text('Camarote da Acessibilidade', 105, 20, { align: 'center' })
  
  doc.setFontSize(16)
  doc.text(evento.nome, 105, 30, { align: 'center' })
  
  doc.setFontSize(12)
  doc.text('Lista de Inscritos', 105, 38, { align: 'center' })

  // Informações do evento
  doc.setFontSize(10)
  let yPos = 48
  doc.text(`Período: ${formatDate(evento.data_inicio)} até ${formatDate(evento.data_fim)}`, 14, yPos)
  yPos += 6
  doc.text(`Total de inscritos: ${inscricoes.length}`, 14, yPos)
  yPos += 6
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, yPos)
  yPos += 10

  // Agrupa por status
  const confirmados = inscricoes.filter((i) => i.status === 'confirmado')
  const pendentes = inscricoes.filter((i) => i.status === 'pendente')

  // Tabela de confirmados
  if (confirmados.length > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Inscrições Confirmadas (${confirmados.length})`, 14, yPos)
    yPos += 8

    const dadosConfirmados = confirmados.map((inscricao, index) => [
      String(index + 1),
      inscricao.nome_completo,
      formatCPF(inscricao.cpf),
      getCategoriaLabel(inscricao.categoria),
      inscricao.nome_acompanhante || '-',
      inscricao.datas_eventos.map(d => formatDate(d)).join(', '),
      inscricao.protocolo,
    ])

    autoTable(doc, {
      head: [['#', 'Nome', 'CPF', 'Categoria', 'Acompanhante', 'Dias', 'Protocolo']],
      body: dadosConfirmados,
      startY: yPos,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] }, // green-500
    })

    yPos = (doc as any).lastAutoTable.finalY + 10
  }

  // Tabela de pendentes
  if (pendentes.length > 0) {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Inscrições Pendentes (${pendentes.length})`, 14, yPos)
    yPos += 8

    const dadosPendentes = pendentes.map((inscricao, index) => [
      String(index + 1),
      inscricao.nome_completo,
      formatCPF(inscricao.cpf),
      getCategoriaLabel(inscricao.categoria),
      inscricao.nome_acompanhante || '-',
      inscricao.datas_eventos.map(d => formatDate(d)).join(', '),
      inscricao.protocolo,
    ])

    autoTable(doc, {
      head: [['#', 'Nome', 'CPF', 'Categoria', 'Acompanhante', 'Dias', 'Protocolo']],
      body: dadosPendentes,
      startY: yPos,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [234, 179, 8] }, // yellow-500
    })
  }

  // Rodapé com créditos DDV Technology
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.height
    
    // Linha separadora
    doc.setDrawColor(200, 200, 200)
    doc.line(14, pageHeight - 15, 196, pageHeight - 15)
    
    // Créditos
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.setFont('helvetica', 'normal')
    doc.text('Sistema desenvolvido por DDV Technology', 105, pageHeight - 8, { align: 'center' })
    doc.text(`Página ${i} de ${pageCount}`, 105, pageHeight - 3, { align: 'center' })
  }

  // Salva o PDF
  const nomeArquivo = evento.nome.replace(/\s+/g, '_')
  doc.save(`${nomeArquivo}.pdf`)
}

export function printListaPresenca(
  evento: Evento,
  inscricoes: InscricaoComEvento[],
  diaSelecionado?: string
) {
  const doc = new jsPDF('l', 'mm', 'a4') // landscape, mm, A4
  
  // Margens: 10mm de cada lado = 277mm disponível
  const marginLeft = 10
  const marginRight = 10
  const marginTop = 10
  const pageWidth = 297
  const pageHeight = 210
  const availableWidth = pageWidth - marginLeft - marginRight // 277mm

  // Cabeçalho com gradiente (simulado)
  doc.setFillColor(14, 165, 233) // primary-600
  doc.rect(0, 0, pageWidth, 18, 'F')
  
  // Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Lista de Presença', pageWidth / 2, 12, { align: 'center' })
  
  doc.setFontSize(12)
  // Truncar nome do evento se muito longo
  const nomeEvento = evento.nome.length > 50 ? evento.nome.substring(0, 47) + '...' : evento.nome
  doc.text(nomeEvento, pageWidth / 2, 18, { align: 'center' })
  
  if (diaSelecionado) {
    doc.setFontSize(10)
    doc.text(formatDate(diaSelecionado), pageWidth / 2, 24, { align: 'center' })
  }

  // Informações gerais
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  let startY = 30
  if (diaSelecionado) {
    startY = 32
  }

  // Filtrar confirmados
  let confirmados = inscricoes.filter((i) => i.status === 'confirmado')
  
  // Se tem dia selecionado, filtrar por dia
  if (diaSelecionado) {
    confirmados = confirmados.filter((i) => i.datas_eventos.includes(diaSelecionado))
  }

  doc.text(`Total de participantes: ${confirmados.length}`, marginLeft, startY)
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, marginLeft, startY + 5)

  if (confirmados.length === 0) {
    doc.setFontSize(10)
    doc.text('Nenhuma inscrição confirmada.', marginLeft, startY + 12)
  } else {
    // Tabela com espaço para assinatura (formato paisagem)
    // Ajustar larguras para caber em 277mm (considerando margens de 10mm cada lado)
    const dados = confirmados.map((inscricao, index) => [
      String(index + 1),
      inscricao.nome_completo, // Deixar quebrar naturalmente
      formatCPF(inscricao.cpf),
      getCategoriaLabel(inscricao.categoria),
      inscricao.protocolo,
      inscricao.nome_acompanhante || '-',
      '', // Coluna de assinatura (vazia)
    ])

    autoTable(doc, {
      head: [['#', 'Nome', 'CPF', 'Categoria', 'Protocolo', 'Acompanhante', 'Assinatura']],
      body: dados,
      startY: startY + 10,
      margin: { left: marginLeft, right: marginRight },
      styles: { 
        fontSize: 7.5, 
        cellPadding: 1,
        overflow: 'linebreak',
        cellWidth: 'auto'
      },
      headStyles: { 
        fillColor: [14, 165, 233],
        fontSize: 7.5,
        fontStyle: 'bold',
        textColor: [255, 255, 255]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' }, // #
        1: { cellWidth: 50, halign: 'left' }, // Nome
        2: { cellWidth: 28, halign: 'center' }, // CPF
        3: { cellWidth: 33, halign: 'left' }, // Categoria
        4: { cellWidth: 32, halign: 'center' }, // Protocolo
        5: { cellWidth: 45, halign: 'left' }, // Acompanhante
        6: { cellWidth: 45, halign: 'left' }, // Assinatura
      },
      // Garantir que a tabela não ultrapasse as margens
      tableWidth: availableWidth,
    })
  }

  // Rodapé com créditos DDV Technology
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.height
    const pageWidth = doc.internal.pageSize.width
    
    // Linha separadora (respeitando margens)
    doc.setDrawColor(200, 200, 200)
    doc.line(marginLeft, pageHeight - 12, pageWidth - marginRight, pageHeight - 12)
    
    // Créditos
    doc.setFontSize(7)
    doc.setTextColor(128, 128, 128)
    doc.setFont('helvetica', 'normal')
    doc.text('Sistema desenvolvido por DDV Technology', pageWidth / 2, pageHeight - 6, { align: 'center' })
    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 2, { align: 'center' })
  }

  // Abre o diálogo de impressão
  doc.autoPrint()
  window.open(doc.output('bloburl'), '_blank')
}

