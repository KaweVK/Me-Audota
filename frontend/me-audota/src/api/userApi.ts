import type { PageResponse } from '../types/pet'
import type { CreateUserPayload, UpdateUserPayload, User } from '../types/user'
import { request } from './http'

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

const parseNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseIdList = (value: unknown): number[] =>
  Array.isArray(value)
    ? value.map(Number).filter((n) => Number.isFinite(n) && n > 0)
    : []

const toUser = (payload: unknown): User => {
  if (!isRecord(payload)) throw new Error('Resposta de usuário inválida.')
  return {
    id: parseNumber(payload.id),
    nome: typeof payload.nome === 'string' ? payload.nome : 'Usuário sem nome',
    email: typeof payload.email === 'string' ? payload.email : '',
    telefone: typeof payload.telefone === 'string' ? payload.telefone : '',
    petsAnunciadosIds: parseIdList(payload.petsAnunciadosIds),
  }
}

const toPageResponse = (payload: unknown, page: number, size: number): PageResponse<User> => {
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

// ---------------------------------------------------------------------------
// FormData builder
// ---------------------------------------------------------------------------

const buildUserFormData = (payload: CreateUserPayload | UpdateUserPayload): FormData => {
  const fd = new FormData()
  fd.append('nome', payload.nome.trim())
  fd.append('email', payload.email.trim())
  fd.append('senha', payload.senha)
  fd.append('telefone', payload.telefone.trim())
  return fd
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export const getUsers = async (page = 0, size = 20): Promise<PageResponse<User>> => {
  const response = await request<unknown>(`/usuarios/?page=${page}&size=${size}`)
  return toPageResponse(response, page, size)
}

export const getAllUsers = async (): Promise<User[]> => {
  const PAGE_SIZE = 100
  const first = await getUsers(0, PAGE_SIZE)
  if (first.totalPages <= 1) return first.content

  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) => getUsers(i + 1, PAGE_SIZE)),
  )
  return [...first.content, ...rest.flatMap((p) => p.content)]
}

export const getUserById = async (id: number): Promise<User> => {
  const response = await request<unknown>(`/usuarios/${id}`)
  return toUser(response)
}

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  // CORRIGIDO: era `body:` (campo inexistente em RequestOptions → ignorado silenciosamente)
  // Agora usa `data:` para enviar o FormData corretamente
  const response = await request<unknown>('/usuarios/', {
    method: 'POST',
    data: buildUserFormData(payload),
  })
  return toUser(response)
}

export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<User> => {
  // CORRIGIDO: idem
  const response = await request<unknown>(`/usuarios/${id}`, {
    method: 'PUT',
    data: buildUserFormData(payload),
  })
  return toUser(response)
}

export const deleteUser = async (id: number): Promise<void> => {
  await request<void>(`/usuarios/${id}`, { method: 'DELETE' })
}