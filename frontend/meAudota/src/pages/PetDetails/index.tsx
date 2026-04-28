import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePet, getPetById } from '../../services/petApi'
import { getUserById } from '../../services/usuarioApi'
import { useAuth } from '../../hooks/useAuth'
import type { Pet } from '../../types/pet'
import type { Usuario } from '../../types/user'
import { formatAge, formatEspecie, formatSexo, formatStatus, getMainImage } from '../../utils/petFormatters'

const statusColorClassMap: Record<string, string> = {
  DISPONIVEL: 'bg-[rgba(86,110,42,0.14)] text-[var(--brand-highlight)]',
  PROCESSO_DE_ADOCAO: 'bg-[rgba(130,75,49,0.12)] text-[var(--brand-title)]',
  ADOTADO: 'bg-[rgba(58,103,95,0.14)] text-[var(--brand-accent)]',
}

const getStatusColorClass = (status: string) =>
  statusColorClassMap[status] ?? 'bg-[rgba(130,75,49,0.12)] text-[var(--brand-title)]'

const cardCls = 'rounded-[1.5rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4'
const dtCls = 'text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]'
const ddCls = 'mt-2 text-sm font-semibold text-[var(--brand-title)]'

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className={cardCls}>
    <dt className={dtCls}>{label}</dt>
    <dd className={ddCls}>{value}</dd>
  </div>
)

export const PetDetails = () => {
  const { id } = useParams<{ id: string }>()
  const petId = Number(id)
  const navigate = useNavigate()
  const { currentUser, refreshCurrentUser } = useAuth()

  const [pet, setPet] = useState<Pet | null>(null)
  const [owner, setOwner] = useState<Usuario | null>(null)
  const [selectedImage, setSelectedImage] = useState('/me-audota.png')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const isOwner = currentUser?.id === pet?.anuncianteId

  useEffect(() => {
    if (!Number.isFinite(petId) || petId <= 0) {
      setError('Identificador de pet inválido.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setActionError(null)

    getPetById(petId)
      .then((petResponse) => {
        setPet(petResponse)
        setSelectedImage(getMainImage(petResponse))
        return getUserById(petResponse.anuncianteId).catch(() => null)
      })
      .then((user) => setOwner(user))
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar o pet.'))
      .finally(() => setIsLoading(false))
  }, [petId])

  const handleDelete = async () => {
    if (!pet || !isOwner) {
      setActionError('Você só pode apagar um pet da sua própria conta.')
      return
    }

    if (!window.confirm(`Apagar o cadastro do pet ${pet.nome}?`)) return

    setIsDeleting(true)
    setActionError(null)
    try {
      await deletePet(pet.id)
      await refreshCurrentUser()
      navigate('/pets', { replace: true })
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível apagar o pet.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) return (
    <section className="w-full">
      <div className="h-[68vh] animate-pulse rounded-3xl border border-[var(--brand-line)] bg-white/70" />
    </section>
  )

  if (error || !pet) return (
    <section className="w-full rounded-3xl border border-[var(--brand-line)] bg-white p-8">
      <h1 className="text-4xl text-[var(--brand-title)]">Pet indisponível</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">{error ?? 'Não encontramos este pet.'}</p>
      <Link to="/pets" className="mt-6 inline-flex rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]">
        Voltar para listagem
      </Link>
    </section>
  )

  const gallery = pet.imagens.length > 0 ? pet.imagens : ['/me-audota.png']

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap justify-between gap-3">
        <Link to="/pets" className="inline-flex items-center rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]">
          Voltar para os pets
        </Link>

        {isOwner && (
          <div className="flex flex-wrap gap-3">
            <Link to={`/pets/${pet.id}/editar`} className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]">
              Editar pet
            </Link>
            <button type="button" onClick={handleDelete} disabled={isDeleting}
              className="rounded-full bg-[var(--brand-danger)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-danger-strong)] disabled:cursor-not-allowed disabled:opacity-70">
              {isDeleting ? 'Apagando...' : 'Apagar pet'}
            </button>
          </div>
        )}
      </div>

      {actionError && (
        <div className="rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-4 text-sm font-semibold text-[var(--brand-title)]">
          {actionError}
        </div>
      )}

      <article className="grid gap-6 rounded-3xl border border-[var(--brand-line)] bg-white p-5 shadow-[0_24px_60px_-42px_rgba(34,24,18,0.55)] md:grid-cols-[1.2fr_0.8fr] md:p-6">
        <div className="space-y-4">
          <img src={selectedImage} alt={pet.nome} className="h-[46vh] min-h-80 w-full rounded-[1.75rem] object-cover" />

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((url, i) => (
                <button key={`${url}-${i}`} type="button" onClick={() => setSelectedImage(url)}
                  className={`overflow-hidden rounded-[1rem] border transition-colors ${selectedImage === url ? 'border-[var(--brand-highlight)]' : 'border-[var(--brand-line)]'}`}>
                  <img src={url} alt={`${pet.nome} - imagem ${i + 1}`} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[rgba(86,110,42,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-highlight)]">
              {formatEspecie(pet.especie)}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusColorClass(pet.status)}`}>
              {formatStatus(pet.status)}
            </span>
          </div>

          <h1 className="text-4xl text-[var(--brand-title)] md:text-5xl">{pet.nome}</h1>

          <p className={`${cardCls} text-sm leading-7 text-[var(--brand-text-soft)]`}>
            {pet.descricao || 'Esse pet está em busca de um lar responsável e cheio de afeto.'}
          </p>

          <dl className="grid grid-cols-2 gap-3">
            <InfoCard label="Idade" value={formatAge(pet.idadeAno, pet.idadeMes)} />
            <InfoCard label="Cor" value={pet.cor} />
            <InfoCard label="Sexo" value={formatSexo(pet.sexo)} />
            <InfoCard label="Anunciante" value={owner ? owner.nome : `Usuário #${pet.anuncianteId}`} />
          </dl>

          <div className="rounded-[1.5rem] border border-[var(--brand-line)] bg-[rgba(86,110,42,0.08)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-highlight)]">Contato</p>
            <p className="mt-2 text-sm leading-7 text-[var(--brand-text-soft)]">
              Entre em contato por aqui com o anunciante para saber mais sobre o pet.
            </p>
            {owner && (
              <div className="flex flex-wrap gap-3">
                <Link to={`/usuarios/${owner.id}`} className="mt-4 inline-flex rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]">
                  Ver perfil do anunciante
                </Link>
                <Link to={`https://wa.me/${owner.telefone}?text=Oi%2C%20vim%20pelo%20MeAudota.%20Gostaria%20de%20saber%20da%20${pet.nome}.%20%0A`} className="mt-4 inline-flex rounded-full border border-[var(--brand-green-600)] bg-[var(--brand-highlight)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]" target='_blank' rel='noopener noreferrer'>
                  Conversar no whatsapp
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}