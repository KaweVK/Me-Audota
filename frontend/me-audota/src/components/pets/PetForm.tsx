import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { PetEspecie, PetStatus, PetSexo } from '../../types/pet'

const especieOptions: Array<{ label: string; value: PetEspecie }> = [
  { label: 'Cachorro', value: 'CACHORRO' },
  { label: 'Gato', value: 'GATO' },
]

const sexoOptions: Array<{ label: string; value: PetSexo | '' }> = [
  { label: 'Não informado', value: '' },
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
      return 'Nenhum arquivo novo selecionado.'
    }

    if (formValues.novasImagens.length === 1) {
      return formValues.novasImagens[0].name
    }

    return `${formValues.novasImagens.length} arquivos prontos para envio`
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
      return 'A idade não pode ser negativa.'
    }

    if (formValues.idadeMes > 11) {
      return 'A idade em meses deve ficar entre 0 e 11.'
    }

    if (formValues.descricao.length > 200) {
      return 'A descrição pode ter no máximo 200 caracteres.'
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">
            Pets
          </p>
          <h1 className="mt-2 text-4xl text-[var(--brand-title)]">{title}</h1>
        </div>

        <Link
          to={backTo}
          className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]"
        >
          {backLabel}
        </Link>
      </div>

      <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-6 shadow-[0_24px_60px_-42px_rgba(34,24,18,0.55)] md:p-8">
        <p className="max-w-3xl text-sm leading-7 text-[var(--brand-text-soft)]">
          {intro}
        </p>

        {visibleError ? (
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-4 text-sm font-semibold text-[var(--brand-title)]">
            {visibleError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Nome
            </span>
            <input
              type="text"
              value={formValues.nome}
              onChange={handleFieldChange('nome')}
              placeholder="Ex.: Mel"
              required
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Espécie
            </span>
            <select
              value={formValues.especie}
              onChange={handleFieldChange('especie')}
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            >
              {especieOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Idade em meses
            </span>
            <input
              type="number"
              min="0"
              max="11"
              value={formValues.idadeMes}
              onChange={handleFieldChange('idadeMes')}
              placeholder="Ex.: 1"
              required
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Idade em anos
            </span>
            <input
              type="number"
              min="0"
              value={formValues.idadeAno}
              onChange={handleFieldChange('idadeAno')}
              placeholder="Ex.: 2"
              required
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Cor
            </span>
            <input
              type="text"
              value={formValues.cor}
              onChange={handleFieldChange('cor')}
              placeholder="Ex.: Caramelo"
              required
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Sexo
            </span>
            <select
              value={formValues.sexo}
              onChange={handleFieldChange('sexo')}
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            >
              {sexoOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Status
            </span>
            <select
              value={formValues.status}
              onChange={handleFieldChange('status')}
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Descrição
            </span>
            <textarea
              rows={4}
              value={formValues.descricao}
              onChange={handleFieldChange('descricao')}
              maxLength={200}
              placeholder="Conte um pouco sobre o pet"
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            />
            <span className="text-xs font-medium text-[var(--brand-text-soft)]">
              {formValues.descricao.length}/200 caracteres
            </span>
          </label>

          {formValues.imagensExistentes.length > 0 ? (
            <div className="grid gap-3 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
                Imagens atuais
              </span>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {formValues.imagensExistentes.map((imageUrl, index) => (
                  <article
                    key={`${imageUrl}-${index}`}
                    className="overflow-hidden rounded-[1.5rem] border border-[var(--brand-line)] bg-[var(--brand-surface)]"
                  >
                    <img
                      src={imageUrl}
                      alt={`Imagem atual ${index + 1}`}
                      className="h-44 w-full object-cover"
                    />
                    <div className="flex items-center justify-between gap-3 p-3">
                      <span className="text-sm font-medium text-[var(--brand-title)]">
                        Imagem {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                        className="rounded-full border border-[rgba(130,75,49,0.2)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-title)] transition-colors hover:bg-[rgba(130,75,49,0.08)]"
                      >
                        Remover
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Novas imagens
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none"
            />
            <span className="text-xs font-medium text-[var(--brand-text-soft)]">
              {selectedFilesLabel}
            </span>

            {formValues.novasImagens.length > 0 ? (
              <div className="grid gap-2 rounded-[1.5rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] p-3">
                {formValues.novasImagens.map((imagem) => (
                  <div
                    key={fileKey(imagem)}
                    className="flex items-center justify-between gap-3 rounded-[1rem] bg-white px-3 py-2"
                  >
                    <span className="text-sm font-medium text-[var(--brand-title)]">
                      {imagem.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(imagem)}
                      className="rounded-full border border-[rgba(130,75,49,0.2)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-title)] transition-colors hover:bg-[rgba(130,75,49,0.08)]"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-2 md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[var(--brand-highlight)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Salvando...' : submitLabel}
            </button>
          </div>
        </form>
      </article>
    </section>
  )
}
