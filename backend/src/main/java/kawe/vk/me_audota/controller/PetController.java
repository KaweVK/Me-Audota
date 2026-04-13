package kawe.vk.me_audota.controller;

import kawe.vk.me_audota.dto.PetDTO;
import kawe.vk.me_audota.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<PetDTO>> findAll(
            @RequestParam(value = "page", defaultValue = "0")
            Integer page,
            @RequestParam(value = "size", defaultValue = "10")
            Integer size
    ) {
        Page<PetDTO> pets = petService.findAll(page, size);
        return ResponseEntity.ok(pets);
    }

    @PostMapping("/")
    public ResponseEntity<Object> create(@RequestBody PetDTO petDTO) {
        var pet = petService.create(petDTO);
        return ResponseEntity.ok().body(pet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody PetDTO petDTO) {
        var pet = petService.update(id, petDTO);
        return ResponseEntity.ok().body(pet);
    }
}
