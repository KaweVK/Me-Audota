package kawe.vk.me_audota.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kawe.vk.me_audota.model.Pet;

import java.util.List;

public record RegisterUsuarioDTO(
        Long id,
        @NotNull
        @Size(min = 1, max = 100)
        @NotBlank
        String nome,
        @NotNull
        @Size(min = 1, max = 100)
        @NotBlank
        String email,
        @NotNull
        @Size(min = 1, max = 100)
        @NotBlank
        String senha,
        @NotNull
        @Size(min = 1, max = 100)
        @NotBlank
        String telefone,
        List<Pet> petsAnunciados
) {
}
