import { request } from './http'
import type { LoginPayload, AuthSessionSnapshot } from '../types/auth'

export const loginRequest = async (payload: LoginPayload): Promise<AuthSessionSnapshot> => {
  const response = await request<{ id: number; email: string }>('/login', {
    method: 'POST',
    json: payload,
  })

  if (!response || !response.id) {
    throw new Error('Não recebemos os dados do utilizador. Verifica o Backend!')
  }

  return {
    userId: response.id,
    email: response.email,
  }
}

export const logoutRequest = async () => {
  await request('/login/logout', { method: 'POST' })
}