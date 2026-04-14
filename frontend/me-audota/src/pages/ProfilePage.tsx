import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export const ProfilePage = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={`/usuarios/${currentUser.id}`} replace />
}
