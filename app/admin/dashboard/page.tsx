'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEventos: 0,
    eventosAtivos: 0,
    totalInscricoes: 0,
    inscricoesPendentes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Total de eventos
      const { count: totalEventos } = await supabase
        .from('eventos')
        .select('*', { count: 'exact', head: true })

      // Eventos ativos
      const { count: eventosAtivos } = await supabase
        .from('eventos')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true)

      // Total de inscrições
      const { count: totalInscricoes } = await supabase
        .from('inscricoes')
        .select('*', { count: 'exact', head: true })

      // Inscrições pendentes
      const { count: inscricoesPendentes } = await supabase
        .from('inscricoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente')

      setStats({
        totalEventos: totalEventos || 0,
        eventosAtivos: eventosAtivos || 0,
        totalInscricoes: totalInscricoes || 0,
        inscricoesPendentes: inscricoesPendentes || 0,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total de Eventos',
      value: stats.totalEventos,
      icon: Calendar,
      color: 'bg-blue-500',
      link: '/admin/eventos',
    },
    {
      title: 'Eventos Ativos',
      value: stats.eventosAtivos,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/admin/eventos',
    },
    {
      title: 'Total de Inscrições',
      value: stats.totalInscricoes,
      icon: Users,
      color: 'bg-purple-500',
      link: '/admin/inscricoes',
    },
    {
      title: 'Inscrições Pendentes',
      value: stats.inscricoesPendentes,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/inscricoes',
    },
  ]

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao painel administrativo do Camarote da Acessibilidade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.link}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/eventos/novo"
              className="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Criar Novo Evento</p>
                  <p className="text-sm text-gray-600">
                    Adicione um novo evento ao sistema
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/inscricoes"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    Gerenciar Inscrições
                  </p>
                  <p className="text-sm text-gray-600">
                    Visualize e gerencie todas as inscrições
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sobre o Sistema
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Este sistema foi desenvolvido para gerenciar inscrições de pessoas
              com deficiência (PcD) e acompanhantes em eventos públicos.
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-2" />
                <p>Crie e gerencie eventos com facilidade</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-2" />
                <p>Controle de vagas por dia de evento</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-2" />
                <p>Geração automática de protocolo e senha</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-2" />
                <p>Exportação de listas em Excel e PDF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


