import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/auth/AuthCard'
import { useAuth } from '../auth/useAuth'
import { ROUTES } from '../routes'

interface LoginLocationState {
  from?: {
    pathname?: string
  }
}

const resolveRedirectPath = (state: unknown): string => {
  if (typeof state !== 'object' || state === null) {
    return ROUTES.PETS
  }

  const locationState = state as LoginLocationState
  return locationState.from?.pathname ?? ROUTES.PETS
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const destination = resolveRedirectPath(location.state)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await login({
        email: email.trim(),
        senha,
      })

      navigate(destination, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível entrar agora.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Entrar na plataforma"
      intro="O seu novo melhor amigo está a alguns cliques de distância!"
      alternateAction={
        <p>
          Ainda não tem conta?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-semibold text-[var(--brand-highlight)]"
          >
            Criar usuário
          </Link>
        </p>
      }
    >
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">
        Login
      </p>
      <h2 className="mt-3 text-3xl text-[var(--brand-title)]">
        Acesse sua conta
      </h2>

      {error ? (
        <div className="mt-6 rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-4 text-sm font-semibold text-[var(--brand-title)]">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
            E-mail
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            placeholder="voce@exemplo.com"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
            Senha
          </span>
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
            placeholder="Sua senha"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-[var(--brand-highlight)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </AuthCard>
  )
}
