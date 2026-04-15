package kawe.vk.me_audota.controller;

import kawe.vk.me_audota.dto.RegisterPetDTO;
import kawe.vk.me_audota.dto.ResponsePetDTO;
import kawe.vk.me_audota.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/pet")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping("/{id}")
    public ResponseEntity<ResponsePetDTO> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(petService.findById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/")
    public ResponseEntity<Page<ResponsePetDTO>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(petService.findAll(page, size));
    }

    @PostMapping(value = "/", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object> create(@ModelAttribute RegisterPetDTO dto) {
        return ResponseEntity.ok(petService.create(dto));
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object> update(@PathVariable Long id, @ModelAttribute RegisterPetDTO dto) {
        try {
            return ResponseEntity.ok(petService.update(id, dto));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            petService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}