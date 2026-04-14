import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPet } from '../api/petApi'
import { useAuth } from '../auth/useAuth'
import {
  PetForm,
  type PetFormInitialValues,
  type PetFormSubmitPayload,
} from '../components/pets/PetForm'

const initialValues: PetFormInitialValues = {
  nome: '',
  descricao: '',
  idadeMes: 0,
  idadeAno: 0,
  especie: 'CACHORRO',
  cor: '',
  sexo: '',
  status: 'DISPONIVEL',
  imagensExistentes: [],
}

export const CreatePetPage = () => {
  const navigate = useNavigate()
  const { currentUser, refreshCurrentUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (payload: PetFormSubmitPayload) => {
    if (!currentUser) {
      setError('E necessario estar autenticado para cadastrar um pet.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const createdPet = await createPet({
        ...payload,
        anuncianteId: currentUser.id,
      })
      await refreshCurrentUser()
      navigate(createdPet.id > 0 ? `/pets/${createdPet.id}` : '/pets')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar o pet agora.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PetForm
      backTo="/pets"
      backLabel="Voltar"
      error={error}
      initialValues={initialValues}
      intro="Preencha os dados do pet e envie uma ou mais imagens para o anúncio."
      isSubmitting={isSubmitting}
      submitLabel="Salvar pet"
      title="Adicionar pet"
      onSubmit={handleSubmit}
    />
  )
}
