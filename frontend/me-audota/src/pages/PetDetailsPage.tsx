import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPetById } from '../api/petApi'
import type { Pet } from '../types/pet'
import {
  formatAge,
  formatEspecie,
  formatSexo,
  formatStatus,
  getMainImage,
} from '../utils/petFormatters'

const statusColorClassMap: Record<string, string> = {
  DISPONIVEL: 'bg-[rgba(120,135,34,0.18)] text-[var(--brand-green-900)]',
  PROCESSO_DE_ADOCAO: 'bg-[rgba(98,63,35,0.14)] text-[var(--brand-brown-900)]',
  ADOTADO: 'bg-[rgba(79,92,23,0.16)] text-[var(--brand-green-900)]',
}

const getStatusColorClass = (status: string) =>
  statusColorClassMap[status] ??
  'bg-[rgba(98,63,35,0.12)] text-[var(--brand-brown-900)]'

export const PetDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const petId = useMemo(() => Number(id), [id])

  const [pet, setPet] = useState<Pet | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('/me-audota.png')
  const [isLoading, setIsLoading] = useState(true)
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
        setSelectedImage(getMainImage(petResponse))
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
          {'Não encontramos esse pet.'}
        </p>
        <Link
          to="/pets"
          className="mt-5 inline-flex rounded-full bg-[var(--brand-brown-900)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[var(--brand-brown-700)]"
        >
          Voltar para listagem
        </Link>
      </section>
    )
  }

  const gallery = pet.imagens.length > 0 ? pet.imagens : ['/me-audota.png']

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap justify-between gap-3">
        <Link
          to="/pets"
          className="inline-flex w-fit items-center rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-bold text-[var(--brand-brown-900)] transition-colors hover:bg-[var(--brand-surface)]"
        >
          Voltar para os cards
        </Link>
        <Link
          to={`/pets/${pet.id}/editar`}
          className="inline-flex w-fit items-center rounded-full bg-[var(--brand-green-700)] px-4 py-2 text-sm font-bold text-[var(--brand-surface)] transition-colors hover:bg-[var(--brand-green-900)]"
        >
          Editar pet
        </Link>
      </div>

      <article className="grid gap-5 rounded-3xl border border-[var(--brand-line)] bg-white p-4 shadow-[0_20px_42px_-30px_rgba(47,24,12,0.8)] md:grid-cols-[1.25fr_1fr] md:p-6">
        <div className="space-y-4">
          <img
            src={selectedImage}
            alt={pet.nome}
            className="h-[46vh] min-h-80 w-full rounded-2xl object-cover"
          />

          {gallery.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(imageUrl)}
                  className={`overflow-hidden rounded-xl border transition-colors ${
                    selectedImage === imageUrl
                      ? 'border-[var(--brand-green-700)]'
                      : 'border-[var(--brand-line)]'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`${pet.nome} - imagem ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[rgba(142,161,44,0.17)] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[var(--brand-green-900)]">
              {formatEspecie(pet.especie)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${getStatusColorClass(
                pet.status,
              )}`}
            >
              {formatStatus(pet.status)}
            </span>
          </div>

          <h1 className="text-4xl leading-tight text-[var(--brand-brown-900)] md:text-5xl">
            {pet.nome}
          </h1>

          <p className="rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4 text-sm leading-relaxed text-[var(--brand-text-muted)]">
            {pet.descricao ||
              'Esse pet esta em busca de um lar responsavel e cheio de afeto.'}
          </p>

          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
                Idade
              </dt>
              <dd className="mt-1 text-sm font-bold text-[var(--brand-brown-900)]">
                {formatAge(pet.idadeAno, pet.idadeMes)}
              </dd>
            </div>
            <div className="rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
                Cor
              </dt>
              <dd className="mt-1 text-sm font-bold text-[var(--brand-brown-900)]">
                {pet.cor}
              </dd>
            </div>
            <div className="rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
                Sexo
              </dt>
              <dd className="mt-1 text-sm font-bold text-[var(--brand-brown-900)]">
                {formatSexo(pet.sexo)}
              </dd>
            </div>
            <div className="rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
                Status
              </dt>
              <dd className="mt-1 text-sm font-bold text-[var(--brand-brown-900)]">
                {formatStatus(pet.status)}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl border border-[var(--brand-line)] bg-[rgba(120,135,34,0.12)] p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-green-900)]">
              Interessado em adotar?
            </p>
            <p className="mt-2 text-sm text-[var(--brand-brown-900)]">
              Continue acompanhando a plataforma para entrar em contato com os
              responsaveis e iniciar o processo de adocao.
            </p>
          </div>
        </div>
      </article>
    </section>
  )
}
