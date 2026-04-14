import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPetById, updatePet } from '../api/petApi'
import { useAuth } from '../auth/useAuth'
import {
  PetForm,
  type PetFormInitialValues,
  type PetFormSubmitPayload,
} from '../components/pets/PetForm'
import type { Pet } from '../types/pet'

export const EditPetPage = () => {
  const { id } = useParams<{ id: string }>()
  const petId = useMemo(() => Number(id), [id])
  const navigate = useNavigate()
  const { currentUser, refreshCurrentUser } = useAuth()

  const [pet, setPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOwner = currentUser?.id === pet?.anuncianteId

  useEffect(() => {
    const loadPet = async () => {
      if (!Number.isFinite(petId) || petId <= 0) {
        setError('Identificador de pet invalido.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const petResponse = await getPetById(petId)
        setPet(petResponse)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Nao foi possivel carregar o pet.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadPet()
  }, [petId])

  const handleSubmit = async (payload: PetFormSubmitPayload) => {
    if (!pet || !currentUser || currentUser.id !== pet.anuncianteId) {
      setError('Você só pode editar pets da sua própria conta.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const updatedPet = await updatePet(pet.id, {
        ...payload,
        anuncianteId: currentUser.id,
      })
      await refreshCurrentUser()
      navigate(`/pets/${updatedPet.id}`, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível atualizar o pet agora.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="h-[60vh] animate-pulse rounded-3xl border border-[var(--brand-line)] bg-white/70" />
      </section>
    )
  }

  if (error && !pet) {
    return (
      <section className="w-full rounded-3xl border border-[var(--brand-line)] bg-white p-8">
        <h1 className="text-4xl text-[var(--brand-title)]">Edição indisponível</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">
          {error}
        </p>
        <Link
          to="/pets"
          className="mt-6 inline-flex rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
        >
          Voltar para pets
        </Link>
      </section>
    )
  }

  if (!pet || !isOwner) {
    return (
      <section className="w-full rounded-3xl border border-[var(--brand-line)] bg-white p-8">
        <h1 className="text-4xl text-[var(--brand-title)]">Acesso bloqueado</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">
          Apenas o usuário logado que anunciou este pet pode editar o cadastro.
        </p>
        <Link
          to={pet ? `/pets/${pet.id}` : '/pets'}
          className="mt-6 inline-flex rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
        >
          Voltar ao pet
        </Link>
      </section>
    )
  }

  const initialValues: PetFormInitialValues = {
    nome: pet.nome,
    descricao: pet.descricao,
    idadeMes: pet.idadeMes,
    idadeAno: pet.idadeAno,
    especie: pet.especie,
    cor: pet.cor,
    sexo: pet.sexo,
    status: pet.status,
    imagensExistentes: pet.imagens,
  }

  return (
    <PetForm
      key={`pet-form-${pet.id}`}
      backTo={`/pets/${pet.id}`}
      backLabel="Voltar ao pet"
      error={error}
      initialValues={initialValues}
      intro="Atualize os dados do pet, mantenha apenas as imagens desejadas e inclua novos arquivos se precisar."
      isSubmitting={isSubmitting}
      submitLabel="Salvar alterações"
      title="Editar pet"
      onSubmit={handleSubmit}
    />
  )
}
