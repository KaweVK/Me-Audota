import type { CreatePetPayload, PageResponse, Pet, UpdatePetPayload } from '../types/pet'
import { request } from './api'

const num = (v: unknown, fallback = 0) => { const n = Number(v); return Number.isFinite(n) ? n : fallback }
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
const parseImages = (v: unknown): string[] => Array.isArray(v) ? v.filter((i): i is string => typeof i === 'string') : []

const toPet = (payload: unknown): Pet => {
  if (!isObj(payload)) throw new Error('Resposta de pet inválida.')
  return {
    id: num(payload.id),
    nome: typeof payload.nome === 'string' ? payload.nome : 'Pet sem nome',
    imagens: parseImages(payload.imagens),
    descricao: typeof payload.descricao === 'string' ? payload.descricao : '',
    idadeMes: num(payload.idadeMes),
    idadeAno: num(payload.idadeAno),
    especie: typeof payload.especie === 'string' ? payload.especie : 'CACHORRO',
    cor: typeof payload.cor === 'string' ? payload.cor : 'Não informado',
    sexo: typeof payload.sexo === 'string' ? payload.sexo : undefined,
    status: typeof payload.status === 'string' ? payload.status : 'DISPONIVEL',
    anuncianteId: 'anuncianteId' in payload
      ? num(payload.anuncianteId)
      : isObj(payload.anunciante) ? num(payload.anunciante.id) : 0,
  }
}

const buildPetFormData = (payload: CreatePetPayload | UpdatePetPayload): FormData => {
  const fd = new FormData()
  fd.append('nome', payload.nome.trim())
  fd.append('descricao', payload.descricao.trim())
  fd.append('idadeMes', String(payload.idadeMes))
  fd.append('idadeAno', String(payload.idadeAno))
  fd.append('especie', payload.especie)
  fd.append('cor', payload.cor.trim())
  fd.append('status', payload.status)
  fd.append('anuncianteId', String(payload.anuncianteId))
  if (payload.sexo?.trim()) fd.append('sexo', payload.sexo.trim())
  payload.imagens.forEach((img) => fd.append('imagens', img))
  if ('imagensMantidas' in payload) payload.imagensMantidas.forEach((url) => fd.append('imagensMantidas', url))
  return fd
}

export const getPets = async (page = 0, size = 12): Promise<PageResponse<Pet>> => {
  const p = await request<Record<string, unknown>>(`/pet/?page=${page}&size=${size}`)
  const items = Array.isArray(p.content) ? p.content : []
  return {
    content: items.map(toPet),
    totalPages: num(p.totalPages, 1),
    totalElements: num(p.totalElements, items.length),
    size: num(p.size, size),
    number: num(p.number, page),
    first: Boolean(p.first),
    last: Boolean(p.last),
  }
}

export const getAllPets = async (): Promise<Pet[]> => {
  const first = await getPets(0, 100)
  if (first.totalPages <= 1) return first.content
  const rest = await Promise.all(Array.from({ length: first.totalPages - 1 }, (_, i) => getPets(i + 1, 100)))
  return [...first.content, ...rest.flatMap((p) => p.content)]
}

export const getPetById = async (id: number) => toPet(await request<unknown>(`/pet/${id}`))
export const createPet = async (payload: CreatePetPayload) => toPet(await request<unknown>('/pet/', { method: 'POST', data: buildPetFormData(payload) }))
export const updatePet = async (id: number, payload: UpdatePetPayload) => toPet(await request<unknown>(`/pet/${id}`, { method: 'PUT', data: buildPetFormData(payload) }))
export const deletePet = (id: number) => request<void>(`/pet/${id}`, { method: 'DELETE' })