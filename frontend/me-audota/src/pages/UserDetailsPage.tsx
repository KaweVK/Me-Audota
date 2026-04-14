import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteUser, getUserById } from '../api/userApi'
import { deletePet, getPetById } from '../api/petApi'
import { useAuth } from '../auth/useAuth'
import { PetCard } from '../components/pets/PetCard'
import type { Pet } from '../types/pet'
import type { User } from '../types/user'

export const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const userId = useMemo(() => Number(id), [id])
  const navigate = useNavigate()
  const { currentUser, logout, refreshCurrentUser } = useAuth()

  const [user, setUser] = useState<User | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = currentUser?.id === user?.id

  useEffect(() => {
    const loadUser = async () => {
      if (!Number.isFinite(userId) || userId <= 0) {
        setError('Identificador de usuario invalido.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      setActionError(null)

      try {
        const userResponse = await getUserById(userId)
        setUser(userResponse)

        if (userResponse.petsAnunciadosIds.length === 0) {
          setPets([])
          return
        }

        const petResponses = await Promise.all(
          userResponse.petsAnunciadosIds.map(async (petId) => {
            try {
              return await getPetById(petId)
            } catch {
              return null
            }
          }),
        )

        setPets(petResponses.filter((pet): pet is Pet => pet !== null))
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Nao foi possivel carregar o usuario.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadUser()
  }, [userId])

  const handleDeleteUser = async () => {
    if (!user || !currentUser || currentUser.id !== user.id) {
      setActionError('Voce so pode apagar a propria conta.')
      return
    }

    const shouldDelete = window.confirm(
      'Deseja apagar sua conta? Os pets vinculados a ela tambem podem ser removidos.',
    )

    if (!shouldDelete) {
      return
    }

    setIsDeleting(true)
    setActionError(null)

    try {
      await deleteUser(user.id)
      logout()
      navigate('/cadastro', { replace: true })
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Nao foi possivel apagar a conta.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeletePet = async (pet: Pet) => {
    if (!currentUser || currentUser.id !== pet.anuncianteId) {
      setActionError('Voce so pode apagar pets da sua propria conta.')
      return
    }

    const shouldDelete = window.confirm(`Apagar o pet ${pet.nome}?`)

    if (!shouldDelete) {
      return
    }

    try {
      await deletePet(pet.id)
      setPets((currentPets) => currentPets.filter((item) => item.id !== pet.id))
      if (isOwner) {
        await refreshCurrentUser()
      }
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Nao foi possivel apagar o pet.',
      )
    }
  }

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="h-[60vh] animate-pulse rounded-[2rem] border border-[var(--brand-line)] bg-white/70" />
      </section>
    )
  }

  if (error || !user) {
    return (
      <section className="w-full rounded-[2rem] border border-[var(--brand-line)] bg-white p-8">
        <h1 className="text-4xl text-[var(--brand-title)]">Perfil indisponivel</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">
          {error ?? 'Nao encontramos este usuario.'}
        </p>
        <Link
          to="/usuarios"
          className="mt-6 inline-flex rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
        >
          Voltar para usuarios
        </Link>
      </section>
    )
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-6 shadow-[0_24px_60px_-42px_rgba(34,24,18,0.55)] md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">
              Perfil de anunciante
            </p>
            <h1 className="mt-2 text-4xl text-[var(--brand-title)]">
              {user.nome}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--brand-text-soft)]">
              Este perfil mostra os dados do usuario e os pets associados ao
              anunciante no back-end.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/usuarios"
              className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]"
            >
              Voltar
            </Link>
            {isOwner ? (
              <>
                <Link
                  to={`/usuarios/${user.id}/editar`}
                  className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]"
                >
                  Editar conta
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="rounded-full bg-[var(--brand-danger)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-danger-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDeleting ? 'Apagando...' : 'Apagar conta'}
                </button>
              </>
            ) : null}
          </div>
        </div>

        {actionError ? (
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-4 text-sm font-semibold text-[var(--brand-title)]">
            {actionError}
          </div>
        ) : null}

        {!isOwner ? (
          <div className="mt-6 rounded-[1.5rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4 text-sm leading-7 text-[var(--brand-text-soft)]">
            Somente o proprio usuario visualizado pode editar ou apagar esta
            conta e os pets vinculados.
          </div>
        ) : null}

        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              E-mail
            </dt>
            <dd className="mt-2 text-sm font-semibold text-[var(--brand-title)]">
              {user.email}
            </dd>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Telefone
            </dt>
            <dd className="mt-2 text-sm font-semibold text-[var(--brand-title)]">
              {user.telefone}
            </dd>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Pets anunciados
            </dt>
            <dd className="mt-2 text-sm font-semibold text-[var(--brand-title)]">
              {pets.length}
            </dd>
          </div>
        </dl>
      </article>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-3xl text-[var(--brand-title)]">Pets do anunciante</h2>
          {isOwner ? (
            <Link
              to="/pets/novo"
              className="rounded-full bg-[var(--brand-highlight)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
            >
              Adicionar pet
            </Link>
          ) : null}
        </div>

        {pets.length === 0 ? (
          <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center">
            <h3 className="text-2xl text-[var(--brand-title)]">
              Nenhum pet vinculado
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-soft)]">
              Este usuario ainda nao possui pets cadastrados.
            </p>
          </article>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {pets.map((pet) => (
              <div key={pet.id} className="flex flex-col gap-3">
                <PetCard pet={pet} />
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => handleDeletePet(pet)}
                    className="rounded-full border border-[rgba(155,61,61,0.28)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-danger)] transition-colors hover:bg-[rgba(155,61,61,0.06)]"
                  >
                    Apagar pet
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
