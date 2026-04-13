import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPet } from '../api/petApi'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (payload: PetFormSubmitPayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const createdPet = await createPet(payload)
      navigate(createdPet.id > 0 ? `/pets/${createdPet.id}` : '/pets')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar o pet agora.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PetForm
      backTo="/"
      backLabel="Voltar"
      error={error}
      initialValues={initialValues}
      intro="Preencha os dados do pet e envie tudo, incluindo várias imagens se quiser."
      isSubmitting={isSubmitting}
      submitLabel="Salvar pet"
      title="Adicionar pet"
      onSubmit={handleSubmit}
    />
  )
}
