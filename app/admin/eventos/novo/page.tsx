'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NovoEventoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    limite_vagas_por_dia: '',
    permite_acompanhante: true,
    max_acompanhantes: '1',
    texto_institucional: '',
    orientacoes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('eventos').insert({
        nome: formData.nome,
        descricao: formData.descricao,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        limite_vagas_por_dia: parseInt(formData.limite_vagas_por_dia),
        permite_acompanhante: formData.permite_acompanhante,
        max_acompanhantes: parseInt(formData.max_acompanhantes),
        texto_institucional: formData.texto_institucional || null,
        orientacoes: formData.orientacoes || null,
        ativo: true,
      })

      if (error) throw error

      alert('Evento criado com sucesso!')
      router.push('/admin/eventos')
    } catch (error) {
      console.error('Erro ao criar evento:', error)
      alert('Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Novo Evento</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Preencha as informações do evento
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Informações Básicas
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="label">
                Nome do Evento *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                className="input"
                placeholder="Ex: São João 2025"
                required
              />
            </div>

            <div>
              <label htmlFor="descricao" className="label">
                Descrição *
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="input"
                rows={3}
                placeholder="Descreva o evento"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="data_inicio" className="label">
                  Data de Início *
                </label>
                <input
                  id="data_inicio"
                  name="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="data_fim" className="label">
                  Data de Término *
                </label>
                <input
                  id="data_fim"
                  name="data_fim"
                  type="date"
                  value={formData.data_fim}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Configurações de Vagas
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="limite_vagas_por_dia" className="label">
                Limite de Vagas por Dia *
              </label>
              <input
                id="limite_vagas_por_dia"
                name="limite_vagas_por_dia"
                type="number"
                value={formData.limite_vagas_por_dia}
                onChange={handleChange}
                className="input"
                min="1"
                placeholder="Ex: 100"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="permite_acompanhante"
                name="permite_acompanhante"
                type="checkbox"
                checked={formData.permite_acompanhante}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="permite_acompanhante"
                className="text-sm font-medium text-gray-700"
              >
                Permitir acompanhantes
              </label>
            </div>

            {formData.permite_acompanhante && (
              <div>
                <label htmlFor="max_acompanhantes" className="label">
                  Máximo de Acompanhantes por Inscrição
                </label>
                <input
                  id="max_acompanhantes"
                  name="max_acompanhantes"
                  type="number"
                  value={formData.max_acompanhantes}
                  onChange={handleChange}
                  className="input"
                  min="1"
                  max="5"
                />
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personalização da Página Pública
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="texto_institucional" className="label">
                Texto Institucional
              </label>
              <textarea
                id="texto_institucional"
                name="texto_institucional"
                value={formData.texto_institucional}
                onChange={handleChange}
                className="input"
                rows={3}
                placeholder="Texto que aparecerá no topo da página de inscrição"
              />
              <p className="text-sm text-gray-500 mt-1">
                Opcional - Será exibido no topo da página pública de inscrições
              </p>
            </div>

            <div>
              <label htmlFor="orientacoes" className="label">
                Orientações
              </label>
              <textarea
                id="orientacoes"
                name="orientacoes"
                value={formData.orientacoes}
                onChange={handleChange}
                className="input"
                rows={3}
                placeholder="Orientações importantes para os participantes"
              />
              <p className="text-sm text-gray-500 mt-1">
                Opcional - Orientações e informações importantes
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <Link 
            href="/admin/eventos" 
            className="btn btn-secondary w-full sm:w-auto text-center"
          >
            Cancelar
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center" 
            disabled={loading}
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Salvando...' : 'Criar Evento'}
          </button>
        </div>
      </form>
    </div>
  )
}

