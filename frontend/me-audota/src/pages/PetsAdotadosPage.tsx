import { useCallback } from 'react'
import { PetCollectionPage } from '../components/pets/PetCollectionPage'
import type { Pet } from '../types/pet'

export const PetsAdotadosPage = () => {
  const filter = useCallback((pet: Pet) => pet.status === 'ADOTADO', [])

  return (
    <PetCollectionPage
      title="Pets adotados"
      description="Veja abaixo alguns pets que conseguiram uma família pelo MeAudota."
      emptyTitle="Nenhum pet adotado ainda"
      emptyDescription="Quando um cadastro for atualizado para adotado, ele aparece aqui."
      filter={filter}
    />
  )
}