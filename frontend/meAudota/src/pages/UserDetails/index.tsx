import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteUser, getUserById } from '../../services/usuarioApi'
import { deletePet, getPetById } from '../../services/petApi'
import { useAuth } from '../../hooks/useAuth'
import { PetCard } from '../../components/PetCard'
import type { Pet } from '../../types/pet'
import type { Usuario } from '../../types/user'

const cardCls = 'rounded-[1.5rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4'
const dtCls = 'text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]'
const ddCls = 'mt-2 text-sm font-semibold text-[var(--brand-title)]'

const InfoCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className={cardCls}>
    <dt className={dtCls}>{label}</dt>
    <dd className={ddCls}>{value}</dd>
  </div>
)

export const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)
  const navigate = useNavigate()
  const { currentUser, logout, refreshCurrentUser } = useAuth()

  const [user, setUser] = useState<Usuario | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = currentUser?.id === user?.id

  useEffect(() => {
    if (!Number.isFinite(userId) || userId <= 0) {
      setError('Identificador de usuário inválido.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setActionError(null)

    getUserById(userId)
      .then(async (userResponse) => {
        setUser(userResponse)
        if (userResponse.petsAnunciadosIds.length === 0) return

        const results = await Promise.all(
          userResponse.petsAnunciadosIds.map((petId) => getPetById(petId).catch(() => null)),
        )
        setPets(results.filter((pet): pet is Pet => pet !== null))
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar o usuário.'))
      .finally(() => setIsLoading(false))
  }, [userId])

  const handleDeleteUser = async () => {
    if (!user || !isOwner) {
      setActionError('Você só pode apagar a própria conta.')
      return
    }

    if (!window.confirm('Deseja apagar sua conta? Os pets vinculados a ela também podem ser removidos.')) return

    setIsDeleting(true)
    setActionError(null)
    try {
      await deleteUser(user.id)
      logout()
      navigate('/cadastro', { replace: true })
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível apagar a conta.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeletePet = async (pet: Pet) => {
    if (!currentUser || currentUser.id !== pet.anuncianteId) {
      setActionError('Você só pode apagar pets da sua própria conta.')
      return
    }

    if (!window.confirm(`Apagar o pet ${pet.nome}?`)) return

    try {
      await deletePet(pet.id)
      setPets((curr) => curr.filter((p) => p.id !== pet.id))
      if (isOwner) await refreshCurrentUser()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível apagar o pet.')
    }
  }

  if (isLoading) return (
    <section className="w-full">
      <div className="h-[60vh] animate-pulse rounded-[2rem] border border-[var(--brand-line)] bg-white/70" />
    </section>
  )

  if (error || !user) return (
    <section className="w-full rounded-[2rem] border border-[var(--brand-line)] bg-white p-8">
      <h1 className="text-4xl text-[var(--brand-title)]">Perfil indisponível</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">{error ?? 'Não encontramos este usuário.'}</p>
      <Link to="/usuarios" className="mt-6 inline-flex rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]">
        Voltar para usuários
      </Link>
    </section>
  )

  return (
    <section className="flex w-full flex-col gap-6">
      <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-6 shadow-[0_24px_60px_-42px_rgba(34,24,18,0.55)] md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">Perfil</p>
            <h1 className="mt-2 text-4xl text-[var(--brand-title)]">{user.nome}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--brand-text-soft)]">
              Aqui estão os seus dados e dos pets que você anunciou. Obrigado por nos ajudar com nossa causa!
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/usuarios" className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]">
              Voltar
            </Link>
            {isOwner && (
              <>
                <Link to={`/usuarios/${user.id}/editar`} className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]">
                  Editar conta
                </Link>
                <button type="button" onClick={handleDeleteUser} disabled={isDeleting}
                  className="rounded-full bg-[var(--brand-danger)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-danger-strong)] disabled:cursor-not-allowed disabled:opacity-70">
                  {isDeleting ? 'Apagando...' : 'Apagar conta'}
                </button>
              </>
            )}
          </div>
        </div>

        {actionError && (
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-4 text-sm font-semibold text-[var(--brand-title)]">
            {actionError}
          </div>
        )}

        {!isOwner && (
          <div className={`mt-6 ${cardCls} text-sm leading-7 text-[var(--brand-text-soft)]`}>
            Somente o próprio usuário pode editar ou apagar esta conta e os pets vinculados.
          </div>
        )}

        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard label="E-mail" value={user.email} />
          <InfoCard label="Telefone" value={user.telefone} />
          <InfoCard label="Pets anunciados" value={pets.length} />
        </dl>
      </article>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-3xl text-[var(--brand-title)]">Pets anunciados</h2>
          {isOwner && (
            <Link to="/pets/novo" className="rounded-full bg-[var(--brand-highlight)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]">
              Adicionar pet
            </Link>
          )}
        </div>

        {pets.length === 0 ? (
          <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center">
            <h3 className="text-2xl text-[var(--brand-title)]">Nenhum pet vinculado</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-soft)]">Este usuário ainda não possui pets cadastrados.</p>
          </article>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {pets.map((pet) => (
              <div key={pet.id} className="flex flex-col gap-3">
                <PetCard pet={pet} />
                {isOwner && (
                  <button type="button" onClick={() => handleDeletePet(pet)}
                    className="rounded-full border border-[rgba(155,61,61,0.28)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-danger)] transition-colors hover:bg-[rgba(155,61,61,0.06)]">
                    Apagar pet
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}