import { PetCollectionPage } from '../components/pets/PetCollectionPage'

export const PetsAdotadosPage = () => {
  return (
    <PetCollectionPage
      title="Pets adotados"
      description="Veja abaixo algus pets que conseguiram uma familía pelo MeAudota."
      emptyTitle="Nenhum pet adotado ainda"
      emptyDescription="Quando um cadastro for atualizado para adotado, ele passa a aparecer aqui."
      filter={(pet) => pet.status === 'ADOTADO'}
    />
  )
}
