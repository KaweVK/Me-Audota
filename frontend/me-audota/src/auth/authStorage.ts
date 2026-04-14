import type { AuthSessionSnapshot } from '../types/auth'

const TOKEN_STORAGE_KEY = 'meaudota:token'

const normalizeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = (4 - (base64.length % 4)) % 4
  return `${base64}${'='.repeat(padLength)}`
}

const decodeTokenPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  try {
    const decoded = atob(normalizeBase64Url(parts[1]))
    const payload = JSON.parse(decoded) as unknown

    if (typeof payload === 'object' && payload !== null) {
      return payload as Record<string, unknown>
    }

    return null
  } catch {
    return null
  }
}

export const decodeSessionSnapshot = (
  token: string,
): AuthSessionSnapshot | null => {
  const payload = decodeTokenPayload(token)

  if (!payload) {
    return null
  }

  const rawUserId = payload.id
  const userId = Number(rawUserId)
  const email = typeof payload.sub === 'string' ? payload.sub : ''

  if (!Number.isFinite(userId) || userId <= 0 || email.trim().length === 0) {
    return null
  }

  return {
    token,
    userId,
    email,
  }
}

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY)

export const readStoredSession = (): AuthSessionSnapshot | null => {
  const token = getStoredToken()

  if (!token) {
    return null
  }

  return decodeSessionSnapshot(token)
}

export const persistToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
