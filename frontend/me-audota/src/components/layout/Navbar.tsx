import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-[var(--brand-highlight)] text-white'
      : 'text-[var(--brand-title)] hover:bg-[var(--brand-surface-strong)]',
  ].join(' ')

export const Navbar = () => {
  const { currentUser, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--brand-line)] bg-[rgba(247,242,233,0.92)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-8">
        <Link to="/pets" className="flex items-center gap-3">
          <img
            src="/me-audota.png"
            alt="Logo MeAudota"
            className="h-11 w-11 rounded-full border border-[var(--brand-line)] bg-white p-1"
          />
          <div>
            <p className="text-lg font-semibold leading-none text-[var(--brand-title)]">
              MeAudota
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">
              Painel de adocao
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 rounded-full border border-[var(--brand-line)] bg-white/80 p-1">
          <NavLink to="/pets" className={navLinkClassName} end>
            Pets
          </NavLink>
          <NavLink to="/adotados" className={navLinkClassName}>
            Adotados
          </NavLink>
          <NavLink to="/usuarios" className={navLinkClassName}>
            Usuarios
          </NavLink>
          <NavLink to="/pets/novo" className={navLinkClassName}>
            Novo pet
          </NavLink>
        </nav>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            to={currentUser ? `/usuarios/${currentUser.id}` : '/perfil'}
            className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-title)] transition-colors hover:bg-[var(--brand-surface-strong)]"
          >
            {currentUser?.nome ?? 'Meu perfil'}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-[var(--brand-title)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
