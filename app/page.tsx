import Link from 'next/link'
import { Calendar, Users, Shield } from 'lucide-react'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-900 mb-4">
            Camarote da Acessibilidade
          </h1>
          <p className="text-xl text-primary-700 max-w-2xl mx-auto">
            Sistema de Gestão de Inscrições para Eventos Acessíveis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/admin/login" className="card hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary-100 rounded-full">
                <Shield className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Painel Administrativo
              </h2>
              <p className="text-gray-600">
                Acesso para gestores da Secretaria gerenciar eventos e inscrições
              </p>
              <span className="btn btn-primary">
                Acessar Painel
              </span>
            </div>
          </Link>

          <div className="card bg-gray-50">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gray-200 rounded-full">
                <Calendar className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Inscrições
              </h2>
              <p className="text-gray-600">
                Para se inscrever em um evento, acesse o link específico do evento fornecido pela Secretaria
              </p>
              <div className="text-sm text-gray-500 italic">
                Links de inscrição são disponibilizados pela Secretaria
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="card max-w-3xl mx-auto">
            <div className="flex items-start space-x-4">
              <Users className="w-8 h-8 text-primary-600 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sobre o Sistema
                </h3>
                <p className="text-gray-600">
                  Este sistema foi desenvolvido para facilitar a organização e gestão de inscrições 
                  para o Camarote da Acessibilidade em eventos públicos, garantindo que pessoas com 
                  deficiência (PcD) e seus acompanhantes possam participar de forma organizada e 
                  acessível dos eventos realizados pelo município.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <span>Sistema desenvolvido por</span>
            <span className="font-bold text-gray-700">DDV Technology</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

