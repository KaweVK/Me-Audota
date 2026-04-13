import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { PetEspecie, PetStatus, PetSexo } from '../../types/pet'

const especieOptions: Array<{ label: string; value: PetEspecie }> = [
  { label: 'Cachorro', value: 'CACHORRO' },
  { label: 'Gato', value: 'GATO' },
]

const sexoOptions: Array<{ label: string; value: PetSexo | '' }> = [
  { label: 'Nao informado', value: '' },
  { label: 'Macho', value: 'M' },
  { label: 'Fêmea', value: 'F' },
]

const statusOptions: Array<{ label: string; value: PetStatus }> = [
  { label: 'Disponível', value: 'DISPONIVEL' },
  { label: 'Processo de adoção', value: 'PROCESSO_DE_ADOCAO' },
  { label: 'Adotado', value: 'ADOTADO' },
]

export interface PetFormInitialValues {
  nome: string
  descricao: string
  idadeMes: number
  idadeAno: number
  especie: PetEspecie
  cor: string
  sexo?: PetSexo
  status: PetStatus
  imagensExistentes: string[]
}

export interface PetFormSubmitPayload {
  nome: string
  descricao: string
  idadeMes: number
  idadeAno: number
  especie: PetEspecie
  cor: string
  sexo?: PetSexo
  status: PetStatus
  imagens: File[]
  imagensMantidas: string[]
}

interface PetFormProps {
  backTo: string
  backLabel: string
  error?: string | null
  initialValues: PetFormInitialValues
  intro: string
  isSubmitting?: boolean
  submitLabel: string
  title: string
  onSubmit: (payload: PetFormSubmitPayload) => Promise<void>
}

interface PetFormState {
  nome: string
  descricao: string
  idadeMes: number
  idadeAno: number
  especie: PetEspecie
  cor: string
  sexo: PetSexo | ''
  status: PetStatus
  imagensExistentes: string[]
  novasImagens: File[]
}

type EditablePetField = keyof Omit<
  PetFormState,
  'imagensExistentes' | 'novasImagens'
>

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

