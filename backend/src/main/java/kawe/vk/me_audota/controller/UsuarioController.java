package kawe.vk.me_audota.controller;

import kawe.vk.me_audota.dto.RegisterUsuarioDTO;
import kawe.vk.me_audota.dto.ResponseUsuarioDTO;
import kawe.vk.me_audota.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<ResponseUsuarioDTO> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.findById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/")
    public ResponseEntity<Page<ResponseUsuarioDTO>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(usuarioService.findAll(page, size));
    }

    @PostMapping(value = "/", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ResponseUsuarioDTO> create(@ModelAttribute RegisterUsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.create(dto));
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ResponseUsuarioDTO> update(@PathVariable Long id, @ModelAttribute RegisterUsuarioDTO dto) {
        try {
            return ResponseEntity.ok(usuarioService.update(id, dto));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            usuarioService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}