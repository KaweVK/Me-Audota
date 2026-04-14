import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../api/userApi'
import { AuthCard } from '../components/auth/AuthCard'
import {
  UserForm,
  type UserFormInitialValues,
} from '../components/users/UserForm'
import { useAuth } from '../auth/useAuth'
import type { CreateUserPayload } from '../types/user'

const initialValues: UserFormInitialValues = {
  nome: '',
  email: '',
  senha: '',
  telefone: '',
}

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (payload: CreateUserPayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await createUser(payload)
      await login({
        email: payload.email,
        senha: payload.senha,
      })
      navigate('/pets', { replace: true })
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
    <AuthCard
      title="Criar conta no MeAudota"
      intro="O seu novo melhor amigo está a apenas alguns cliques de distância!"
      alternateAction={
        <p>
          Já tem conta?{' '}
          <Link
            to="/login"
            className="font-semibold text-[var(--brand-highlight)]"
          >
            Fazer login
          </Link>
        </p>
      }
    >
      <UserForm
        backTo="/login"
        backLabel="Voltar ao login"
        error={error}
        initialValues={initialValues}
        intro="Preencha os dados abaixo para criar uma conta nova."
        isSubmitting={isSubmitting}
        submitLabel="Criar conta"
        title="Novo usuário"
        onSubmit={handleSubmit}
      />
    </AuthCard>
  )
}
