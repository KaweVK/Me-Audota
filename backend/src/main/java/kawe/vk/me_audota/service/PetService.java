package kawe.vk.me_audota.service;

import kawe.vk.me_audota.dto.PetDTO;
import kawe.vk.me_audota.mapper.PetMapper;
import kawe.vk.me_audota.model.Pet;
import kawe.vk.me_audota.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final PetMapper petMapper;

    public Optional<PetDTO> findById(Integer id) {
        var pet = petRepository.findById(id);
        if (pet.isPresent()) {
            return pet.map(petMapper::toDTO);
        } else {
            throw new IllegalArgumentException("Pet com ID " + id + " não existe");
        }
    }

    public Page<PetDTO> findAll(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> result = petRepository.findAll(pageable);
        return result.map(petMapper::toDTO);
    }

    public Optional<Pet> create(PetDTO petDTO) {
        var pet = petMapper.toEntity(petDTO);
        //adicionar if para verificar imagem
        //adicionar validate
        return Optional.of(petRepository.save(pet));
    }

    public Optional<PetDTO> update(Integer id, PetDTO petDTO) {
        var pet = petRepository.findById(id);
        if (pet.isPresent()) {
            Pet petToUpdate = pet.get();
            petToUpdate.setNome(petDTO.nome());
            petToUpdate.setDescricao(petDTO.descricao());
            petToUpdate.setIdadeMes(petDTO.idadeMes());
            petToUpdate.setIdadeAno(petDTO.idadeAno());
            petToUpdate.setEspecie(petDTO.especie());
            petToUpdate.setCor(petDTO.cor());
            petToUpdate.setSexo(petDTO.sexo());
            petToUpdate.setStatus(petDTO.status());

            //adicionar if para verificar imagem
            //adicionar validatepo
            Pet petUpdated = petRepository.save(petToUpdate);
            return Optional.of(petMapper.toDTO(petUpdated));
        } else {
            throw new IllegalArgumentException("Pet com ID " + id + " não existe");
        }
    }

    public void delete(Integer id) {
        var pet = petRepository.findById(id);
        if (pet.isPresent()) {
            petRepository.delete(pet.get());
        } else {
            throw new IllegalArgumentException("Pet com ID " + id + " não existe");
        }
    }

}
