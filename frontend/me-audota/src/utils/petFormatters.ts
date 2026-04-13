import type { Pet } from '../types/pet'

const specieLabelMap: Record<string, string> = {
  CACHORRO: 'Cachorro',
  GATO: 'Gato',
}

const statusLabelMap: Record<string, string> = {
  DISPONIVEL: 'Disponível',
  PROCESSO_DE_ADOCAO: 'Em processo',
  ADOTADO: 'Adotado',
}

const sexLabelMap: Record<string, string> = {
  M: 'Macho',
  F: 'Fêmea',
}

export const formatEspecie = (especie: string): string =>
  specieLabelMap[especie] ?? especie

export const formatStatus = (status: string): string =>
  statusLabelMap[status] ?? status

export const formatSexo = (sexo: string | undefined): string => {
  if (!sexo) {
    return 'Não informado'
  }

  return sexLabelMap[sexo.toUpperCase()] ?? sexo
}

export const formatAge = (anos: number, meses: number): string => {
  const yearPart =
    anos > 0 ? `${anos} ${anos > 1 ? 'anos' : 'ano'}` : undefined
  const monthPart =
    meses > 0 ? `${meses} ${meses > 1 ? 'meses' : 'mês'}` : undefined

  if (!yearPart && !monthPart) {
    return 'Idade não informada'
  }

  if (yearPart && monthPart) {
    return `${yearPart} e ${monthPart}`
  }

  return yearPart ?? monthPart ?? 'Idade não informada'
}

export const getMainImage = (pet: Pick<Pet, 'imagens'>): string =>
  pet.imagens[0] ?? '/me-audota.png'

export const truncate = (text: string, maxLength = 96): string => {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}...`
}
