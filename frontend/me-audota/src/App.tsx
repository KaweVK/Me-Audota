import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { CreatePetPage } from './pages/CreatePetPage'
import { EditPetPage } from './pages/EditPetPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PetDetailsPage } from './pages/PetDetailsPage'
import { PetsPage } from './pages/PetsPage'
import { PetsAdotadosPage } from './pages/PetsAdotadosPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PetsPage />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/pets/novo" element={<CreatePetPage />} />
        <Route path="/pets/:id/editar" element={<EditPetPage />} />
        <Route path="/pets/:id" element={<PetDetailsPage />} />
        <Route path="/animais" element={<Navigate to="/" replace />} />
        <Route path="/adotados" element={<PetsAdotadosPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