export const PetForm = ({
  backTo,
  backLabel,
  error,
  initialValues,
  intro,
  isSubmitting = false,
  submitLabel,
  title,
  onSubmit,
}: PetFormProps) => {
  const [formValues, setFormValues] = useState<PetFormState>({
    nome: initialValues.nome,
    descricao: initialValues.descricao,
    idadeMes: initialValues.idadeMes,
    idadeAno: initialValues.idadeAno,
    especie: initialValues.especie,
    cor: initialValues.cor,
    sexo: initialValues.sexo ?? '',
    status: initialValues.status,
    imagensExistentes: initialValues.imagensExistentes,
    novasImagens: [],
  })
  const [validationError, setValidationError] = useState<string | null>(null)

  const visibleError = validationError ?? error ?? null

  const selectedFilesLabel = useMemo(() => {
    if (formValues.novasImagens.length === 0) {
      return 'Nenhum novo arquivo selecionado.'
    }

    if (formValues.novasImagens.length === 1) {
      return formValues.novasImagens[0].name
    }

    return `${formValues.novasImagens.length} novos arquivos selecionados`
  }, [formValues.novasImagens])

  const handleFieldChange =
    (field: EditablePetField) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value = event.target.value
      setValidationError(null)

      setFormValues((current) => ({
        ...current,
        [field]:
          field === 'idadeMes' || field === 'idadeAno'
            ? Number(value) || 0
            : value,
      }))
    }

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    setValidationError(null)

    setFormValues((current) => {
      const currentFilesByKey = new Map(
        current.novasImagens.map((file) => [fileKey(file), file]),
      )

      selectedFiles.forEach((file) => {
        currentFilesByKey.set(fileKey(file), file)
      })

      return {
        ...current,
        novasImagens: Array.from(currentFilesByKey.values()),
      }
    })

    event.target.value = ''
  }

  const handleRemoveExistingImage = (imageUrl: string) => {
    setValidationError(null)
    setFormValues((current) => ({
      ...current,
      imagensExistentes: current.imagensExistentes.filter(
        (currentImage) => currentImage !== imageUrl,
      ),
    }))
  }

  const handleRemoveNewImage = (fileToRemove: File) => {
    const targetKey = fileKey(fileToRemove)
    setValidationError(null)
    setFormValues((current) => ({
      ...current,
      novasImagens: current.novasImagens.filter(
        (currentFile) => fileKey(currentFile) !== targetKey,
      ),
    }))
  }

  const validateForm = () => {
    if (formValues.nome.trim().length === 0) {
      return 'Informe o nome do pet.'
    }

    if (formValues.cor.trim().length === 0) {
      return 'Informe a cor do pet.'
    }

    if (formValues.idadeAno < 0 || formValues.idadeMes < 0) {
      return 'A idade nao pode ser negativa.'
    }

    if (formValues.idadeMes > 11) {
      return 'A idade em meses deve ficar entre 0 e 11.'
    }

    if (formValues.descricao.length > 200) {
      return 'A descricao pode ter no maximo 200 caracteres.'
    }

    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const currentValidationError = validateForm()
    if (currentValidationError) {
      setValidationError(currentValidationError)
      return
    }

    setValidationError(null)

    await onSubmit({
      nome: formValues.nome.trim(),
      descricao: formValues.descricao.trim(),
      idadeMes: formValues.idadeMes,
      idadeAno: formValues.idadeAno,
      especie: formValues.especie,
      cor: formValues.cor.trim(),
      sexo: formValues.sexo.trim() || undefined,
      status: formValues.status,
      imagens: formValues.novasImagens,
      imagensMantidas: formValues.imagensExistentes,
    })
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-4xl text-[var(--brand-brown-900)]">{title}</h1>
        <Link
          to={backTo}
          className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-bold text-[var(--brand-brown-900)] transition-colors hover:bg-[var(--brand-surface)]"
        >
          {backLabel}
        </Link>
      </div>

      <article className="rounded-3xl border border-[var(--brand-line)] bg-white p-5 md:p-7">
        <p className="mb-6 text-sm font-semibold text-[var(--brand-text-muted)]">
          {intro}
        </p>

        {visibleError ? (
          <div className="mb-6 rounded-2xl border border-[rgba(138,92,57,0.35)] bg-[rgba(138,92,57,0.12)] p-4">
            <p className="text-sm font-semibold text-[var(--brand-brown-900)]">
              {visibleError}
            </p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Nome
            </span>
            <input
              type="text"
              value={formValues.nome}
              onChange={handleFieldChange('nome')}
              placeholder="Ex.: Mel"
              required
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Espécie
            </span>
            <select
              value={formValues.especie}
              onChange={handleFieldChange('especie')}
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            >
              {especieOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Idade (meses)
            </span>
            <input
              type="number"
              min="0"
              max="11"
              value={formValues.idadeMes}
              onChange={handleFieldChange('idadeMes')}
              placeholder="Ex.: 1"
              required
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Idade (anos)
            </span>
            <input
              type="number"
              min="0"
              value={formValues.idadeAno}
              onChange={handleFieldChange('idadeAno')}
              placeholder="Ex.: 2"
              required
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Cor
            </span>
            <input
              type="text"
              value={formValues.cor}
              onChange={handleFieldChange('cor')}
              placeholder="Ex.: Caramelo"
              required
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Sexo
            </span>
            <select
              value={formValues.sexo}
              onChange={handleFieldChange('sexo')}
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            >
              {sexoOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Status
            </span>
            <select
              value={formValues.status}
              onChange={handleFieldChange('status')}
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2 flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Descricao
            </span>
            <textarea
              rows={4}
              value={formValues.descricao}
              onChange={handleFieldChange('descricao')}
              maxLength={200}
              placeholder="Conte um pouco sobre o pet..."
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none focus:ring-2 focus:ring-[rgba(120,135,34,0.35)]"
            />
            <span className="text-xs font-semibold text-[var(--brand-text-muted)]">
              {formValues.descricao.length}/200 caracteres
            </span>
          </label>

          {formValues.imagensExistentes.length > 0 ? (
            <div className="md:col-span-2 grid gap-3">
              <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
                Imagens atuais
              </span>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {formValues.imagensExistentes.map((imageUrl, index) => (
                  <article
                    key={`${imageUrl}-${index}`}
                    className="overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)]"
                  >
                    <img
                      src={imageUrl}
                      alt={`Imagem atual ${index + 1}`}
                      className="h-44 w-full object-cover"
                    />
                    <div className="flex items-center justify-between gap-3 p-3">
                      <span className="text-sm font-semibold text-[var(--brand-brown-900)]">
                        Imagem {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                        className="rounded-full border border-[rgba(138,92,57,0.28)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[var(--brand-brown-900)] transition-colors hover:bg-[rgba(138,92,57,0.1)]"
                      >
                        Remover
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <label className="md:col-span-2 flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--brand-text-muted)]">
              Novas imagens
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-semibold text-[var(--brand-brown-900)] outline-none"
            />
            <span className="text-xs font-semibold text-[var(--brand-text-muted)]">
              {selectedFilesLabel}
            </span>
            {formValues.novasImagens.length > 0 ? (
              <div className="grid gap-2 rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-3">
                {formValues.novasImagens.map((imagem) => (
                  <div
                    key={fileKey(imagem)}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2"
                  >
                    <span className="text-sm font-semibold text-[var(--brand-brown-900)]">
                      {imagem.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(imagem)}
                      className="rounded-full border border-[rgba(138,92,57,0.28)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[var(--brand-brown-900)] transition-colors hover:bg-[rgba(138,92,57,0.1)]"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[var(--brand-green-700)] px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-[var(--brand-surface)] transition-colors hover:bg-[var(--brand-green-900)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Salvando...' : submitLabel}
            </button>
          </div>
        </form>
      </article>
    </section>
  )
}
