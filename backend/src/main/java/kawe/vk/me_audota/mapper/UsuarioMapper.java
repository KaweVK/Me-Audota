package kawe.vk.me_audota.mapper;

import kawe.vk.me_audota.dto.RegisterUsuarioDTO;
import kawe.vk.me_audota.dto.ResponseUsuarioDTO;
import kawe.vk.me_audota.model.Pet;
import kawe.vk.me_audota.model.Usuario;
import kawe.vk.me_audota.repository.PetRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class UsuarioMapper {

    @Autowired
    protected PetRepository petRepository;

    @Mapping(target = "petsAnunciados", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registerDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    public abstract Usuario toEntity(RegisterUsuarioDTO dto);

    @Mapping(source = "petsAnunciados", target = "petsAnunciadosIds")
    public abstract ResponseUsuarioDTO toResponseDTO(Usuario usuario);

    protected Long map(Pet pet) {
        return pet != null ? pet.getId() : null;
    }
}