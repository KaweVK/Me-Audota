import { request } from './http'
import type { AuthTokenResponse, LoginPayload } from '../types/auth'

export const loginRequest = async (payload: LoginPayload) => {
  const response = await request<AuthTokenResponse>('/login', {
    method: 'POST',
    auth: false,
    json: payload,
  })

  if (!response || typeof response.token !== 'string') {
    throw new Error('Não foi possível iniciar a sessão.')
  }

  return response.token
}
