import type { PageResponse } from '../types/pet'
import type { CreateUsuarioPayload, UpdateUsuarioPayload, Usuario } from '../types/user'
import { request } from './api'

const num = (v: unknown, fallback = 0) => { const n = Number(v); return Number.isFinite(n) ? n : fallback }
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
const parseIdList = (v: unknown): number[] =>
  Array.isArray(v) ? v.map(Number).filter((n) => Number.isFinite(n) && n > 0) : []

const toUser = (payload: unknown): Usuario => {
  if (!isRecord(payload)) throw new Error('Resposta de usuário inválida.')
  return {
    id: num(payload.id),
    nome: typeof payload.nome === 'string' ? payload.nome : 'Usuário sem nome',
    email: typeof payload.email === 'string' ? payload.email : '',
    telefone: typeof payload.telefone === 'string' ? payload.telefone : '',
    petsAnunciadosIds: parseIdList(payload.petsAnunciadosIds),
  }
}

const toPageResponse = (payload: unknown, page: number, size: number): PageResponse<Usuario> => {
  const data = isRecord(payload) ? payload : {}
  const content = Array.isArray(data.content) ? data.content : []
  return {
    content: content.map(toUser),
    totalPages: num(data.totalPages, 1),
    totalElements: num(data.totalElements, content.length),
    size: num(data.size, size),
    number: num(data.number, page),
    first: Boolean(data.first),
    last: Boolean(data.last),
  }
}

const buildUserFormData = (payload: CreateUsuarioPayload | UpdateUsuarioPayload): FormData => {
  const fd = new FormData()
  fd.append('nome', payload.nome.trim())
  fd.append('email', payload.email.trim())
  fd.append('senha', payload.senha)
  fd.append('telefone', payload.telefone.trim())
  return fd
}

export const getUsers = async (page = 0, size = 20): Promise<PageResponse<Usuario>> =>
  toPageResponse(await request<unknown>(`/usuarios/?page=${page}&size=${size}`), page, size)

export const getAllUsers = async (): Promise<Usuario[]> => {
  const first = await getUsers(0, 100)
  if (first.totalPages <= 1) return first.content
  const rest = await Promise.all(Array.from({ length: first.totalPages - 1 }, (_, i) => getUsers(i + 1, 100)))
  return [...first.content, ...rest.flatMap((p) => p.content)]
}

export const getUserById = async (id: number) => toUser(await request<unknown>(`/usuarios/${id}`))
export const createUser = async (payload: CreateUsuarioPayload) => toUser(await request<unknown>('/usuarios/', { method: 'POST', data: buildUserFormData(payload) }))
export const updateUser = async (id: number, payload: UpdateUsuarioPayload) => toUser(await request<unknown>(`/usuarios/${id}`, { method: 'PUT', data: buildUserFormData(payload) }))
export const deleteUser = (id: number) => request<void>(`/usuarios/${id}`, { method: 'DELETE' })