import { useCallback } from 'react'
import { PetCollectionPage } from '../components/pets/PetCollectionPage'
import type { Pet } from '../types/pet'

export const PetsPage = () => {
  // useCallback garante referência estável → evita re-execução do useMemo interno
  const filter = useCallback(
    (pet: Pet) => pet.status === 'DISPONIVEL' || pet.status === 'PROCESSO_DE_ADOCAO',
    [],
  )

  return (
    <PetCollectionPage
      title="Pets para adoção"
      description="Lista principal de pets disponíveis ou em processo de adoção."
      emptyTitle="Nenhum pet disponível"
      emptyDescription="Cadastre um novo pet para iniciar a vitrine da plataforma."
      filter={filter}
    />
  )
}