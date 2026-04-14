import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPets } from '../../api/petApi'
import type { Pet } from '../../types/pet'
import { normalizeText } from '../../utils/text'
import { PetCard } from './PetCard'

interface PetCollectionPageProps {
  description: string
  emptyDescription: string
  emptyTitle: string
  filter: (pet: Pet) => boolean
  title: string
}

export const PetCollectionPage = ({
  description,
  emptyDescription,
  emptyTitle,
  filter,
  title,
}: PetCollectionPageProps) => {
  const [pets, setPets] = useState<Pet[]>([])
  const [search, setSearch] = useState('')
  const [reloadIndex, setReloadIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPets = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getAllPets()
        setPets(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os pets.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadPets()
  }, [reloadIndex])

  const scopedPets = useMemo(() => pets.filter(filter), [filter, pets])

  const filteredPets = useMemo(() => {
    const term = normalizeText(search)

    if (term.length === 0) {
      return scopedPets
    }

    return scopedPets.filter((pet) => {
      const searchableContent = normalizeText(
        [pet.nome, pet.descricao, pet.cor, pet.especie, pet.status]
          .filter(Boolean)
          .join(' '),
      )

      return searchableContent.includes(term)
    })
  }, [scopedPets, search])

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-6 shadow-[0_24px_60px_-42px_rgba(34,24,18,0.55)] md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">
              Catálogo
            </p>
            <h1 className="mt-2 text-4xl text-[var(--brand-title)]">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">
              {description}
            </p>
          </div>

          <Link
            to="/pets/novo"
            className="rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
          >
            Divulgar pet
          </Link>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Buscar
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome, especie, cor ou status"
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            />
          </label>

          <p className="text-sm font-semibold text-[var(--brand-text-soft)]">
            {filteredPets.length} de {scopedPets.length} pets exibidos
          </p>
        </div>
      </header>

      {error ? (
        <div className="rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-5">
          <p className="text-sm font-semibold text-[var(--brand-title)]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadIndex((current) => current + 1)}
            className="mt-4 rounded-full bg-[var(--brand-title)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-[1.75rem] border border-[var(--brand-line)] bg-white/70"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && scopedPets.length === 0 ? (
        <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center">
          <h2 className="text-3xl text-[var(--brand-title)]">{emptyTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--brand-text-soft)]">
            {emptyDescription}
          </p>
        </article>
      ) : null}

      {!isLoading && !error && scopedPets.length > 0 && filteredPets.length === 0 ? (
        <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center">
          <h2 className="text-3xl text-[var(--brand-title)]">
            Nenhum resultado encontrado
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--brand-text-soft)]">
            Tente outro termo para continuar a busca.
          </p>
        </article>
      ) : null}

      {!isLoading && !error && filteredPets.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
