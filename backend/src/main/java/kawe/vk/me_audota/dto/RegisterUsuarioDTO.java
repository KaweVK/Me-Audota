package kawe.vk.me_audota.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kawe.vk.me_audota.model.enums.Role;

public record RegisterUsuarioDTO(
        Long id,
        @NotNull
        @NotBlank
        @Size(min = 1, max = 100)
        String nome,

        @NotNull
        @NotBlank
        @Email
        @Size(min = 1, max = 100)
        String email,

        @NotNull
        @NotBlank
        @Size(min = 6, max = 100)
        String senha,

        @NotNull
        @NotBlank
        @Size(min = 1, max = 100)
        String telefone,
        @NotNull
        Role role
) {}