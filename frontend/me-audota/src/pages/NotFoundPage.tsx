import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export const NotFoundPage = () => {
  const { isAuthenticated } = useAuth()
  const homePath = isAuthenticated ? '/pets' : '/login'

  return (
    <section className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-xl rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center shadow-[0_24px_60px_-42px_rgba(34,24,18,0.55)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-text-muted)]">
          Página não encontrada
        </p>
        <h1 className="mt-4 text-5xl text-[var(--brand-title)]">404</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">
          O caminho acessado não existe. Volte para o início e tente outro caminho.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={homePath}
            className="rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
          >
            Ir para o início
          </Link>
          {isAuthenticated ? (
            <Link
              to="/usuarios"
              className="rounded-full border border-[var(--brand-line)] px-5 py-3 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]"
            >
              Ver usuários
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
