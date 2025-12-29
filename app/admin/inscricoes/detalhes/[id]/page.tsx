
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Inscricao, Evento } from '@/types'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Calendar, MapPin, Phone, CreditCard, Users, Info, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { formatDate, formatCPF, formatPhone, getStatusLabel, getStatusColor, getCategoriaLabel, getCategoriaColor } from '@/lib/utils'

type InscricaoComEvento = Inscricao & {
  eventos: Evento
}

const DetailField = ({ label, value, icon, className }: { label: string, value: React.ReactNode, icon?: React.ReactNode, className?: string }) => (
  <div className={`flex flex-col ${className}`}>
    <div className="flex items-center text-sm font-medium text-gray-500">
      {icon}
      <span className="ml-2">{label}</span>
    </div>
    <p className="mt-1 text-base text-gray-900">{value || '-'}</p>
  </div>
)

export default function InscricaoDetalhesPage() {
  const { id } = useParams()
  const [inscricao, setInscricao] = useState<InscricaoComEvento | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const fetchInscricao = async () => {
        try {
          const { data, error } = await supabase
            .from('inscricoes')
            .select(`
              *,
              eventos (*)
            `)
            .eq('id', id)
            .single()

          if (error || !data) {
            throw error || new Error('Inscrição não encontrada')
          }
          
          setInscricao(data as InscricaoComEvento)
        } catch (error) {
          console.error('Erro ao carregar inscrição:', error)
          setInscricao(null)
        } finally {
          setLoading(false)
        }
      }
      fetchInscricao()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes da inscrição...</p>
        </div>
      </div>
    )
  }

  if (!inscricao) {
    return notFound()
  }

  const statusLabel = getStatusLabel(inscricao.status)
  const statusColor = getStatusColor(inscricao.status)
  const categoriaLabel = getCategoriaLabel(inscricao.categoria)
  const categoriaColor = getCategoriaColor(inscricao.categoria)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/inscricoes" className="flex items-center text-sm text-primary-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a lista de inscrições
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{inscricao.nome_completo}</h1>
            <p className="text-gray-600 mt-1">Protocolo: <span className="font-mono text-primary-600">{inscricao.protocolo}</span></p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`badge ${categoriaColor}`}>{categoriaLabel}</span>
            <span className={`badge ${statusColor}`}>{statusLabel}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações do Evento */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Informações do Evento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailField label="Evento" value={inscricao.eventos.nome} icon={<Calendar />} />
              <DetailField label="Datas Selecionadas" value={inscricao.datas_eventos.map(d => formatDate(d)).join(', ')} icon={<Calendar />} />
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailField label="CPF" value={formatCPF(inscricao.cpf)} icon={<CreditCard />} />
              <DetailField label="Telefone" value={formatPhone(inscricao.telefone)} icon={<Phone />} />
              <DetailField label="Endereço Completo" value={inscricao.endereco} icon={<MapPin />} className="col-span-1 md:col-span-2" />
            </div>
          </div>

          {/* Categoria e Deficiência */}
          {inscricao.categoria === 'pcd' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Detalhes da Categoria</h2>
              <DetailField label="Tipo de Deficiência" value={inscricao.tipo_deficiencia} icon={<Info />} />
            </div>
          )}

          {/* Acompanhante */}
          {inscricao.nome_acompanhante && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Informações do Acompanhante</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailField label="Nome do Acompanhante" value={inscricao.nome_acompanhante} icon={<Users />} />
                <DetailField label="CPF do Acompanhante" value={inscricao.cpf_acompanhante ? formatCPF(inscricao.cpf_acompanhante) : 'Não informado'} icon={<CreditCard />} />
              </div>
            </div>
          )}

          {/* Observações */}
          {inscricao.observacoes && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">Observações</h2>
              <p className="text-base text-gray-800 bg-gray-50 p-4 rounded-lg border">{inscricao.observacoes}</p>
            </div>
          )}

        </div>
        
        <div className="p-6 border-t text-sm text-gray-500">
            Inscrito em: {new Date(inscricao.created_at).toLocaleString('pt-BR')}
        </div>
      </div>
    </div>
  )
}
