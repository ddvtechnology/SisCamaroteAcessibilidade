'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Evento, Inscricao } from '@/types'
import { formatDate, getStatusColor, getStatusLabel, getCategoriaLabel, getCategoriaColor } from '@/lib/utils'
import { exportEventoPDF, printListaPresenca } from '@/lib/export'
import { ArrowLeft, Download, Printer, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

type InscricaoComEvento = Inscricao & {
  eventos: Evento
}

export default function DetalhesEventoPage({ params }: { params: { id: string } }) {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [inscricoes, setInscricoes] = useState<InscricaoComEvento[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSelecionada, setDataSelecionada] = useState<string>('')
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([])

  useEffect(() => {
    loadEvento()
    loadInscricoes()
  }, [])

  useEffect(() => {
    if (evento) {
      const dias = []
      const inicio = new Date(evento.data_inicio)
      const fim = new Date(evento.data_fim)
      
      for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
        dias.push(new Date(d).toISOString().split('T')[0])
      }
      
      setDiasDisponiveis(dias)
      if (dias.length > 0 && !dataSelecionada) setDataSelecionada('')
    }
  }, [evento])

  const loadEvento = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setEvento(data)
    } catch (error) {
      console.error('Erro ao carregar evento:', error)
    }
  }

  const loadInscricoes = async () => {
    try {
      const { data, error } = await supabase
        .from('inscricoes')
        .select(`
          *,
          eventos (*)
        `)
        .eq('evento_id', params.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInscricoes(data || [])
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error)
    } finally {
      setLoading(false)
    }
  }

  const inscricoesFiltradas = dataSelecionada
    ? inscricoes.filter((i) => i.datas_eventos.includes(dataSelecionada))
    : inscricoes

  const stats = {
    total: inscricoes.length,
    confirmados: inscricoes.filter((i) => i.status === 'confirmado').length,
    pendentes: inscricoes.filter((i) => i.status === 'pendente').length,
    filtrados: inscricoesFiltradas.length,
    confirmadosFiltrados: inscricoesFiltradas.filter((i) => i.status === 'confirmado').length,
  }

  const handleExportPDF = () => {
    if (!evento) return
    exportEventoPDF(evento, inscricoesFiltradas)
  }

  const handlePrintPresenca = () => {
    if (!evento) return
    printListaPresenca(evento, inscricoesFiltradas, dataSelecionada || undefined)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/eventos"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para eventos
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{evento?.nome}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {evento && `${formatDate(evento.data_inicio)} até ${formatDate(evento.data_fim)}`}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={handleExportPDF} 
              className="btn btn-secondary flex-1 sm:flex-none inline-flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button 
              onClick={handlePrintPresenca} 
              className="btn btn-primary flex-1 sm:flex-none inline-flex items-center justify-center"
            >
              <Printer className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Lista de Presença</span>
              <span className="sm:hidden">Presença</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Inscrições</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmados</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmados}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visualizando</p>
              <p className="text-2xl font-bold text-primary-600">{stats.filtrados}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <label className="label">Filtrar por Dia do Evento</label>
        <select
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">Todos os dias</option>
          {diasDisponiveis.map((dia) => {
            const inscritosNoDia = inscricoes.filter((i) => i.datas_eventos.includes(dia)).length
            const confirmadosNoDia = inscricoes.filter((i) => i.datas_eventos.includes(dia) && i.status === 'confirmado').length
            return (
              <option key={dia} value={dia}>
                {formatDate(dia)} - {inscritosNoDia} inscritos ({confirmadosNoDia} confirmados)
              </option>
            )
          })}
        </select>
      </div>

      {inscricoesFiltradas.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma inscrição encontrada
          </h3>
          <p className="text-gray-600">
            Não há inscrições {dataSelecionada ? 'para este dia' : 'para este evento'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inscricoesFiltradas.map((inscricao) => (
            <div key={inscricao.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {inscricao.nome_completo}
                    </h3>
                    <span className={`badge ${getCategoriaColor(inscricao.categoria)}`}>
                      {getCategoriaLabel(inscricao.categoria)}
                    </span>
                    <span className={`badge ${getStatusColor(inscricao.status)}`}>
                      {getStatusLabel(inscricao.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-gray-700">Protocolo:</span>
                      <p className="text-gray-600">{inscricao.protocolo}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Senha:</span>
                      <p className="text-gray-600">{inscricao.senha}</p>
                    </div>
                    {inscricao.categoria === 'pcd' && inscricao.tipo_deficiencia && (
                      <div>
                        <span className="font-medium text-gray-700">Deficiência:</span>
                        <p className="text-gray-600">{inscricao.tipo_deficiencia}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Dias selecionados:</span>
                    <p className="text-gray-600">{inscricao.datas_eventos.map(d => formatDate(d)).join(', ')}</p>
                  </div>
                  {inscricao.nome_acompanhante && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-700">Acompanhante:</span>
                      <span className="text-gray-600 ml-2">{inscricao.nome_acompanhante}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
