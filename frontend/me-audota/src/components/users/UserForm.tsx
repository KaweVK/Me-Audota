import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { CreateUserPayload, UpdateUserPayload } from '../../types/user'

export interface UserFormInitialValues {
  nome: string
  email: string
  senha: string
  telefone: string
}

interface UserFormProps {
  backLabel: string
  backTo: string
  error?: string | null
  initialValues: UserFormInitialValues
  intro: string
  isSubmitting?: boolean
  submitLabel: string
  title: string
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => Promise<void>
}

type UserFormState = UserFormInitialValues
type EditableUserField = keyof UserFormState

export const UserForm = ({
  backLabel,
  backTo,
  error,
  initialValues,
  intro,
  isSubmitting = false,
  submitLabel,
  title,
  onSubmit,
}: UserFormProps) => {
  const [formValues, setFormValues] = useState<UserFormState>(initialValues)
  const [validationError, setValidationError] = useState<string | null>(null)

  const visibleError = validationError ?? error ?? null

  const handleChange =
    (field: EditableUserField) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValidationError(null)
      setFormValues((current) => ({
        ...current,
        [field]: value,
      }))
    }

  const validate = () => {
    if (formValues.nome.trim().length === 0) {
      return 'Informe o nome do usuário.'
    }

    if (formValues.email.trim().length === 0) {
      return 'Informe o e-mail.'
    }

    if (formValues.telefone.trim().length === 0) {
      return 'Informe o telefone.'
    }

    if (formValues.senha.trim().length < 6) {
      return 'A senha precisa ter pelo menos 6 caracteres.'
    }

    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextError = validate()
    if (nextError) {
      setValidationError(nextError)
      return
    }

    setValidationError(null)

    await onSubmit({
      nome: formValues.nome.trim(),
      email: formValues.email.trim(),
      senha: formValues.senha,
      telefone: formValues.telefone.trim(),
    })
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">
            Usuários
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
              onChange={handleChange('nome')}
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
              placeholder="Nome completo"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              E-mail
            </span>
            <input
              type="email"
              value={formValues.email}
              onChange={handleChange('email')}
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
              placeholder="voce@exemplo.com"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Telefone
            </span>
            <input
              type="tel"
              value={formValues.telefone}
              onChange={handleChange('telefone')}
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
              placeholder="(00) 00000-0000"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
              Senha
            </span>
            <input
              type="password"
              value={formValues.senha}
              onChange={handleChange('senha')}
              className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
              placeholder="Minimo de 6 caracteres"
              required
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
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
