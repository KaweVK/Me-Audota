package kawe.vk.me_audota.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ResponseUsuarioDTO(
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
        String telefone,
        List<Long> petsAnunciadosIds
) {
}
