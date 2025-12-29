'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Evento, Inscricao } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ConfirmationContent({ inscricao, evento }: { inscricao: Inscricao | null, evento: Evento | null }) {
  if (!inscricao || !evento) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-lg rounded-lg text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Carregando...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-white" id="printable-content">
      <div className="border-4 border-double border-gray-400 p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Confirmação de Inscrição</h1>
          <p className="text-lg">{evento.nome}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>NOME:</strong></p>
            <p>{inscricao.nome_completo}</p>
          </div>
          <div>
            <p><strong>CPF:</strong></p>
            <p>{inscricao.cpf}</p>
          </div>
          <div>
            <p><strong>TELEFONE:</strong></p>
            <p>{inscricao.telefone}</p>
          </div>
          <div>
            <p><strong>ENDEREÇO:</strong></p>
            <p>{inscricao.endereco}</p>
          </div>
        </div>

        <div className="text-center my-6">
          <p className="font-bold text-lg">DATAS DE PARTICIPAÇÃO:</p>
          <div className="flex justify-center gap-4">
            {inscricao.datas_eventos?.map(dia => (
              <p key={dia} className="text-lg">{format(new Date(dia), "dd/MM/yyyy", { locale: ptBR })}</p>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm">
            Este documento é a sua confirmação de inscrição no evento.
            Apresente este comprovante no dia do evento para facilitar o seu credenciamento.
          </p>
          <p className="text-sm mt-2">
            Protocolo de Inscrição: {inscricao.id}
          </p>
        </div>
      </div>
    </div>
  )
}
