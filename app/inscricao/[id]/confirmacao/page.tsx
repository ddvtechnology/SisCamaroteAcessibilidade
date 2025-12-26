'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import { CheckCircle, Printer, Plus } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const eventoId = params.id as string
  const [protocolo, setProtocolo] = useState('')
  const [senha, setSenha] = useState('')

  useEffect(() => {
    const protocoloParam = searchParams.get('protocolo')
    const senhaParam = searchParams.get('senha')
    
    if (protocoloParam) setProtocolo(protocoloParam)
    if (senhaParam) setSenha(senhaParam)
  }, [searchParams])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center comprovante-print overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3 shadow-lg">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Inscrição Realizada com Sucesso!
            </h1>
            <p className="text-sm text-green-50">
              Sua inscrição foi registrada no sistema. Guarde bem o protocolo e a senha abaixo.
            </p>
          </div>

          <div className="px-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-4 shadow-sm">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    PROTOCOLO
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-wider">
                    {protocolo}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    SENHA DE ACESSO
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-widest">
                    {senha}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 mb-4 text-left">
              <p className="text-xs font-semibold text-amber-800 mb-1.5 flex items-center">
                <span className="mr-1">⚠️</span> Importante
              </p>
              <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside leading-relaxed">
                <li>Anote ou fotografe o protocolo e a senha</li>
                <li>Você precisará apresentar estes dados no dia do evento</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center font-medium"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimir Comprovante
              </button>
              
              <Link
                href={`/inscricao/${eventoId}`}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Fazer Nova Inscrição
              </Link>
            </div>

            <div className="text-xs text-gray-500 border-t border-gray-200 pt-4 space-y-2">
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
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          body * {
            visibility: hidden;
          }
          
          .comprovante-print, .comprovante-print * {
            visibility: visible;
          }
          
          .comprovante-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm; /* Largura completa A4 */
            height: 148.5mm; /* Exatamente metade da altura A4 (297mm / 2 = 148.5mm) */
            padding: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-after: always;
            page-break-inside: avoid;
            background: white;
          }
          
          .comprovante-print .bg-gradient-to-r {
            padding: 8mm 12mm !important;
            margin-bottom: 0 !important;
          }
          
          .comprovante-print .px-6 {
            padding-left: 12mm !important;
            padding-right: 12mm !important;
            padding-top: 6mm !important;
            padding-bottom: 6mm !important;
            display: flex;
            flex-direction: column;
            flex: 1;
          }
          
          .comprovante-print .px-6 > div:last-child {
            margin-top: auto;
          }
          
          .comprovante-print > * {
            margin-bottom: 0 !important;
          }
          
          .comprovante-print h1 {
            font-size: 18pt !important;
            margin-bottom: 8pt !important;
          }
          
          .comprovante-print p {
            font-size: 10pt !important;
            margin-bottom: 6pt !important;
          }
          
          .comprovante-print .bg-primary-50 {
            padding: 8mm !important;
            margin-bottom: 6mm !important;
          }
          
          .comprovante-print .bg-primary-50 p {
            font-size: 9pt !important;
          }
          
          .comprovante-print .bg-primary-50 .text-2xl {
            font-size: 20pt !important;
          }
          
          .comprovante-print .bg-primary-50 .text-3xl {
            font-size: 24pt !important;
          }
          
          .comprovante-print .bg-yellow-50 {
            padding: 6mm !important;
            margin-bottom: 6mm !important;
            font-size: 8pt !important;
          }
          
          .comprovante-print .bg-yellow-50 ul {
            font-size: 8pt !important;
            line-height: 1.3 !important;
          }
          
          .comprovante-print .text-xs {
            font-size: 8pt !important;
          }
          
          .comprovante-print .text-\\[10px\\] {
            font-size: 7pt !important;
          }
          
          .comprovante-print .inline-flex {
            width: 40pt !important;
            height: 40pt !important;
            margin-bottom: 8pt !important;
          }
          
          .comprovante-print .inline-flex svg {
            width: 24pt !important;
            height: 24pt !important;
          }
          
          button, .no-print, a, .btn {
            display: none !important;
          }
          
          /* Linha de corte visual */
          .comprovante-print::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 0.5mm;
            background: #ccc;
            border-top: 1px dashed #999;
          }
          
          /* Créditos DDV Technology na impressão */
          .comprovante-print .border-t:last-child {
            margin-top: auto !important;
            padding-top: 4pt !important;
          }
        }
      `}</style>
    </div>
  )
}

