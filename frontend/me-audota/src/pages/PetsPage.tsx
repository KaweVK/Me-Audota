import { PetCollectionPage } from '../components/pets/PetCollectionPage'

export const PetsPage = () => {
  return (
    <PetCollectionPage
      title="Pets disponiveis para adocao"
      description="Lista principal ligada ao endpoint autenticado de pets. Aqui ficam os animais disponiveis ou em processo de adocao."
      emptyTitle="Nenhum pet disponivel"
      emptyDescription="Cadastre um novo pet para iniciar a vitrine da plataforma."
      filter={(pet) =>
        pet.status === 'DISPONIVEL' || pet.status === 'PROCESSO_DE_ADOCAO'
      }
    />
  )
}
