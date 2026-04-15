import type { CreatePetPayload, PageResponse, Pet, UpdatePetPayload } from '../types/pet'
import { request } from './http'

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

const parseNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseImages = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const parseAnuncianteId = (payload: Record<string, unknown>): number => {
  if ('anuncianteId' in payload) return parseNumber(payload.anuncianteId)
  if (isObject(payload.anunciante) && 'id' in payload.anunciante) {
    return parseNumber(payload.anunciante.id)
  }
  return 0
}

const toPet = (payload: unknown): Pet => {
  if (!isObject(payload)) throw new Error('Resposta de pet inválida.')
  return {
    id: parseNumber(payload.id),
    nome: typeof payload.nome === 'string' ? payload.nome : 'Pet sem nome',
    imagens: parseImages(payload.imagens),
    descricao: typeof payload.descricao === 'string' ? payload.descricao : '',
    idadeMes: parseNumber(payload.idadeMes),
    idadeAno: parseNumber(payload.idadeAno),
    especie: typeof payload.especie === 'string' ? payload.especie : 'CACHORRO',
    cor: typeof payload.cor === 'string' ? payload.cor : 'Não informado',
    sexo: typeof payload.sexo === 'string' ? payload.sexo : undefined,
    status: typeof payload.status === 'string' ? payload.status : 'DISPONIVEL',
    anuncianteId: parseAnuncianteId(payload),
  }
}

// ---------------------------------------------------------------------------
// FormData builder
// ---------------------------------------------------------------------------

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

  if ('imagensMantidas' in payload) {
    payload.imagensMantidas.forEach((url) => fd.append('imagensMantidas', url))
  }

  return fd
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export const getPets = async (page = 0, size = 12): Promise<PageResponse<Pet>> => {
  const payload = await request<Record<string, unknown>>(`/pet/?page=${page}&size=${size}`)
  const items = Array.isArray(payload.content) ? payload.content : []
  return {
    content: items.map(toPet),
    totalPages: parseNumber(payload.totalPages, 1),
    totalElements: parseNumber(payload.totalElements, items.length),
    size: parseNumber(payload.size, size),
    number: parseNumber(payload.number, page),
    first: Boolean(payload.first),
    last: Boolean(payload.last),
  }
}

export const getAllPets = async (): Promise<Pet[]> => {
  const PAGE_SIZE = 100
  const first = await getPets(0, PAGE_SIZE)
  if (first.totalPages <= 1) return first.content

  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) => getPets(i + 1, PAGE_SIZE)),
  )
  return [...first.content, ...rest.flatMap((p) => p.content)]
}

export const getPetById = async (id: number): Promise<Pet> => {
  const payload = await request<unknown>(`/pet/${id}`)
  return toPet(payload)
}

export const createPet = async (payload: CreatePetPayload): Promise<Pet> => {
  // CORRIGIDO: usa `data` (não `json`) para que o axios defina multipart/form-data
  const created = await request<unknown>('/pet/', {
    method: 'POST',
    data: buildPetFormData(payload),
  })
  return toPet(created)
}

export const updatePet = async (id: number, payload: UpdatePetPayload): Promise<Pet> => {
  // CORRIGIDO: idem
  const updated = await request<unknown>(`/pet/${id}`, {
    method: 'PUT',
    data: buildPetFormData(payload),
  })
  return toPet(updated)
}

export const deletePet = async (id: number): Promise<void> => {
  await request<void>(`/pet/${id}`, { method: 'DELETE' })
}