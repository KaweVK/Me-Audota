export interface LoginPayload {
  email: string
  senha: string
}

export interface AuthSessionSnapshot {
  userId: number
  email: string
}
