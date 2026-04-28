import { useEffect, useMemo, useState } from 'react'
import { getAllUsers } from '../../services/usuarioApi'
import { UserCard } from '../../components/UserCard'
import type { Usuario } from '../../types/user'
import { normalizeText } from '../../utils/text'
import SubHeader from '../../components/SubHeader'

export const Usuarios = () => {
  const [users, setUsers] = useState<Usuario[]>([])
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
            : 'Não foi possível carregar os usuários.',
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
      normalizeText([user.nome, user.email].join(' ')).includes(
        term,
      ),
    )
  }, [search, users])

  return (
    <section className="flex w-full flex-col gap-6">
      <SubHeader
        title="Usuários cadastrados"
        description="Conheça os usuários cadastrados!"
        search={search}
        setSearch={setSearch}
        filteredList={filteredUsers}
        fullList={users}
        searchPlaceholder="Nome do usuário"
      />

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
            Nenhum usuário encontrado
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
