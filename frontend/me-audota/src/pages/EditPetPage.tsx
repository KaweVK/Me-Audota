import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPetById, updatePet } from '../api/petApi'
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

  const [pet, setPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        const message =
          err instanceof Error
            ? err.message
            : 'Nao foi possivel carregar o pet.'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    void loadPet()
  }, [petId])

  const handleSubmit = async (payload: PetFormSubmitPayload) => {
    if (!pet) {
      setError('Nao foi possivel localizar o pet para editar.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const updatedPet = await updatePet(pet.id, payload)
      navigate(`/pets/${updatedPet.id}`)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Nao foi possivel atualizar o pet agora.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="h-[68vh] animate-pulse rounded-3xl border border-[var(--brand-line)] bg-white/70" />
      </section>
    )
  }

  if (error || !pet) {
    return (
      <section className="w-full rounded-3xl border border-[var(--brand-line)] bg-white p-6 md:p-10">
        <h1 className="text-4xl text-[var(--brand-brown-900)]">Ops...</h1>
        <p className="mt-3 text-sm font-semibold text-[var(--brand-text-muted)]">
          {error ?? 'Nao encontramos esse pet.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/pets"
            className="inline-flex rounded-full bg-[var(--brand-brown-900)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-surface)] transition-colors hover:bg-[var(--brand-brown-700)]"
          >
            Voltar para listagem
          </Link>
          {Number.isFinite(petId) && petId > 0 ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex rounded-full border border-[var(--brand-line)] bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown-900)] transition-colors hover:bg-[var(--brand-surface)]"
            >
              Tentar novamente
            </button>
          ) : null}
        </div>
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
      backLabel="Voltar"
      error={error}
      initialValues={initialValues}
      intro="Atualize os dados do pet, mantenha apenas as imagens desejadas e acrescente novos arquivos se precisar."
      isSubmitting={isSubmitting}
      submitLabel="Salvar alteracoes"
      title="Editar pet"
      onSubmit={handleSubmit}
    />
  )
}
