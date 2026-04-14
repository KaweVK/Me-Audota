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
     PetRepository petRepository;

     @Mapping(source = "petsAnunciadosIds", target = "petsAnunciados")
     public abstract Usuario toEntity(ResponseUsuarioDTO responseUsuarioDTO);

     public abstract Usuario toEntity(RegisterUsuarioDTO registerUsuarioDTO);

     @Mapping(source = "petsAnunciados", target = "petsAnunciadosIds")
     public abstract ResponseUsuarioDTO toResponseDTO(Usuario usuario);

     public abstract RegisterUsuarioDTO toRegisterDTO(Usuario usuario);

     protected Pet map(Long id) {
          if (id == null) {
               return null;
          }
          return petRepository.findById(id).orElse(null);
     }

        protected Long map(Pet pet) {
             return pet != null ? pet.getId() : null;
        }
}
