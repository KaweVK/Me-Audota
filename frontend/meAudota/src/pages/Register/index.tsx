import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../../services/usuarioApi'
import { CardLogin } from '../../components/CardLogin'
import { UserForm, type UserFormInitialValues } from '../../components/UserForm'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../routes/routes'
import type { CreateUsuarioPayload } from '../../types/user'

const initialValues: UserFormInitialValues = {
  nome: '',
  email: '',
  senha: '',
  telefone: '',
}

export const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (payload: CreateUsuarioPayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await createUser(payload)
      await login({
        email: payload.email,
        senha: payload.senha,
      })
      navigate(ROUTES.PETS, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível criar a conta agora.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CardLogin
      title="Criar conta no MeAudota"
      intro="O seu novo melhor amigo está a apenas alguns cliques de distância!"
      alternateAction={
        <p>
          Já tem conta?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-[var(--brand-highlight)]"
          >
            Fazer login
          </Link>
        </p>
      }
    >
      <UserForm
        backTo={ROUTES.LOGIN}
        backLabel="Voltar ao login"
        error={error}
        initialValues={initialValues}
        intro="Preencha os dados abaixo para criar uma conta nova."
        isSubmitting={isSubmitting}
        submitLabel="Criar conta"
        title="Novo usuário"
        onSubmit={handleSubmit}
      />
    </CardLogin>
  )
}
