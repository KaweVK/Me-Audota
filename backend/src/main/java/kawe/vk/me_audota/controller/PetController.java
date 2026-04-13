package kawe.vk.me_audota.controller;

import kawe.vk.me_audota.dto.RegisterPetDTO;
import kawe.vk.me_audota.dto.ResponsePetDTO;
import kawe.vk.me_audota.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pet")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping(
            value = "/{id}"
    )
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        var pet = petService.findById(id);
        if (pet.isPresent()) {
            return ResponseEntity.ok().body(pet);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/")
    public ResponseEntity<Page<ResponsePetDTO>> findAll(
            @RequestParam(value = "page", defaultValue = "0")
            Integer page,
            @RequestParam(value = "size", defaultValue = "10")
            Integer size
    ) {
        Page<ResponsePetDTO> pets = petService.findAll(page, size);
        return ResponseEntity.ok(pets);
    }

    @PostMapping(
            value = "/",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE}
    )
    public ResponseEntity<Object> create(@ModelAttribute RegisterPetDTO registerPetDTO) {
        var pet = petService.create(registerPetDTO);
        return ResponseEntity.ok().body(pet);
    }

    @PutMapping(
            value = "/{id}",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE}
    )
    public ResponseEntity<Object> update(@PathVariable Long id, @ModelAttribute RegisterPetDTO registerPetDTO) {
        var pet = petService.update(id, registerPetDTO);
        return ResponseEntity.ok().body(pet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        petService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
