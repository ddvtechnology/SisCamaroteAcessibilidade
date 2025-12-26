export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return cpf
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

export function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR')
}

export function formatDateTime(date: string): string {
  const d = new Date(date)
  return d.toLocaleString('pt-BR')
}

export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false

  return true
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmado':
      return 'bg-green-100 text-green-800'
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800'
    case 'indeferido':
      return 'bg-red-100 text-red-800'
    case 'cancelado':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'confirmado':
      return 'Confirmado'
    case 'pendente':
      return 'Pendente'
    case 'indeferido':
      return 'Indeferido'
    case 'cancelado':
      return 'Cancelado'
    default:
      return status
  }
}

export function getCategoriaLabel(categoria: string): string {
  switch (categoria) {
    case 'pcd':
      return 'Pessoa com Deficiência'
    case 'gestante':
      return 'Gestante'
    case 'idoso':
      return 'Pessoa Idosa'
    default:
      return categoria
  }
}

export function getCategoriaColor(categoria: string): string {
  switch (categoria) {
    case 'pcd':
      return 'bg-blue-100 text-blue-800'
    case 'gestante':
      return 'bg-pink-100 text-pink-800'
    case 'idoso':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

