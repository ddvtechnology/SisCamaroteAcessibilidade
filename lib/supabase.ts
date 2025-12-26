import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      eventos: {
        Row: {
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
        Insert: {
          id?: string
          nome: string
          descricao: string
          data_inicio: string
          data_fim: string
          permite_acompanhante?: boolean
          max_acompanhantes?: number
          limite_vagas_por_dia: number
          campos_obrigatorios?: string[]
          logo_url?: string | null
          texto_institucional?: string | null
          orientacoes?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string
          data_inicio?: string
          data_fim?: string
          permite_acompanhante?: boolean
          max_acompanhantes?: number
          limite_vagas_por_dia?: number
          campos_obrigatorios?: string[]
          logo_url?: string | null
          texto_institucional?: string | null
          orientacoes?: string | null
          ativo?: boolean
          updated_at?: string
        }
      }
      inscricoes: {
        Row: {
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
        Insert: {
          id?: string
          evento_id: string
          datas_eventos: string[]
          nome_completo: string
          cpf: string
          endereco: string
          telefone: string
          categoria: 'pcd' | 'gestante' | 'idoso'
          tipo_deficiencia?: string | null
          observacoes?: string | null
          nome_acompanhante?: string | null
          cpf_acompanhante?: string | null
          protocolo?: string
          senha?: string
          status?: 'pendente' | 'confirmado' | 'indeferido' | 'cancelado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pendente' | 'confirmado' | 'indeferido' | 'cancelado'
          updated_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          nome: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          nome: string
          created_at?: string
        }
        Update: {
          email?: string
          nome?: string
        }
      }
    }
  }
}

