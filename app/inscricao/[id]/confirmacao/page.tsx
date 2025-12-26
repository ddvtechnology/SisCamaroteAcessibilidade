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

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          * {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .comprovante-print, .comprovante-print * {
            visibility: visible;
          }
          
          .comprovante-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 148.5mm !important;
            max-height: 148.5mm !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            background: white !important;
            overflow: hidden !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          .comprovante-print .bg-gradient-to-r {
            padding: 6mm 10mm !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
          }
          
          .comprovante-print .inline-flex {
            width: 32pt !important;
            height: 32pt !important;
            margin-bottom: 4pt !important;
          }
          
          .comprovante-print .inline-flex svg {
            width: 20pt !important;
            height: 20pt !important;
          }
          
          .comprovante-print h1 {
            font-size: 16pt !important;
            margin-bottom: 4pt !important;
            line-height: 1.2 !important;
          }
          
          .comprovante-print .bg-gradient-to-r p {
            font-size: 8pt !important;
            margin: 0 !important;
            line-height: 1.3 !important;
          }
          
          .comprovante-print .px-6 {
            padding: 6mm 10mm !important;
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
            justify-content: space-between !important;
          }
          
          .comprovante-print .bg-gradient-to-br {
            padding: 4mm !important;
            margin-bottom: 3mm !important;
          }
          
          .comprovante-print .space-y-4 > div {
            margin-bottom: 3mm !important;
          }
          
          .comprovante-print .space-y-4 > div:last-child {
            margin-bottom: 0 !important;
          }
          
          .comprovante-print .bg-white.rounded-lg {
            padding: 3mm !important;
            margin: 0 !important;
          }
          
          .comprovante-print .uppercase {
            font-size: 7pt !important;
            margin-bottom: 2pt !important;
          }
          
          .comprovante-print .text-2xl {
            font-size: 16pt !important;
            line-height: 1.2 !important;
          }
          
          .comprovante-print .text-3xl {
            font-size: 18pt !important;
            line-height: 1.2 !important;
          }
          
          .comprovante-print .bg-amber-50 {
            padding: 3mm !important;
            margin-bottom: 3mm !important;
          }
          
          .comprovante-print .bg-amber-50 p {
            font-size: 7pt !important;
            margin-bottom: 2pt !important;
            line-height: 1.2 !important;
          }
          
          .comprovante-print .bg-amber-50 ul {
            font-size: 7pt !important;
            line-height: 1.3 !important;
            margin: 0 !important;
            padding-left: 4mm !important;
          }
          
          .comprovante-print .bg-amber-50 li {
            margin-bottom: 1pt !important;
          }
          
          .comprovante-print .text-xs {
            font-size: 7pt !important;
            line-height: 1.3 !important;
          }
          
          .comprovante-print .text-\\[10px\\] {
            font-size: 6pt !important;
          }
          
          .comprovante-print .border-t {
            padding-top: 2mm !important;
            margin-top: 0 !important;
          }
          
          .comprovante-print .space-y-2 > div {
            margin-bottom: 2mm !important;
          }
          
          .comprovante-print .space-y-2 > div:last-child {
            margin-bottom: 0 !important;
          }
          
          button, .no-print, a, .btn, .flex-col.sm\\:flex-row {
            display: none !important;
            visibility: hidden !important;
          }
          
          .comprovante-print::after {
            content: '✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -';
            position: absolute;
            bottom: -3mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #999;
            letter-spacing: 2px;
          }
        }
      `}} />
    </div>
  )
}