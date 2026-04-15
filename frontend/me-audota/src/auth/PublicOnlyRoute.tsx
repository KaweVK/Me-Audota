import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../routes'
import { useAuth } from './useAuth'

export const PublicOnlyRoute = () => {
  const { currentUser, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    const redirectTarget = currentUser
      ? `${ROUTES.USERS}/${currentUser.id}`
      : ROUTES.PETS
    return <Navigate to={redirectTarget} replace />
  }

  return <Outlet />
}
