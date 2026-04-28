import { useMemo, useState } from 'react'
import SubHeader from '../../components/SubHeader'
import { getAllPets } from '../../services/petApi'
import { useAsync } from '../../hooks/useAsync'
import { normalizeText } from '../../utils/text'
import { PetCard } from '../../components/PetCard'

export const PetsNAdotados = ({}) => {
  const [search, setSearch] = useState('')
  const { data: allPets, isLoading, error, retry } = useAsync(getAllPets, [])

  const petsNaoAdotados = useMemo(
    () => (allPets ?? []).filter((pet) => pet.status === 'DISPONIVEL' || pet.status === 'PROCESSO_DE_ADOCAO'),
    [allPets],
  )

  const filteredPets = useMemo(() => {
    const term = normalizeText(search)
    if (!term) return petsNaoAdotados
    return petsNaoAdotados.filter((pet) =>
      normalizeText([pet.nome].filter(Boolean).join(' ')).includes(term),
    )
  }, [petsNaoAdotados, search])

  return (
    <section className="flex w-full flex-col gap-6">
      <SubHeader
        title="Pets para adoção"
        description="Conheça os pets que estão disponíveis para adoção."
        search={search}
        setSearch={setSearch}
        filteredList={filteredPets}
        fullList={petsNaoAdotados}
        searchPlaceholder="Nome do pet"
      />

      {error && (
        <div className="rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-5">
          <p className="text-sm font-semibold text-[var(--brand-title)]">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 rounded-full bg-[var(--brand-title)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-[1.75rem] border border-[var(--brand-line)] bg-white/70" />
          ))}
        </div>
      )}

      {!isLoading && !error && petsNaoAdotados.length === 0 && (
        <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center">
          <h2 className="text-3xl text-[var(--brand-title)]">Nenhum pet para adoção encontrado.</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--brand-text-soft)]">Que pena! Parece que não há pets disponíveis para adoção no momento. Mas não desanime, continue navegando e quem sabe você não encontra o companheiro perfeito para você!</p>
        </article>
      )}

      {!isLoading && !error && petsNaoAdotados.length > 0 && filteredPets.length === 0 && (
        <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center">
          <h2 className="text-3xl text-[var(--brand-title)]">Nenhum resultado encontrado</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--brand-text-soft)]">Tente outro termo para continuar a busca.</p>
        </article>
      )}

      {!isLoading && !error && filteredPets.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      )}
    </section>
  )
}