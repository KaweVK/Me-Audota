package kawe.vk.me_audota.service;

import kawe.vk.me_audota.dto.ResponsePetDTO;
import kawe.vk.me_audota.dto.RegisterPetDTO;
import kawe.vk.me_audota.mapper.PetMapper;
import kawe.vk.me_audota.model.Pet;
import kawe.vk.me_audota.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final PetImagemService petImagemService;
    private final PetMapper petMapper;

    public Optional<ResponsePetDTO> findById(Long id) {
        var pet = petRepository.findById(id);
        if (pet.isPresent()) {
            return pet.map(petMapper::toResponseDTO);
        } else {
            throw new IllegalArgumentException("Pet com ID " + id + " não existe");
        }
    }

    public Page<ResponsePetDTO> findAll(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> result = petRepository.findAll(pageable);
        return result.map(petMapper::toResponseDTO);
    }

    public Optional<Pet> create(RegisterPetDTO registerPetDTO) {
        var pet = petMapper.toEntity(registerPetDTO);
        pet.setImagens(petImagemService.uploadImagens(registerPetDTO.imagens()));
        //adicionar validate
        return Optional.of(petRepository.save(pet));
    }

    public Optional<ResponsePetDTO> update(Long id, RegisterPetDTO registerPetDTO) {
        var pet = petRepository.findById(id);
        if (pet.isPresent()) {
            Pet petToUpdate = pet.get();
            petToUpdate.setNome(registerPetDTO.nome());
            petToUpdate.setDescricao(registerPetDTO.descricao());
            petToUpdate.setIdadeMes(registerPetDTO.idadeMes());
            petToUpdate.setIdadeAno(registerPetDTO.idadeAno());
            petToUpdate.setEspecie(registerPetDTO.especie());
            petToUpdate.setCor(registerPetDTO.cor());
            petToUpdate.setSexo(registerPetDTO.sexo());
            petToUpdate.setStatus(registerPetDTO.status());

            List<String> imagensMantidas = resolveImagensMantidas(petToUpdate.getImagens(), registerPetDTO.imagensMantidas());
            List<String> novasImagens = petImagemService.uploadImagens(registerPetDTO.imagens());

            List<String> imagensAtualizadas = new ArrayList<>(imagensMantidas);
            imagensAtualizadas.addAll(novasImagens);
            petToUpdate.setImagens(imagensAtualizadas);

            Pet petUpdated = petRepository.save(petToUpdate);
            return Optional.of(petMapper.toResponseDTO(petUpdated));
        } else {
            throw new IllegalArgumentException("Pet com ID " + id + " não existe");
        }
    }

    public void delete(Long id) {
        var pet = petRepository.findById(id);
        if (pet.isPresent()) {
            petRepository.delete(pet.get());
        } else {
            throw new IllegalArgumentException("Pet com ID " + id + " não existe");
        }
    }

    private List<String> resolveImagensMantidas(List<String> imagensAtuais, List<String> imagensMantidas) {
        List<String> imagensSeguras = imagensAtuais == null
                ? Collections.emptyList()
                : imagensAtuais;

        if (imagensMantidas == null || imagensMantidas.isEmpty()) {
            return Collections.emptyList();
        }

        return imagensMantidas.stream()
                .filter(imagensSeguras::contains)
                .toList();
    }
}
