package kawe.vk.me_audota.mapper;

import kawe.vk.me_audota.dto.PetDTO;
import kawe.vk.me_audota.model.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PetMapper {

    PetMapper INSTANCE = Mappers.getMapper( PetMapper.class );

     Pet toEntity(PetDTO petDTO);

     PetDTO toDTO(Pet pet);
}
