package kawe.vk.me_audota.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kawe.vk.me_audota.model.enums.Especie;
import kawe.vk.me_audota.model.enums.StatusPet;

import java.util.List;

public record ResponsePetDTO(
        Long id,
        @NotNull
        @Size(min = 1, max = 100)
        @NotBlank
        String nome,
        List<String> imagens,
        @Size(max = 200)
        String descricao,
        @NotNull
        Integer idadeMes,
        @NotNull
        Integer idadeAno,
        @NotNull
        Especie especie,
        @NotNull
        String cor,
        String sexo,
        @NotNull
        StatusPet status,
        @NotNull
        Long anuncianteId
) {
}
