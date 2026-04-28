import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { CreateUsuarioPayload, UpdateUsuarioPayload } from '../../types/user'

const labelCls = 'text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]'
const fieldCls = 'rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-2">
    <span className={labelCls}>{label}</span>
    {children}
  </label>
)

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
  onSubmit: (payload: CreateUsuarioPayload | UpdateUsuarioPayload) => Promise<void>
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
    (field: EditableUserField) => (event: ChangeEvent<HTMLInputElement>) => {
      setValidationError(null)
      setFormValues((curr) => ({ ...curr, [field]: event.target.value }))
    }

  const validate = (): string | null => {
    if (!formValues.nome.trim()) return 'Informe o nome do usuário.'
    if (!formValues.email.trim()) return 'Informe o e-mail.'
    if (!formValues.telefone.trim()) return 'Informe o telefone.'
    if (formValues.senha.trim().length < 6) return 'A senha precisa ter pelo menos 6 caracteres.'
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const err = validate()
    if (err) { setValidationError(err); return }

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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">Usuários</p>
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
        <p className="max-w-3xl text-sm leading-7 text-[var(--brand-text-soft)]">{intro}</p>

        {visibleError && (
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-4 text-sm font-semibold text-[var(--brand-title)]">
            {visibleError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Nome">
            <input type="text" value={formValues.nome} onChange={handleChange('nome')}
              placeholder="Nome completo" required className={fieldCls} />
          </Field>

          <Field label="E-mail">
            <input type="email" value={formValues.email} onChange={handleChange('email')}
              placeholder="voce@exemplo.com" required className={fieldCls} />
          </Field>

          <Field label="Telefone">
            <input type="tel" value={formValues.telefone} onChange={handleChange('telefone')}
              placeholder="(00) 00000-0000" required className={fieldCls} />
          </Field>

          <Field label="Senha">
            <input type="password" value={formValues.senha} onChange={handleChange('senha')}
              placeholder="Mínimo de 6 caracteres" required className={fieldCls} />
          </Field>

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