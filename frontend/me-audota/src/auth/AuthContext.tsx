import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { loginRequest, logoutRequest } from '../api/authApi'
import { getUserById } from '../api/userApi'
import type { LoginPayload } from '../types/auth'
import {
  clearStoredSession,
  persistSession,
  readStoredSession,
} from './authStorage'
import type { User } from '../types/user'
import { AuthContext, type AuthContextValue } from './sessionContext'

const getInitialSession = () => readStoredSession()

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(getInitialSession)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(session))

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch (e) {
      console.error(e)
    }
    clearStoredSession()
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
      await logout()
      throw new Error('Não foi possível restaurar sua sessão.')
    } finally {
      setIsLoading(false)
    }
  }, [logout, session])

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true)
    try {
      const nextSession = await loginRequest(payload)

      persistSession(nextSession)
      
      const usuario = await getUserById(nextSession.userId)
      setSession(nextSession)
      setCurrentUser(usuario)
    } catch (error) {
      clearStoredSession()
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || currentUser) {
      return
    }

    void refreshCurrentUser()
  }, [currentUser, refreshCurrentUser, session])

  const value = useMemo<AuthContextValue>(
    () => ({
      authEmail: session?.email ?? null,
      currentUser,
      isAuthenticated: Boolean(session),
      isLoading,
      login,
      logout,
      refreshCurrentUser,
    }),
    [currentUser, isLoading, login, logout, refreshCurrentUser, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}