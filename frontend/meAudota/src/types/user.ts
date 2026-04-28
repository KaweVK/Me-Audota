export interface Usuario {
  id: number
  nome: string
  email: string
  telefone: string
  petsAnunciadosIds: number[]
}

export interface CreateUsuarioPayload {
  nome: string
  email: string
  senha: string
  telefone: string
}

export type UpdateUsuarioPayload = CreateUsuarioPayload
