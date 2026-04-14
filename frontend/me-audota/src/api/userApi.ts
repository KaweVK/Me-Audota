import type { PageResponse } from '../types/pet'
import type { CreateUserPayload, UpdateUserPayload, User } from '../types/user'
import { request } from './http'

const parseNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseIdList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0)
}

const toUser = (payload: unknown): User => {
  if (!isRecord(payload)) {
    throw new Error('Resposta de usuario invalida.')
  }

  return {
    id: parseNumber(payload.id, 0),
    nome: typeof payload.nome === 'string' ? payload.nome : 'Usuario sem nome',
    email: typeof payload.email === 'string' ? payload.email : '',
    telefone: typeof payload.telefone === 'string' ? payload.telefone : '',
    petsAnunciadosIds: parseIdList(payload.petsAnunciadosIds),
  }
}

const toPageResponse = (
  payload: unknown,
  page: number,
  size: number,
): PageResponse<User> => {
  const data = isRecord(payload) ? payload : {}
  const content = Array.isArray(data.content) ? data.content : []

  return {
    content: content.map(toUser),
    totalPages: parseNumber(data.totalPages, 1),
    totalElements: parseNumber(data.totalElements, content.length),
    size: parseNumber(data.size, size),
    number: parseNumber(data.number, page),
    first: Boolean(data.first),
    last: Boolean(data.last),
  }
}

const buildUserFormData = (payload: CreateUserPayload | UpdateUserPayload) => {
  const formData = new FormData()
  formData.append('nome', payload.nome.trim())
  formData.append('email', payload.email.trim())
  formData.append('senha', payload.senha)
  formData.append('telefone', payload.telefone.trim())
  return formData
}

export const getUsers = async (
  page = 0,
  size = 20,
): Promise<PageResponse<User>> => {
  const response = await request<unknown>(`/usuarios/?page=${page}&size=${size}`)
  return toPageResponse(response, page, size)
}

export const getAllUsers = async () => {
  const pageSize = 100
  const firstPage = await getUsers(0, pageSize)

  if (firstPage.totalPages <= 1) {
    return firstPage.content
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      getUsers(index + 1, pageSize),
    ),
  )

  return [
    ...firstPage.content,
    ...remainingPages.flatMap((pageData) => pageData.content),
  ]
}

export const getUserById = async (id: number) => {
  const response = await request<unknown>(`/usuarios/${id}`)
  return toUser(response)
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await request<unknown>('/usuarios/', {
    method: 'POST',
    auth: false,
    body: buildUserFormData(payload),
  })

  return toUser(response)
}

export const updateUser = async (id: number, payload: UpdateUserPayload) => {
  const response = await request<unknown>(`/usuarios/${id}`, {
    method: 'PUT',
    body: buildUserFormData(payload),
  })

  return toUser(response)
}

export const deleteUser = async (id: number) => {
  await request<void>(`/usuarios/${id}`, {
    method: 'DELETE',
  })
}
