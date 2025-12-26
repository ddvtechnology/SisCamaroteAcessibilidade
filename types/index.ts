export type Evento = {
  id: string
  nome: string
  descricao: string
  data_inicio: string
  data_fim: string
  permite_acompanhante: boolean
  max_acompanhantes: number
  limite_vagas_por_dia: number
  campos_obrigatorios: string[]
  logo_url: string | null
  texto_institucional: string | null
  orientacoes: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export type Inscricao = {
  id: string
  evento_id: string
  datas_eventos: string[]
  nome_completo: string
  cpf: string
  endereco: string
  telefone: string
  categoria: 'pcd' | 'gestante' | 'idoso'
  tipo_deficiencia: string | null
  observacoes: string | null
  nome_acompanhante: string | null
  cpf_acompanhante: string | null
  protocolo: string
  senha: string
  status: 'pendente' | 'confirmado' | 'indeferido' | 'cancelado'
  created_at: string
  updated_at: string
}

export type InscricaoComEvento = Inscricao & {
  evento: Evento
}

export type NovaInscricao = {
  evento_id: string
  datas_eventos: string[]
  nome_completo: string
  cpf: string
  endereco: string
  telefone: string
  categoria: 'pcd' | 'gestante' | 'idoso'
  tipo_deficiencia?: string
  observacoes?: string
  nome_acompanhante?: string
  cpf_acompanhante?: string
}

export type NovoEvento = {
  nome: string
  descricao: string
  data_inicio: string
  data_fim: string
  permite_acompanhante: boolean
  max_acompanhantes: number
  limite_vagas_por_dia: number
  campos_obrigatorios?: string[]
  logo_url?: string
  texto_institucional?: string
  orientacoes?: string
}

