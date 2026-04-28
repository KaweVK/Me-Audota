import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUserById, updateUser } from '../../services/usuarioApi'
import { useAuth } from '../../hooks/useAuth'
import { UserForm, type UserFormInitialValues } from '../../components/UserForm'
import type { UpdateUsuarioPayload, Usuario } from '../../types/user'

export const EditUser = () => {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)
  const navigate = useNavigate()
  const { currentUser, refreshCurrentUser } = useAuth()

  const [user, setUser] = useState<Usuario | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOwner = currentUser?.id === userId

  useEffect(() => {
    if (!Number.isFinite(userId) || userId <= 0) {
      setError('Identificador de usuário inválido.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    getUserById(userId)
      .then(setUser)
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar o usuário.'))
      .finally(() => setIsLoading(false))
  }, [userId])

  const handleSubmit = async (payload: UpdateUsuarioPayload) => {
    if (!user || !isOwner) {
      setError('Você só pode editar a própria conta.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await updateUser(user.id, payload)
      await refreshCurrentUser()
      navigate(`/usuarios/${user.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o usuário.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return (
    <section className="w-full">
      <div className="h-[60vh] animate-pulse rounded-[2rem] border border-[var(--brand-line)] bg-white/70" />
    </section>
  )

  if (error && !user) return (
    <section className="w-full rounded-[2rem] border border-[var(--brand-line)] bg-white p-8">
      <h1 className="text-4xl text-[var(--brand-title)]">Edição indisponível</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">{error}</p>
      <Link to="/usuarios" className="mt-6 inline-flex rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]">
        Voltar para usuários
      </Link>
    </section>
  )

  if (!user || !isOwner) return (
    <section className="w-full rounded-[2rem] border border-[var(--brand-line)] bg-white p-8">
      <h1 className="text-4xl text-[var(--brand-title)]">Acesso bloqueado</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">
        Apenas o próprio usuário pode editar a conta exibida nesta rota.
      </p>
      <Link to={user ? `/usuarios/${user.id}` : '/usuarios'} className="mt-6 inline-flex rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]">
        Voltar ao perfil
      </Link>
    </section>
  )

  const initialValues: UserFormInitialValues = {
    nome: user.nome,
    email: user.email,
    senha: '',
    telefone: user.telefone,
  }

  return (
    <UserForm
      backTo={`/usuarios/${user.id}`}
      backLabel="Voltar ao perfil"
      error={error}
      initialValues={initialValues}
      intro="Atualize seus dados. Informe uma nova senha ou repita a atual para concluir a alteração."
      isSubmitting={isSubmitting}
      submitLabel="Salvar alterações"
      title="Editar conta"
      onSubmit={handleSubmit}
    />
  )
}