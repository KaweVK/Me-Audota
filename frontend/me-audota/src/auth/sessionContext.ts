import { createContext } from 'react'
import type { LoginPayload } from '../types/auth'
import type { User } from '../types/user'

export interface AuthContextValue {
  authEmail: string | null
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refreshCurrentUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
