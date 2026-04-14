import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { loginRequest } from '../api/authApi'
import { getUserById } from '../api/userApi'
import type { LoginPayload } from '../types/auth'
import {
  clearStoredToken,
  decodeSessionSnapshot,
  persistToken,
  readStoredSession,
} from './authStorage'
import type { User } from '../types/user'
import { AuthContext, type AuthContextValue } from './sessionContext'

const getInitialSession = () => readStoredSession()

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(getInitialSession)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(session))

  const logout = useCallback(() => {
    clearStoredToken()
    setSession(null)
    setCurrentUser(null)
    setIsLoading(false)
  }, [])

  const refreshCurrentUser = useCallback(async () => {
    if (!session) {
      setCurrentUser(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const usuario = await getUserById(session.userId)
      setCurrentUser(usuario)
    } catch {
      logout()
      throw new Error('Não foi possível restaurar sua sessão.')
    } finally {
      setIsLoading(false)
    }
  }, [logout, session])

  const login = useCallback(async (payload: LoginPayload) => {
    const token = await loginRequest(payload)
    const nextSession = decodeSessionSnapshot(token)

    if (!nextSession) {
      throw new Error('Token de autenticação inválido.')
    }

    persistToken(token)
    setIsLoading(true)

    try {
      const usuario = await getUserById(nextSession.userId)
      setSession(nextSession)
      setCurrentUser(usuario)
    } catch (error) {
      logout()
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [logout])

  useEffect(() => {
    if (!session || currentUser) {
      return
    }

    void refreshCurrentUser()
  }, [currentUser, refreshCurrentUser, session])

  const value: AuthContextValue = {
    authEmail: session?.email ?? null,
    currentUser,
    isAuthenticated: Boolean(session),
    isLoading,
    login,
    logout,
    refreshCurrentUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
