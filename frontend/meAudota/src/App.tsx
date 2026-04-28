import { Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { AppLayout } from './layout/AppLayout'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import { RequireAuth } from './routes/RequireAuth'
import { CreatePet } from './pages/CreatePet'
import { EditPet } from './pages/EditPet'
import { EditUser } from './pages/EditUser'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { PetDetails } from './pages/PetDetails'
import { PetsAdotados } from './pages/PetsAdotados'
import { PetsNAdotados } from './pages/PetsNAdotado'
import { Redirect } from './pages/Redirect'
import { Register } from './pages/Register'
import { UserDetails } from './pages/UserDetails'
import { Usuarios } from './pages/Usuarios'
import { ROUTES } from './routes/routes'

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.PETS} replace />} />
            <Route path={ROUTES.PETS} element={<PetsNAdotados />} />
            <Route path={ROUTES.NEW_PET} element={<CreatePet />} />
            <Route path={ROUTES.PET_DETAILS} element={<PetDetails />} />
            <Route path={ROUTES.PET_EDIT} element={<EditPet />} />
            <Route path={ROUTES.ADOPTED_PETS} element={<PetsAdotados />} />
            <Route path={ROUTES.USERS} element={<Usuarios />} />
            <Route path={ROUTES.USER_DETAILS} element={<UserDetails />} />
            <Route path={ROUTES.USER_EDIT} element={<EditUser />} />
            <Route path={ROUTES.PROFILE} element={<Redirect />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </>
  )
}

export default App
