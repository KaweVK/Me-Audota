export interface LoginPayload {
  email: string
  senha: string
}

export interface AuthTokenResponse {
  token: string
}

export interface AuthSessionSnapshot {
  token: string
  userId: number
  email: string
}
