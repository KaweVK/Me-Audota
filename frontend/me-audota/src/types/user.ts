export interface User {
  id: number
  nome: string
  email: string
  telefone: string
  petsAnunciadosIds: number[]
}

export interface CreateUserPayload {
  nome: string
  email: string
  senha: string
  telefone: string
}

export type UpdateUserPayload = CreateUserPayload
