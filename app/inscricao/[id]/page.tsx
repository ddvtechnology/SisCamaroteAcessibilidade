'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Evento } from '@/types'
import { formatDate, formatCPF, validateCPF } from '@/lib/utils'
import { Calendar, Users, AlertCircle, Heart, UserCheck, Baby } from 'lucide-react'
import Footer from '@/components/Footer'

export default function InscricaoPublicaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [evento, setEvento] = useState<Evento | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([])
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([])
  const [vagasPorDia, setVagasPorDia] = useState<Record<string, number>>({})

  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    endereco: '',
    telefone: '',
    categoria: 'pcd' as 'pcd' | 'gestante' | 'idoso',
    tipo_deficiencia: '',
    observacoes: '',
    nome_acompanhante: '',
    cpf_acompanhante: '',
  })

  useEffect(() => {
    loadEvento()
  }, [])

  const loadEvento = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', params.id)
        .eq('ativo', true)
        .single()

      if (error) throw error

      if (!data) {
        setError('Evento não encontrado ou não está mais disponível')
        setLoading(false)
        return
      }

      setEvento(data)

      // Timezone-safe date range generation
      const dias = []
      // Adiciona +00:00 para garantir que a data seja interpretada como UTC, e não local.
      const inicio = new Date(`${data.data_inicio}T00:00:00`)
      const fim = new Date(`${data.data_fim}T00:00:00`)

      let diaAtual = new Date(inicio)

      while (diaAtual <= fim) {
        // Converte para YYYY-MM-DD no fuso UTC
        const ano = diaAtual.getUTCFullYear();
        const mes = String(diaAtual.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(diaAtual.getUTCDate()).padStart(2, '0');
        dias.push(`${ano}-${mes}-${dia}`);
        
        // Adiciona um dia em UTC para evitar problemas com horário de verão
        diaAtual.setUTCDate(diaAtual.getUTCDate() + 1)
      }
      
      setDiasDisponiveis(dias)
      await loadVagasPorDia(dias, data.limite_vagas_por_dia)
    } catch (error) {
      console.error('Erro ao carregar evento:', error)
      setError('Erro ao carregar informações do evento')
    } finally {
      setLoading(false)
    }
  }

  const loadVagasPorDia = async (dias: string[], limite: number) => {
    const vagas: Record<string, number> = {}
    
    for (const dia of dias) {
      const { count } = await supabase
        .from('inscricoes')
        .select('*', { count: 'exact', head: true })
        .eq('evento_id', params.id)
        .contains('datas_eventos', [dia])
        .in('status', ['pendente', 'confirmado'])

      vagas[dia] = Math.max(0, limite - (count || 0))
    }
    
    setVagasPorDia(vagas)
  }

  const toggleDia = (dia: string) => {
    if (vagasPorDia[dia] <= 0) return
    
    setDiasSelecionados(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (diasSelecionados.length === 0) {
      setError('Selecione pelo menos um dia')
      return
    }

    if (!validateCPF(formData.cpf)) {
      setError('CPF inválido')
      return
    }

    if (formData.categoria === 'pcd' && !formData.tipo_deficiencia) {
      setError('Informe o tipo de deficiência')
      return
    }

    if (evento?.permite_acompanhante && formData.nome_acompanhante && formData.cpf_acompanhante) {
      if (!validateCPF(formData.cpf_acompanhante)) {
        setError('CPF do acompanhante inválido')
        return
      }
    }

    setSubmitting(true)

    try {
      const { data, error: insertError } = await supabase
        .from('inscricoes')
        .insert({
          evento_id: params.id,
          datas_eventos: diasSelecionados,
          nome_completo: formData.nome_completo,
          cpf: formData.cpf.replace(/\D/g, ''),
          endereco: formData.endereco,
          telefone: formData.telefone,
          categoria: formData.categoria,
          tipo_deficiencia: formData.categoria === 'pcd' ? formData.tipo_deficiencia : null,
          observacoes: formData.observacoes || null,
          nome_acompanhante: formData.nome_acompanhante || null,
          cpf_acompanhante: formData.cpf_acompanhante ? formData.cpf_acompanhante.replace(/\D/g, '') : null,
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/inscricao/${data.id}/confirmacao?protocolo=${data.protocolo}&senha=${data.senha}&eventoId=${params.id}`)
    } catch (error: any) {
      console.error('Erro ao criar inscrição:', error)
      setError(error.message || 'Erro ao realizar inscrição. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error && !evento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Evento Indisponível
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a href="/" className="btn btn-primary inline-block">
            Voltar para Página Inicial
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com design melhorado */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-t-4 border-blue-600">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {evento?.nome}
            </h1>
            <p className="text-lg text-gray-600">{evento?.descricao}</p>
          </div>

          {evento?.texto_institucional && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 mb-6">
              <p className="text-sm text-blue-900 whitespace-pre-wrap">
                {evento.texto_institucional}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <Calendar className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600">Período do Evento</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(evento?.data_inicio || '')} até {formatDate(evento?.data_fim || '')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <Users className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600">Acompanhantes</p>
                <p className="text-lg font-bold text-gray-900">
                  {evento?.permite_acompanhante
                    ? `Permitido (até ${evento.max_acompanhantes})`
                    : 'Não permitido'}
                </p>
              </div>
            </div>
          </div>

          {evento?.orientacoes && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-4">
              <p className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Orientações Importantes
              </p>
              <p className="text-sm text-yellow-700 whitespace-pre-wrap">
                {evento.orientacoes}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <UserCheck className="w-8 h-8 mr-3 text-blue-600" />
            Formulário de Inscrição
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Seleção de dias */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Calendar className="w-5 h-5 inline mr-2" />
                Selecione os Dias que Deseja Participar *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {diasDisponiveis.map((dia) => {
                  const temVagas = vagasPorDia[dia] > 0
                  const selecionado = diasSelecionados.includes(dia)
                  
                  return (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDia(dia)}
                      disabled={!temVagas}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selecionado
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md transform scale-105'
                          : temVagas
                          ? 'border-gray-300 bg-white hover:border-blue-400 hover:shadow'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-bold text-sm mb-1">{formatDate(dia)}</p>
                        <p className="text-xs">
                          {temVagas ? `${vagasPorDia[dia]} vagas` : 'Esgotado'}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
              {diasSelecionados.length > 0 && (
                <p className="mt-4 text-sm text-blue-700 font-medium">
                  ✓ {diasSelecionados.length} dia(s) selecionado(s)
                </p>
              )}
            </div>

            {/* Categoria */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Categoria *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, categoria: 'pcd' }))}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    formData.categoria === 'pcd'
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-blue-400'
                  }`}
                >
                  <Heart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-bold text-center">Pessoa com Deficiência</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, categoria: 'gestante' }))}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    formData.categoria === 'gestante'
                      ? 'border-pink-600 bg-pink-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-pink-400'
                  }`}
                >
                  <Baby className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                  <p className="font-bold text-center">Gestante</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, categoria: 'idoso' }))}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    formData.categoria === 'idoso'
                      ? 'border-purple-600 bg-purple-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-purple-400'
                  }`}
                >
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-bold text-center">Pessoa Idosa (60+)</p>
                </button>
              </div>
            </div>

            {/* Dados pessoais */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 pb-3 border-b-2 border-gray-200">
                Dados Pessoais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="nome_completo" className="label">
                    Nome Completo *
                  </label>
                  <input
                    id="nome_completo"
                    name="nome_completo"
                    type="text"
                    value={formData.nome_completo}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cpf" className="label">
                    CPF *
                  </label>
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="input"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="label">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="input"
                    placeholder="(00) 00000-0000"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Informe seu melhor número de contato
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="endereco" className="label">
                    Endereço Completo *
                  </label>
                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="input"
                    placeholder="Rua, número, bairro, cidade"
                    required
                  />
                </div>
              </div>

              {formData.categoria === 'pcd' && (
                <div>
                  <label htmlFor="tipo_deficiencia" className="label">
                    Tipo de Deficiência *
                  </label>
                  <select
                    id="tipo_deficiencia"
                    name="tipo_deficiencia"
                    value={formData.tipo_deficiencia}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Física">Deficiência Física</option>
                    <option value="Visual">Deficiência Visual</option>
                    <option value="Auditiva">Deficiência Auditiva</option>
                    <option value="Intelectual">Deficiência Intelectual</option>
                    <option value="Múltipla">Deficiência Múltipla</option>
                    <option value="TEA">TEA (Transtorno do Espectro Autista)</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="observacoes" className="label">
                  Observações / Informações Adicionais
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  className="input"
                  rows={3}
                  placeholder="Informações importantes sobre suas necessidades específicas"
                />
              </div>
            </div>

            {/* Acompanhante */}
            {evento?.permite_acompanhante && (
              <div className="p-6 bg-purple-50 rounded-xl space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  <Users className="w-6 h-6 inline mr-2" />
                  Dados do Acompanhante (Opcional)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome_acompanhante" className="label">
                      Nome Completo do Acompanhante
                    </label>
                    <input
                      id="nome_acompanhante"
                      name="nome_acompanhante"
                      type="text"
                      value={formData.nome_acompanhante}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="cpf_acompanhante" className="label">
                      CPF do Acompanhante
                    </label>
                    <input
                      id="cpf_acompanhante"
                      name="cpf_acompanhante"
                      type="text"
                      value={formData.cpf_acompanhante}
                      onChange={handleChange}
                      className="input"
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botão de envio */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-lg disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Confirmar Inscrição'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}
