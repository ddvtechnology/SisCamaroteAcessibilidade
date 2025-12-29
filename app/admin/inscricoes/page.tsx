'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Inscricao, Evento } from '@/types'
import { formatDate, formatCPF, formatPhone, getStatusColor, getStatusLabel, getCategoriaLabel, getCategoriaColor } from '@/lib/utils'
import { Users, Search, CheckCircle, XCircle, FileSpreadsheet, FileText, Eye, Edit, Printer } from 'lucide-react'
import { exportToExcel, exportToPDF } from '@/lib/export'
import Link from 'next/link'

type InscricaoComEvento = Inscricao & {
  eventos: Evento
}

export default function InscricoesPage() {
  const [inscricoes, setInscricoes] = useState<InscricaoComEvento[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [eventoFilter, setEventoFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    loadEventos()
    loadInscricoes()
  }, [])

  const loadEventos = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEventos(data || [])
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
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
        .order('created_at', { ascending: false })

      if (error) throw error
      setInscricoes(data || [])
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('inscricoes')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      loadInscricoes()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status da inscrição')
    }
  }

  const updateMultipleStatus = async (status: string) => {
    if (selectedIds.size === 0) {
      alert('Selecione pelo menos uma inscrição')
      return
    }

    const confirmMsg = status === 'confirmado' 
      ? `Confirmar ${selectedIds.size} inscrição(ões)?`
      : `Indeferir ${selectedIds.size} inscrição(ões)?`

    if (!confirm(confirmMsg)) return

    try {
      const { error } = await supabase
        .from('inscricoes')
        .update({ status })
        .in('id', Array.from(selectedIds))

      if (error) throw error
      
      setSelectedIds(new Set())
      setSelectAll(false)
      loadInscricoes()
      alert(`${selectedIds.size} inscrição(ões) atualizada(s) com sucesso!`)
    } catch (error) {
      console.error('Erro ao atualizar inscrições:', error)
      alert('Erro ao atualizar inscrições em lote')
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
    setSelectAll(newSelected.size === inscricoesFiltradas.length)
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set())
      setSelectAll(false)
    } else {
      const allIds = inscricoesFiltradas.map(i => i.id)
      setSelectedIds(new Set(allIds))
      setSelectAll(true)
    }
  }

  const handleExportExcel = () => {
    const nomeArquivo = eventoFilter
      ? `inscricoes_${eventos.find((e) => e.id === eventoFilter)?.nome.replace(/\s+/g, '_')}`
      : 'inscricoes'
    
    exportToExcel(inscricoesFiltradas, nomeArquivo)
  }

  const handleExportPDF = () => {
    const titulo = eventoFilter
      ? `Inscrições - ${eventos.find((e) => e.id === eventoFilter)?.nome}`
      : 'Lista de Inscrições'
    
    const nomeArquivo = eventoFilter
      ? `inscricoes_${eventos.find((e) => e.id === eventoFilter)?.nome.replace(/\s+/g, '_')}`
      : 'inscricoes'
    
    exportToPDF(inscricoesFiltradas, nomeArquivo, titulo)
  }

  const inscricoesFiltradas = inscricoes.filter((inscricao) => {
    const matchSearch =
      !searchTerm ||
      inscricao.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.cpf.includes(searchTerm) ||
      inscricao.protocolo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchEvento = !eventoFilter || inscricao.evento_id === eventoFilter
    const matchStatus = !statusFilter || inscricao.status === statusFilter
    const matchCategoria = !categoriaFilter || inscricao.categoria === categoriaFilter

    return matchSearch && matchEvento && matchStatus && matchCategoria
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando inscrições...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inscrições</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Gerencie todas as inscrições do sistema
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportExcel}
            className="btn btn-secondary flex-1 sm:flex-none inline-flex items-center justify-center"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Excel</span>
            <span className="sm:hidden">XLS</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="btn btn-secondary flex-1 sm:flex-none inline-flex items-center justify-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            PDF
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou protocolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input flex-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Evento</label>
              <select
                value={eventoFilter}
                onChange={(e) => setEventoFilter(e.target.value)}
                className="input"
              >
                <option value="">Todos os eventos</option>
                {eventos.map((evento) => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Categoria</label>
              <select
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
                className="input"
              >
                <option value="">Todas as categorias</option>
                <option value="pcd">Pessoa com Deficiência</option>
                <option value="gestante">Gestante</option>
                <option value="idoso">Pessoa Idosa</option>
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="indeferido">Indeferido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="card mb-4 bg-blue-50 border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.size} inscrição(ões) selecionada(s)
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => updateMultipleStatus('confirmado')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Confirmar Selecionadas</span>
                <span className="sm:hidden">Confirmar</span>
              </button>
              <button
                onClick={() => updateMultipleStatus('indeferido')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Indeferir Selecionadas</span>
                <span className="sm:hidden">Indeferir</span>
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Limpar Seleção
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
          <span>
            Exibindo <strong>{inscricoesFiltradas.length}</strong> de{' '}
            <strong>{inscricoes.length}</strong> inscrições
          </span>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Pendente: {inscricoes.filter((i) => i.status === 'pendente').length}
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Confirmado: {inscricoes.filter((i) => i.status === 'confirmado').length}
            </span>
          </div>
        </div>
      </div>

      {inscricoesFiltradas.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma inscrição encontrada
          </h3>
          <p className="text-gray-600">
            {searchTerm || eventoFilter || statusFilter || categoriaFilter
              ? 'Tente ajustar os filtros de busca'
              : 'Não há inscrições cadastradas ainda'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card bg-gray-50">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Selecionar todas ({inscricoesFiltradas.length})
              </span>
            </label>
          </div>

          {inscricoesFiltradas.map((inscricao) => (
            <div key={inscricao.id} className="card card-responsive hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
                <input
                  type="checkbox"
                  checked={selectedIds.has(inscricao.id)}
                  onChange={() => toggleSelect(inscricao.id)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0 overflow-hidden w-full max-w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start w-full mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-wrap">
                        {inscricao.nome_completo}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`badge ${getCategoriaColor(inscricao.categoria)} flex-shrink-0`}>
                          {getCategoriaLabel(inscricao.categoria)}
                        </span>
                        <span className={`badge ${getStatusColor(inscricao.status)} flex-shrink-0`}>
                          {getStatusLabel(inscricao.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-shrink-0">
                      <Link href={`/admin/inscricoes/detalhes/${inscricao.id}`} title="Visualizar Detalhes" className="btn btn-sm btn-ghost">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/inscricoes/editar/${inscricao.id}`} title="Editar Inscrição" className="btn btn-sm btn-ghost">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link href={`/inscricao/${inscricao.id}/confirmacao`} title="Reimprimir Confirmação" target="_blank" className="btn btn-sm btn-ghost">
                        <Printer className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  
                  
                  <p className="text-sm text-gray-600 mb-1 text-wrap">
                    <strong>Evento:</strong> {inscricao.eventos.nome}
                  </p>
                  <p className="text-sm text-gray-600 mb-1 text-wrap">
                    <strong>Dias:</strong> {inscricao.datas_eventos.map(d => formatDate(d)).join(', ')}
                  </p>
                  <p className="text-sm text-gray-600 mb-3 text-wrap">
                    <strong>Protocolo:</strong> <span className="font-mono text-primary-600 text-sm sm:text-base">{inscricao.protocolo}</span>
                    <span className="hidden sm:inline"> | </span>
                    <span className="block sm:inline"><strong> Senha:</strong> <span className="font-mono text-primary-600 text-sm sm:text-base">{inscricao.senha}</span></span>
                  </p>

                  <div className="border-t pt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="min-w-0 max-w-full">
                      <span className="font-medium text-gray-700">CPF:</span>
                      <p className="text-gray-600 text-wrap">{formatCPF(inscricao.cpf)}</p>
                    </div>
                    <div className="min-w-0 max-w-full">
                      <span className="font-medium text-gray-700">Telefone:</span>
                      <p className="text-gray-600 text-wrap">{formatPhone(inscricao.telefone)}</p>
                    </div>
                    {inscricao.categoria === 'pcd' && inscricao.tipo_deficiencia && (
                      <div className="min-w-0 max-w-full">
                        <span className="font-medium text-gray-700">Tipo de Deficiência:</span>
                        <p className="text-gray-600 text-wrap">{inscricao.tipo_deficiencia}</p>
                      </div>
                    )}
                  </div>

                  {inscricao.nome_acompanhante && (
                    <div className="border-t mt-3 pt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Acompanhante:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="min-w-0 max-w-full">
                          <span className="font-medium text-gray-700">Nome:</span>
                          <p className="text-gray-600 text-wrap">{inscricao.nome_acompanhante}</p>
                        </div>
                        <div className="min-w-0 max-w-full">
                          <span className="font-medium text-gray-700">CPF:</span>
                          <p className="text-gray-600 text-wrap">
                            {inscricao.cpf_acompanhante
                              ? formatCPF(inscricao.cpf_acompanhante)
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {inscricao.observacoes && (
                    <div className="border-t mt-3 pt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Observações:
                      </p>
                      <p className="text-sm text-gray-600 text-wrap">{inscricao.observacoes}</p>
                    </div>
                  )}

                  <div className="border-t mt-3 pt-3 text-xs text-gray-500">
                    <p>
                      Inscrito em: {new Date(inscricao.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {inscricao.status === 'pendente' && (
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <button
                      onClick={() => updateStatus(inscricao.id, 'confirmado')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Confirmar"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateStatus(inscricao.id, 'indeferido')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Indeferir"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
