import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export const PublicOnlyRoute = () => {
  const { currentUser, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    const redirectTarget = currentUser ? `/usuarios/${currentUser.id}` : '/pets'
    return <Navigate to={redirectTarget} replace />
  }

  return <Outlet />
}
