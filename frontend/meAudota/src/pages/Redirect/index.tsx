import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../routes/routes'

export const Redirect = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Navigate to={ROUTES.PETS} replace />
}
