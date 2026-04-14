import type { CreatePetPayload, PageResponse, Pet, UpdatePetPayload } from '../types/pet'
import { request } from './http'

const parseNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseImages = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string')
}

const parseAnuncianteId = (payload: Record<string, unknown>) => {
  if ('anuncianteId' in payload) {
    return parseNumber(payload.anuncianteId, 0)
  }

  if (
    'anunciante' in payload &&
    isObject(payload.anunciante) &&
    'id' in payload.anunciante
  ) {
    return parseNumber(payload.anunciante.id, 0)
  }

  return 0
}

const toPet = (payload: unknown): Pet => {
  if (!isObject(payload)) {
    throw new Error('Resposta de pet invalida.')
  }

  return {
    id: parseNumber(payload.id, 0),
    nome: typeof payload.nome === 'string' ? payload.nome : 'Pet sem nome',
    imagens: parseImages(payload.imagens),
    descricao: typeof payload.descricao === 'string' ? payload.descricao : '',
    idadeMes: parseNumber(payload.idadeMes, 0),
    idadeAno: parseNumber(payload.idadeAno, 0),
    especie:
      typeof payload.especie === 'string' ? payload.especie : 'CACHORRO',
    cor: typeof payload.cor === 'string' ? payload.cor : 'Nao informado',
    sexo: typeof payload.sexo === 'string' ? payload.sexo : undefined,
    status: typeof payload.status === 'string' ? payload.status : 'DISPONIVEL',
    anuncianteId: parseAnuncianteId(payload),
  }
}

const appendOptionalField = (
  formData: FormData,
  name: string,
  value: string | undefined,
) => {
  if (value && value.trim().length > 0) {
    formData.append(name, value.trim())
  }
}

const buildPetFormData = (
  payload: CreatePetPayload | UpdatePetPayload,
): FormData => {
  const formData = new FormData()

  formData.append('nome', payload.nome.trim())
  formData.append('descricao', payload.descricao.trim())
  formData.append('idadeMes', String(payload.idadeMes))
  formData.append('idadeAno', String(payload.idadeAno))
  formData.append('especie', payload.especie)
  formData.append('cor', payload.cor.trim())
  formData.append('status', payload.status)
  formData.append('anuncianteId', String(payload.anuncianteId))
  appendOptionalField(formData, 'sexo', payload.sexo)

  payload.imagens.forEach((imagem) => {
    formData.append('imagens', imagem)
  })

  if ('imagensMantidas' in payload) {
    payload.imagensMantidas.forEach((imagemUrl) => {
      formData.append('imagensMantidas', imagemUrl)
    })
  }

  return formData
}

export const getPets = async (
  page = 0,
  size = 12,
): Promise<PageResponse<Pet>> => {
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
  const pageSize = 100
  const firstPage = await getPets(0, pageSize)

  if (firstPage.totalPages <= 1) {
    return firstPage.content
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      getPets(index + 1, pageSize),
    ),
  )

  return [
    ...firstPage.content,
    ...remainingPages.flatMap((pageData) => pageData.content),
  ]
}

export const getPetById = async (id: number): Promise<Pet> => {
  const payload = await request<unknown>(`/pet/${id}`)
  return toPet(payload)
}

export const createPet = async (payload: CreatePetPayload): Promise<Pet> => {
  const createdPet = await request<unknown>('/pet/', {
    method: 'POST',
    body: buildPetFormData(payload),
  })

  return toPet(createdPet)
}

export const updatePet = async (
  id: number,
  payload: UpdatePetPayload,
): Promise<Pet> => {
  const updatedPet = await request<unknown>(`/pet/${id}`, {
    method: 'PUT',
    body: buildPetFormData(payload),
  })

  return toPet(updatedPet)
}

export const deletePet = async (id: number) => {
  await request<void>(`/pet/${id}`, {
    method: 'DELETE',
  })
}
