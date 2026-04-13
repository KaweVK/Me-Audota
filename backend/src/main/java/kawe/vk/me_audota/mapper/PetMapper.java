package kawe.vk.me_audota.mapper;

import kawe.vk.me_audota.dto.RegisterPetDTO;
import kawe.vk.me_audota.dto.ResponsePetDTO;
import kawe.vk.me_audota.model.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PetMapper {
     Pet toEntity(ResponsePetDTO responsePetDTO);

     @Mapping(target = "imagens", ignore = true)
     Pet toEntity(RegisterPetDTO registerPetDTO);

     ResponsePetDTO toResponseDTO(Pet pet);

     @Mapping(target = "imagens", ignore = true)
     @Mapping(target = "imagensMantidas", ignore = true)
     RegisterPetDTO toRegisterDTO(Pet pet);
}
