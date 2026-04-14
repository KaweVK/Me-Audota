import type { AuthSessionSnapshot } from '../types/auth'

const SESSION_STORAGE_KEY = 'meaudota:session'

export const readStoredSession = (): AuthSessionSnapshot | null => {
  const sessionJson = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!sessionJson) return null

  try {
    return JSON.parse(sessionJson) as AuthSessionSnapshot
  } catch {
    return null
  }
}

export const persistSession = (session: AuthSessionSnapshot) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}
export const clearStoredSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}