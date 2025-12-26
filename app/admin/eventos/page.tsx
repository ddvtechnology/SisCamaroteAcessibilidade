'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Evento } from '@/types'
import { formatDate } from '@/lib/utils'
import { Calendar, Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Users as UsersIcon } from 'lucide-react'
import Link from 'next/link'

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos')

  useEffect(() => {
    loadEventos()
  }, [])

  const loadEventos = async () => {
    try {
      let query = supabase
        .from('eventos')
        .select('*')
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      setEventos(data || [])
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAtivo = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('eventos')
        .update({ ativo: !ativo })
        .eq('id', id)

      if (error) throw error
      loadEventos()
    } catch (error) {
      console.error('Erro ao atualizar evento:', error)
      alert('Erro ao atualizar evento')
    }
  }

  const deleteEvento = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return

    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadEventos()
    } catch (error) {
      console.error('Erro ao excluir evento:', error)
      alert('Erro ao excluir evento')
    }
  }

  const eventosFiltrados = eventos.filter((evento) => {
    if (filter === 'ativos') return evento.ativo
    if (filter === 'inativos') return !evento.ativo
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando eventos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Gerencie os eventos do Camarote da Acessibilidade
          </p>
        </div>
        <Link 
          href="/admin/eventos/novo" 
          className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Evento
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => setFilter('todos')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              filter === 'todos'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({eventos.length})
          </button>
          <button
            onClick={() => setFilter('ativos')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              filter === 'ativos'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ativos ({eventos.filter((e) => e.ativo).length})
          </button>
          <button
            onClick={() => setFilter('inativos')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              filter === 'inativos'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Inativos ({eventos.filter((e) => !e.ativo).length})
          </button>
        </div>
      </div>

      {eventosFiltrados.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum evento encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'todos'
              ? 'Comece criando seu primeiro evento'
              : `Nenhum evento ${filter === 'ativos' ? 'ativo' : 'inativo'} no momento`}
          </p>
          {filter === 'todos' && (
            <Link 
              href="/admin/eventos/novo" 
              className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Evento
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {eventosFiltrados.map((evento) => (
            <div key={evento.id} className="card card-responsive">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 w-full">
                <div className="flex-1 min-w-0 overflow-hidden w-full max-w-full">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-wrap">
                      {evento.nome}
                    </h3>
                    <span
                      className={`badge flex-shrink-0 ${
                        evento.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {evento.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 text-wrap">{evento.descricao}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="min-w-0 max-w-full">
                      <span className="font-medium text-gray-700">Período:</span>
                      <p className="text-gray-600 text-wrap">
                        {formatDate(evento.data_inicio)} até {formatDate(evento.data_fim)}
                      </p>
                    </div>
                    <div className="min-w-0 max-w-full">
                      <span className="font-medium text-gray-700">
                        Vagas por dia:
                      </span>
                      <p className="text-gray-600 text-wrap">{evento.limite_vagas_por_dia}</p>
                    </div>
                    <div className="min-w-0 max-w-full">
                      <span className="font-medium text-gray-700">
                        Acompanhantes:
                      </span>
                      <p className="text-gray-600 text-wrap">
                        {evento.permite_acompanhante
                          ? `Até ${evento.max_acompanhantes}`
                          : 'Não permitido'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-2 mt-4 sm:mt-0 sm:ml-4">
                  <Link
                    href={`/admin/eventos/detalhes/${evento.id}`}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Ver inscrições"
                  >
                    <UsersIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/inscricao/${evento.id}`}
                    target="_blank"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver página pública"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/admin/eventos/editar/${evento.id}`}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => toggleAtivo(evento.id, evento.ativo)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title={evento.ativo ? 'Desativar' : 'Ativar'}
                  >
                    {evento.ativo ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteEvento(evento.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

