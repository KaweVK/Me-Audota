import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { loginRequest, logoutRequest, readCurrentSession } from '../services/authApi'
import { registerUnauthorizedHandler } from '../services/api'
import { getUserById } from '../services/usuarioApi'
import type { LoginPayload } from '../types/auth'
import type { Usuario } from '../types/user'
import { AuthContext, type AuthContextValue } from './sessionContext'

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const clearAuth = useCallback(() => {
        setCurrentUser(null)
        setIsLoading(false)
    }, [])

    const refreshCurrentUser = useCallback(async () => {
        setIsLoading(true)
        try {
            const session = await readCurrentSession()
            setCurrentUser(await getUserById(session.userId))
        } catch {
            clearAuth()
            window.alert('Não foi possível restaurar sua sessão, faça login novamente.')
            throw new Error('Não foi possível restaurar sua sessão.')
        } finally {
            setIsLoading(false)
        }
    }, [clearAuth])

    const login = useCallback(async (payload: LoginPayload) => {
        setIsLoading(true)
        try {
            const session = await loginRequest(payload)
            setCurrentUser(await getUserById(session.userId))
        } catch (err) {
            clearAuth()
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [clearAuth])

    const logout = useCallback(async () => {
        if (!window.confirm('Deseja realmente sair?')) return
        try {
            await logoutRequest()
        } catch (err) {
            console.error(err)
        }
        clearAuth()
    }, [clearAuth])

    useEffect(() => {
        registerUnauthorizedHandler(clearAuth)
        return () => registerUnauthorizedHandler(null)
    }, [clearAuth])

    useEffect(() => {
        void refreshCurrentUser()
    }, [refreshCurrentUser])

    const value = useMemo<AuthContextValue>(() => ({
        authEmail: currentUser?.email ?? null,
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        refreshCurrentUser,
    }), [currentUser, isLoading, login, logout, refreshCurrentUser])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}