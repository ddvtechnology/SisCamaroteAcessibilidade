'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import { CheckCircle, Printer, Plus } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const inscricaoId = params.id as string
  const [protocolo, setProtocolo] = useState('')
  const [senha, setSenha] = useState('')
  const [eventoId, setEventoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const protocoloParam = searchParams.get('protocolo')
    const senhaParam = searchParams.get('senha')
    const eventoIdParam = searchParams.get('eventoId')

    if (protocoloParam && senhaParam && eventoIdParam) {
      setProtocolo(protocoloParam)
      setSenha(senhaParam)
      setEventoId(eventoIdParam)
      setLoading(false)
    } else if (inscricaoId) {
      const fetchInscricao = async () => {
        try {
          const { data, error } = await supabase
            .from('inscricoes')
            .select('protocolo, senha, evento_id')
            .eq('id', inscricaoId)
            .single()

          if (error || !data) {
            throw error || new Error('Inscrição não encontrada para reimpressão')
          }
          
          setProtocolo(data.protocolo)
          setSenha(data.senha)
          setEventoId(data.evento_id)
        } catch (err) {
          console.error('Erro ao buscar dados para reimpressão:', err)
        } finally {
          setLoading(false)
        }
      }
      fetchInscricao()
    } else {
        setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inscricaoId, searchParams])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
       <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando comprovante...</p>
        </div>
      </div>
    )
  }

  if (!protocolo || !senha) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50 text-center">
            <div>
                <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao Carregar Comprovante</h2>
                <p className="text-gray-700 mb-6">Não foi possível encontrar os dados da inscrição. Tente novamente ou contate o suporte.</p>
                <Link href="/" className="btn btn-primary">
                    Voltar para o Início
                </Link>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 print:bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center comprovante-print overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 mb-6 header-print">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3 shadow-lg icon-wrapper-print">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Inscrição Realizada com Sucesso!
            </h1>
            <p className="text-sm text-green-50">
              Sua inscrição foi registrada no sistema. Guarde bem o protocolo e a senha abaixo.
            </p>
          </div>

          <div className="px-6 content-print">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-4 shadow-sm">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    PROTOCOLO
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-wider protocolo-text">
                    {protocolo}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    SENHA DE ACESSO
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-widest senha-text">
                    {senha}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 mb-4 text-left aviso-text">
              <p className="text-xs font-semibold text-amber-800 mb-1.5 flex items-center">
                <span className="mr-1">⚠️</span> Importante
              </p>
              <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside leading-relaxed">
                <li>Anote ou fotografe o protocolo e a senha</li>
                <li>Você precisará apresentar estes dados no dia do evento</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 no-print-inside">
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center font-medium"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimir Comprovante
              </button>
              
              {eventoId && (
                <Link
                  href={`/inscricao/${eventoId}`}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Fazer Nova Inscrição
                </Link>
              )}
            </div>

            <div className="text-xs text-gray-500 border-t border-gray-200 pt-4 space-y-2 footer-print">
              <div>
                <p className="mb-1 font-semibold text-gray-700">
                  Dúvidas?
                </p>
                <p className="text-gray-600">
                  Entre em contato com a Secretaria Municipal de Assistência Social
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-[10px] text-gray-400">
                  Sistema desenvolvido por <span className="font-bold text-gray-600">DDV Technology</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center no-print">
          <p className="text-sm text-gray-600">
            Obrigado por utilizar o sistema do Camarote da Acessibilidade
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          
          /* Oculta tudo por padrão na impressão */
          body * {
            visibility: hidden;
          }
          
          /* Mostra apenas o comprovante e seus filhos */
          .comprovante-print, .comprovante-print * {
            visibility: visible;
          }
          
          /* Oculta elementos marcados para não imprimir dentro do comprovante */
          .comprovante-print .no-print-inside, .no-print {
            display: none !important;
          }
          
          .comprovante-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;      /* Largura de um A4 */
            height: auto;   /* Altura automática */
            display: flex;
            flex-direction: column;
            background: white;
            padding: 20mm; /* Adiciona margem */
            margin: 0;
            box-sizing: border-box; /* Garante que o padding não aumente a largura total */
            box-shadow: none !important;
            border: none !important;
          }
          
          .comprovante-print > div {
            margin: 0 !important;
          }

          .comprovante-print .header-print {
            padding: 6mm 10mm !important;
          }
          
          .comprovante-print .content-print {
            padding: 5mm 10mm !important;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            height: 100%;
          }
          
          .comprovante-print .footer-print {
            margin-top: auto; /* Empurra o rodapé para o final */
          }
          
          /* Ajustes finos de fontes e tamanhos para o espaço limitado */
          .comprovante-print h1 { font-size: 16pt !important; margin-bottom: 6pt !important; }
          .comprovante-print p { font-size: 9pt !important; line-height: 1.2; }
          .comprovante-print .protocolo-text { font-size: 18pt !important; }
          .comprovante-print .senha-text { font-size: 22pt !important; }
          .comprovante-print .aviso-text, .comprovante-print .aviso-text * { font-size: 7.5pt !important; line-height: 1.3 !important; }
          .comprovante-print .text-xs { font-size: 8pt !important; }
          .comprovante-print .text-\\[10px\\] { font-size: 7pt !important; }

          .comprovante-print .icon-wrapper-print {
            width: 32pt !important;
            height: 32pt !important;
            margin-bottom: 6pt !important;
          }
          
          .comprovante-print .icon-wrapper-print svg {
            width: 20pt !important;
            height: 20pt !important;
          }
        }
      `}</style>
    </div>
  )
}
