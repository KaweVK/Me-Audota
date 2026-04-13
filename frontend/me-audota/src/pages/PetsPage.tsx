import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPets } from '../api/petApi'
import { PetCard } from '../components/pets/PetCard'
import type { Pet } from '../types/pet'

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()

export const PetsPage = () => {
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
        const message =
          err instanceof Error
            ? err.message
            : 'Nao foi possivel carregar os pets.'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    void loadPets()
  }, [reloadIndex])

  const filteredPets = useMemo(() => {
    const term = normalizeText(search)
    const disponiveis = pets.filter((pet) => pet.status === 'DISPONIVEL' || pet.status === 'PROCESSO_DE_ADOCAO')
    if (term.length === 0) {
      return disponiveis
    }

    return disponiveis.filter((pet) => {
      const searchableContent = normalizeText(
        [pet.nome, pet.descricao, pet.cor, pet.especie, pet.status]
          .filter(Boolean)
          .join(' '),
      )
      return searchableContent.includes(term)
    })
  }, [pets, search])

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-[var(--brand-line)] bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="flex flex-col text-3xl text-[var(--brand-brown-900)] md:text-4xl">
            Pets para Adoção
            <span className="text-lg text-[var(--brand-text-muted)] mt-1 font-semibold">
              Veja abaixo os pets que estão disponíveis para adoção
            </span>
          </h1>

          <Link
            to="/pets/novo"
            className="rounded-full bg-[var(--brand-green-700)] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-[var(--brand-surface)] transition-colors hover:bg-[var(--brand-green-900)]"
          >
            + Adicionar pet
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--brand-text-muted)]">
              Buscar
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome, especie, cor..."
              className="w-full rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] py-3 pl-18 pr-4 text-sm font-semibold text-[var(--brand-brown-900)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            />
          </label>

          <p className="text-sm font-semibold text-[var(--brand-text-muted)]">
            {filteredPets.length} de {pets.length} pets
          </p>
        </div>
      </header>

      {error ? (
        <div className="rounded-2xl border border-[rgba(138,92,57,0.35)] bg-[rgba(138,92,57,0.14)] p-5">
          <p className="text-sm font-semibold text-[var(--brand-brown-900)]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadIndex((current) => current + 1)}
            className="mt-3 rounded-full bg-[var(--brand-brown-900)] px-4 py-2 text-sm font-bold text-[var(--brand-surface)] transition-colors hover:bg-[var(--brand-brown-700)]"
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
              className="h-80 animate-pulse rounded-2xl border border-[var(--brand-line)] bg-white/70"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && pets.length === 0 ? (
        <article className="rounded-2xl border border-[var(--brand-line)] bg-white p-8 text-center">
          <h2 className="text-3xl text-[var(--brand-brown-900)]">
            Nenhum pet cadastrado ainda
          </h2>
          <p className="mt-3 text-sm text-[var(--brand-text-muted)]">
            Use o botao de adicionar para iniciar os registros.
          </p>
        </article>
      ) : null}

      {!isLoading && !error && pets.length > 0 && filteredPets.length === 0 ? (
        <article className="rounded-2xl border border-[var(--brand-line)] bg-white p-8 text-center">
          <h2 className="text-3xl text-[var(--brand-brown-900)]">
            Nenhum resultado encontrado
          </h2>
          <p className="mt-3 text-sm text-[var(--brand-text-muted)]">
            Tente buscar por outro termo.
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
