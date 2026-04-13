export type PetEspecie = 'CACHORRO' | 'GATO' | string

export type PetStatus = 'DISPONIVEL' | 'PROCESSO_DE_ADOCAO' | 'ADOTADO' | string

export type PetSexo = 'M' | 'F' | string

export interface Pet {
  id: number
  nome: string
  imagens: string[]
  descricao: string
  idadeMes: number
  idadeAno: number
  especie: PetEspecie
  cor: string
  sexo?: PetSexo
  status: PetStatus
}

export interface CreatePetPayload {
  nome: string
  imagens: File[]
  descricao: string
  idadeMes: number
  idadeAno: number
  especie: PetEspecie
  cor: string
  sexo?: PetSexo
  status: PetStatus
}

export interface UpdatePetPayload extends CreatePetPayload {
  imagensMantidas: string[]
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
}
