
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Inscricao, Evento } from '@/types'
import { notFound, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ArrowLeft, Save } from 'lucide-react'

type InscricaoComEvento = Inscricao & {
  eventos: Evento
}

type FormValues = Omit<Inscricao, 'id' | 'evento_id' | 'datas_eventos' | 'protocolo' | 'senha' | 'created_at' | 'updated_at' | 'status'>;


export default function InscricaoEditarPage() {
  const { id } = useParams()
  const router = useRouter()
  const [inscricao, setInscricao] = useState<InscricaoComEvento | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>();

  const categoria = watch('categoria')

  useEffect(() => {
    if (id) {
      const fetchInscricao = async () => {
        try {
          const { data, error } = await supabase
            .from('inscricoes')
            .select(`*, eventos (*)`)
            .eq('id', id)
            .single()

          if (error || !data) {
            throw error || new Error('Inscrição não encontrada')
          }
          const inscricaoData = data as InscricaoComEvento
          setInscricao(inscricaoData)
          reset({
            nome_completo: inscricaoData.nome_completo,
            cpf: inscricaoData.cpf,
            endereco: inscricaoData.endereco,
            telefone: inscricaoData.telefone,
            categoria: inscricaoData.categoria,
            tipo_deficiencia: inscricaoData.tipo_deficiencia,
            observacoes: inscricaoData.observacoes,
            nome_acompanhante: inscricaoData.nome_acompanhante,
            cpf_acompanhante: inscricaoData.cpf_acompanhante,
          })
        } catch (error) {
          console.error('Erro ao carregar inscrição:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchInscricao()
    }
  }, [id, reset])
  
  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('inscricoes')
        .update({
            ...formData,
            tipo_deficiencia: categoria === 'pcd' ? formData.tipo_deficiencia : null,
            cpf_acompanhante: formData.nome_acompanhante ? formData.cpf_acompanhante : null,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      alert('Inscrição atualizada com sucesso!')
      router.push(`/admin/inscricoes/detalhes/${id}`)

    } catch (error: any) {
      console.error('Erro ao atualizar inscrição:', error)
      alert(`Erro ao atualizar inscrição: ${error.message}`)
    } finally {
        setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados para edição...</p>
        </div>
      </div>
    )
  }

  if (!inscricao) {
    return notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href={`/admin/inscricoes/detalhes/${id}`} className="flex items-center text-sm text-primary-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancelar e voltar
        </Link>
      </div>

       <form onSubmit={handleSubmit(onSubmit)} className="card">
         <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Editar Inscrição</h1>
            <p className="text-gray-600 mt-1">Modifique os dados de {inscricao.nome_completo}</p>
         </div>

         <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nome_completo" className="label">Nome Completo</label>
                    <input id="nome_completo" {...register("nome_completo", { required: "Nome é obrigatório" })} className="input" />
                    {errors.nome_completo && <p className="text-red-500 text-sm mt-1">{errors.nome_completo.message}</p>}
                </div>
                <div>
                    <label htmlFor="cpf" className="label">CPF</label>
                    <input id="cpf" {...register("cpf", { required: "CPF é obrigatório" })} className="input" />
                    {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>}
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="endereco" className="label">Endereço</label>
                    <input id="endereco" {...register("endereco", { required: "Endereço é obrigatório" })} className="input" />
                    {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco.message}</p>}
                </div>
                <div>
                    <label htmlFor="telefone" className="label">Telefone</label>
                    <input id="telefone" {...register("telefone", { required: "Telefone é obrigatório" })} className="input" />
                    {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
                </div>
                <div>
                    <label htmlFor="categoria" className="label">Categoria</label>
                    <select id="categoria" {...register("categoria", { required: "Categoria é obrigatória" })} className="input">
                        <option value="idoso">Pessoa Idosa (60 anos ou mais)</option>
                        <option value="gestante">Gestante</option>
                        <option value="pcd">Pessoa com Deficiência (PCD)</option>
                    </select>
                </div>

                {categoria === 'pcd' && (
                    <div className="md:col-span-2">
                        <label htmlFor="tipo_deficiencia" className="label">Tipo de Deficiência</label>
                        <input id="tipo_deficiencia" {...register("tipo_deficiencia")} className="input" placeholder="Ex: Visual, Auditiva, Motora..."/>
                    </div>
                )}
            </div>
            
            <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Acompanhante</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="nome_acompanhante" className="label">Nome do Acompanhante</label>
                        <input id="nome_acompanhante" {...register("nome_acompanhante")} className="input" placeholder="Opcional"/>
                    </div>
                    <div>
                        <label htmlFor="cpf_acompanhante" className="label">CPF do Acompanhante</label>
                        <input id="cpf_acompanhante" {...register("cpf_acompanhante")} className="input" placeholder="Opcional"/>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <label htmlFor="observacoes" className="label">Observações</label>
                <textarea id="observacoes" {...register("observacoes")} className="input" rows={3}></textarea>
            </div>
         </div>
        
        <div className="p-6 border-t flex justify-end gap-4">
            <Link href={`/admin/inscricoes/detalhes/${id}`} className="btn btn-secondary">
                Cancelar
            </Link>
            <button type="submit" className="btn btn-primary inline-flex items-center" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2"/>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
       </form>
    </div>
  )
}
