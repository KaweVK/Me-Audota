import { PetCollectionPage } from '../components/pets/PetCollectionPage'

export const PetsPage = () => {
  return (
    <PetCollectionPage
      title="Pets para adoção"
      description="Lista principal de pets disponíveis ou em processo de adoção."
      emptyTitle="Nenhum pet disponível"
      emptyDescription="Cadastre um novo pet para iniciar a vitrine da plataforma."
      filter={(pet) =>
        pet.status === 'DISPONIVEL' || pet.status === 'PROCESSO_DE_ADOCAO'
      }
    />
  )
}
