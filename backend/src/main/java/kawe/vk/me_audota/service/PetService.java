package kawe.vk.me_audota.service;

import kawe.vk.me_audota.dto.RegisterPetDTO;
import kawe.vk.me_audota.dto.ResponsePetDTO;
import kawe.vk.me_audota.mapper.PetMapper;
import kawe.vk.me_audota.model.Pet;
import kawe.vk.me_audota.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final PetImagemService petImagemService;
    private final PetMapper petMapper;

    public ResponsePetDTO findById(Long id) {
        return petRepository.findById(id)
                .map(petMapper::toResponseDTO)
                .orElseThrow(() -> new NoSuchElementException("Pet com ID " + id + " não existe"));
    }

    public Page<ResponsePetDTO> findAll(int page, int size) {
        return petRepository.findAll(PageRequest.of(page, size))
                .map(petMapper::toResponseDTO);
    }

    public Pet create(RegisterPetDTO dto) {
        Pet pet = petMapper.toEntity(dto);
        pet.setImagens(petImagemService.uploadImagens(dto.imagens()));
        return petRepository.save(pet);
    }

    public ResponsePetDTO update(Long id, RegisterPetDTO dto) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pet com ID " + id + " não existe"));

        pet.setNome(dto.nome());
        pet.setDescricao(dto.descricao());
        pet.setIdadeMes(dto.idadeMes());
        pet.setIdadeAno(dto.idadeAno());
        pet.setEspecie(dto.especie());
        pet.setCor(dto.cor());
        pet.setSexo(dto.sexo());
        pet.setStatus(dto.status());
        pet.setImagens(mergeImagens(pet.getImagens(), dto.imagensMantidas(), dto.imagens()));

        return petMapper.toResponseDTO(petRepository.save(pet));
    }

    public void delete(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pet com ID " + id + " não existe"));
        petRepository.delete(pet);
    }

    private List<String> mergeImagens(List<String> atuais, List<String> mantidas, List<MultipartFile> novas
    ) {
        List<String> resultado = new ArrayList<>();

        if (mantidas != null && !mantidas.isEmpty()) {
            List<String> base = atuais != null ? atuais : Collections.emptyList();
            mantidas.stream().filter(base::contains).forEach(resultado::add);
        }

        resultado.addAll(petImagemService.uploadImagens(novas));
        return resultado;
    }
}