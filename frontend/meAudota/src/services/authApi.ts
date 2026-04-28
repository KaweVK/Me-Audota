import { request } from './api'
import type { LoginPayload, AuthSessionSnapshot } from '../types/auth'

const toSession = (data: { id: number; email: string }): AuthSessionSnapshot => ({
  userId: data.id,
  email: data.email,
})

export const loginRequest = async (payload: LoginPayload): Promise<AuthSessionSnapshot> => {
  const data = await request<{ id: number; email: string }>('/login', { method: 'POST', json: payload })
  if (!data?.id) throw new Error('Não recebemos os dados do utilizador. Verifica o Backend!')
  return toSession(data)
}

export const logoutRequest = () => request('/login/logout', { method: 'POST' })

export const readCurrentSession = async (): Promise<AuthSessionSnapshot> =>
  toSession(await request<{ id: number; email: string }>('/login/me'))