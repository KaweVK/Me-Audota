import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export const RequireAuth = () => {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <section className="grid min-h-screen place-items-center px-6">
        <div className="w-full max-w-md rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center shadow-[0_30px_80px_-45px_rgba(34,24,18,0.55)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">
            MeAudota
          </p>
          <h1 className="mt-4 text-3xl text-[var(--brand-title)]">
            Restaurando sessao
          </h1>
          <p className="mt-3 text-sm text-[var(--brand-text-soft)]">
            Um instante enquanto carregamos os dados da conta.
          </p>
        </div>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
