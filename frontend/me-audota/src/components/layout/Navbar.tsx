import { Link, NavLink } from 'react-router-dom'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-[var(--brand-green-700)] text-[var(--brand-surface)]'
      : 'text-[var(--brand-text)] hover:bg-[var(--brand-surface-strong)]',
  ].join(' ')

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--brand-line)] bg-[rgba(248,244,234,0.94)] backdrop-blur">
      <div className="flex w-full items-center justify-between gap-4 px-6 py-4 md:px-10 lg:px-14">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/me-audota.png"
            alt="Logo Me Audota"
            className="h-11 w-11 rounded-full border border-[var(--brand-line)] bg-white p-1"
          />
          <div>
            <p className="text-lg font-extrabold leading-none text-[var(--brand-brown-900)] md:text-xl">
              MeAudota
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-text-muted)]">
              Encontre um novo melhor amigo
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 rounded-full border border-[var(--brand-line)] bg-white/70 p-1">
          <NavLink to="/" className={navLinkClassName} end>
            Inicio
          </NavLink>
          <NavLink to="/pets/novo" className={navLinkClassName} end>
            Divulgar Pet
          </NavLink>
          <NavLink to="/adotados" className={navLinkClassName} end>
            Adotados
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
