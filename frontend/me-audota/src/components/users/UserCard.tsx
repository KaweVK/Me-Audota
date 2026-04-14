import { Link } from 'react-router-dom'
import type { User } from '../../types/user'

interface UserCardProps {
  user: User
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link
      to={`/usuarios/${user.id}`}
      className="group flex h-full flex-col rounded-[1.75rem] border border-[var(--brand-line)] bg-white p-5 shadow-[0_20px_55px_-40px_rgba(34,24,18,0.65)] transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[rgba(86,110,42,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-highlight)]">
          Anunciante
        </span>
        <span className="text-sm font-semibold text-[var(--brand-text-soft)]">
          {user.petsAnunciadosIds.length} pets
        </span>
      </div>

      <h2 className="mt-5 text-2xl text-[var(--brand-title)]">{user.nome}</h2>

      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-muted)]">
            E-mail
          </dt>
          <dd className="mt-1 text-[var(--brand-text-soft)]">{user.email}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-muted)]">
            Telefone
          </dt>
          <dd className="mt-1 text-[var(--brand-text-soft)]">{user.telefone}</dd>
        </div>
      </dl>

      <span className="mt-auto pt-6 text-sm font-semibold text-[var(--brand-highlight)]">
        Ver perfil
      </span>
    </Link>
  )
}
