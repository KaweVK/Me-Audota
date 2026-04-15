import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PublicOnlyRoute } from './auth/PublicOnlyRoute'
import { RequireAuth } from './auth/RequireAuth'
import { CreatePetPage } from './pages/CreatePetPage'
import { EditPetPage } from './pages/EditPetPage'
import { EditUserPage } from './pages/EditUserPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PetDetailsPage } from './pages/PetDetailsPage'
import { PetsAdotadosPage } from './pages/PetsAdotadosPage'
import { PetsPage } from './pages/PetsPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { UserDetailsPage } from './pages/UserDetailsPage'
import { UsersPage } from './pages/UsersPage'
import { ROUTES } from './routes'

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.PETS} replace />} />
          <Route path={ROUTES.PETS} element={<PetsPage />} />
          <Route path={ROUTES.NEW_PET} element={<CreatePetPage />} />
          <Route path={ROUTES.PET_DETAILS} element={<PetDetailsPage />} />
          <Route path={ROUTES.PET_EDIT} element={<EditPetPage />} />
          <Route path={ROUTES.ADOPTED_PETS} element={<PetsAdotadosPage />} />
          <Route path={ROUTES.USERS} element={<UsersPage />} />
          <Route path={ROUTES.USER_DETAILS} element={<UserDetailsPage />} />
          <Route path={ROUTES.USER_EDIT} element={<EditUserPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.LEGACY_PETS} element={<Navigate to={ROUTES.PETS} replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
