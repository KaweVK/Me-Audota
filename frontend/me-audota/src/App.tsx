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

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/pets" replace />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/pets/novo" element={<CreatePetPage />} />
          <Route path="/pets/:id" element={<PetDetailsPage />} />
          <Route path="/pets/:id/editar" element={<EditPetPage />} />
          <Route path="/adotados" element={<PetsAdotadosPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/usuarios/:id" element={<UserDetailsPage />} />
          <Route path="/usuarios/:id/editar" element={<EditUserPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/animais" element={<Navigate to="/pets" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
