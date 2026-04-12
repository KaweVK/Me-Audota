package kawe.vk.me_audota.mapper;

import kawe.vk.me_audota.dto.PetDTO;
import kawe.vk.me_audota.model.Pet;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PetMapper {
     Pet toEntity(PetDTO petDTO);

     PetDTO toDTO(Pet pet);
}
