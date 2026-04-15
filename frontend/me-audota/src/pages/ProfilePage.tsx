import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ROUTES } from '../routes'

export const ProfilePage = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Navigate to={`${ROUTES.USERS}/${currentUser.id}`} replace />
}
