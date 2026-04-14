import { useEffect, useMemo, useState } from 'react'
import { getAllUsers } from '../api/userApi'
import { UserCard } from '../components/users/UserCard'
import type { User } from '../types/user'
import { normalizeText } from '../utils/text'

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [reloadIndex, setReloadIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getAllUsers()
        setUsers(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Nao foi possivel carregar os usuarios.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadUsers()
  }, [reloadIndex])

  const filteredUsers = useMemo(() => {
    const term = normalizeText(search)

    if (term.length === 0) {
      return users
    }

    return users.filter((user) =>
      normalizeText([user.nome, user.email, user.telefone].join(' ')).includes(
        term,
      ),
    )
  }, [search, users])

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-6 shadow-[0_24px_60px_-42px_rgba(34,24,18,0.55)] md:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">
          Comunidade
        </p>
        <h1 className="mt-2 text-4xl text-[var(--brand-title)]">
          Usuarios cadastrados
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--brand-text-soft)]">
          Esta tela cobre o CRUD de usuarios do back-end novo, com busca local
          e acesso aos perfis detalhados de cada anunciante.
        </p>

        <label className="mt-6 flex max-w-xl flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">
            Buscar usuario
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome, e-mail ou telefone"
            className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
          />
        </label>
      </header>

      {error ? (
        <div className="rounded-[1.5rem] border border-[rgba(130,75,49,0.25)] bg-[rgba(130,75,49,0.08)] p-5">
          <p className="text-sm font-semibold text-[var(--brand-title)]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadIndex((current) => current + 1)}
            className="mt-4 rounded-full bg-[var(--brand-title)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-[1.75rem] border border-[var(--brand-line)] bg-white/70"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && users.length === 0 ? (
        <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center">
          <h2 className="text-3xl text-[var(--brand-title)]">
            Nenhum usuario encontrado
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--brand-text-soft)]">
            Cadastre um novo anunciante para iniciar a plataforma.
          </p>
        </article>
      ) : null}

      {!isLoading && !error && users.length > 0 && filteredUsers.length === 0 ? (
        <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 text-center">
          <h2 className="text-3xl text-[var(--brand-title)]">
            Nenhum resultado encontrado
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--brand-text-soft)]">
            Ajuste a busca para localizar outro perfil.
          </p>
        </article>
      ) : null}

      {!isLoading && !error && filteredUsers.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
