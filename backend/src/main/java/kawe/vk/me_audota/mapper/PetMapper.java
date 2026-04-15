package kawe.vk.me_audota.mapper;

import kawe.vk.me_audota.dto.RegisterPetDTO;
import kawe.vk.me_audota.dto.ResponsePetDTO;
import kawe.vk.me_audota.model.Pet;
import kawe.vk.me_audota.repository.UsuarioRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class PetMapper {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Mapping(target = "imagens", ignore = true)
    @Mapping(target = "registerDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    @Mapping(target = "anunciante", expression = "java(usuarioRepository.findById(registerPetDTO.anuncianteId()).orElse(null))")
    public abstract Pet toEntity(RegisterPetDTO registerPetDTO);

    @Mapping(source = "anunciante.id", target = "anuncianteId")
    public abstract ResponsePetDTO toResponseDTO(Pet pet);
}
