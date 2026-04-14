import { PetCollectionPage } from '../components/pets/PetCollectionPage'

export const PetsAdotadosPage = () => {
  return (
    <PetCollectionPage
      title="Pets adotados"
      description="Historico dos pets cujo status ja foi marcado como adotado no back-end."
      emptyTitle="Nenhum pet adotado ainda"
      emptyDescription="Quando um cadastro for atualizado para adotado, ele passa a aparecer aqui."
      filter={(pet) => pet.status === 'ADOTADO'}
    />
  )
}
