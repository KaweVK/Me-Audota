import { createContext } from 'react'
import type { LoginPayload } from '../types/auth'
import type { Usuario } from '../types/user'

export interface AuthContextValue {
  authEmail: string | null
  currentUser: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refreshCurrentUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
