import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { loginRequest, logoutRequest, readCurrentSession } from '../api/authApi'
import { registerUnauthorizedHandler } from '../api/http'
import { getUserById } from '../api/userApi'
import type { LoginPayload } from '../types/auth'
import type { User } from '../types/user'
import { AuthContext, type AuthContextValue } from './sessionContext'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuthState = useCallback(() => {
    setCurrentUser(null)
    setIsLoading(false)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch (error) {
      console.error(error)
    }
    clearAuthState()
  }, [clearAuthState])

  const refreshCurrentUser = useCallback(async () => {
    setIsLoading(true)

    try {
      const session = await readCurrentSession()
      const user = await getUserById(session.userId)
      setCurrentUser(user)
    } catch {
      clearAuthState()
      throw new Error('Não foi possível restaurar sua sessão.')
    } finally {
      setIsLoading(false)
    }
  }, [clearAuthState])

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true)
    try {
      const nextSession = await loginRequest(payload)
      const user = await getUserById(nextSession.userId)
      setCurrentUser(user)
    } catch (err) {
      clearAuthState()
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [clearAuthState])

  useEffect(() => {
    registerUnauthorizedHandler(clearAuthState)
    return () => {
      registerUnauthorizedHandler(null)
    }
  }, [clearAuthState])

  useEffect(() => {
    void refreshCurrentUser()
  }, [refreshCurrentUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      authEmail: currentUser?.email ?? null,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isLoading,
      login,
      logout,
      refreshCurrentUser,
    }),
    [currentUser, isLoading, login, logout, refreshCurrentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}