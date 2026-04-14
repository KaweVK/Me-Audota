package kawe.vk.me_audota.controller;

import kawe.vk.me_audota.dto.RegisterUsuarioDTO;
import kawe.vk.me_audota.dto.ResponseUsuarioDTO;
import kawe.vk.me_audota.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @GetMapping(
            value = "/{id}"
    )
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        var usuario = usuarioService.findById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok().body(usuario);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/")
    public ResponseEntity<Page<ResponseUsuarioDTO>> findAll(
            @RequestParam(value = "page", defaultValue = "0")
            Integer page,
            @RequestParam(value = "size", defaultValue = "10")
            Integer size
    ) {
        Page<ResponseUsuarioDTO> usuarios = usuarioService.findAll(page, size);
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping(
            value = "/",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE}
    )
    public ResponseEntity<Object> create(@ModelAttribute RegisterUsuarioDTO registerUsuarioDTO) {
        var usuario = usuarioService.create(registerUsuarioDTO);
        return ResponseEntity.ok().body(usuario);
    }

    @PutMapping(
            value = "/{id}",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE}
    )
    public ResponseEntity<Object> update(@PathVariable Long id, @ModelAttribute RegisterUsuarioDTO registerUsuarioDTO) {
        var usuario = usuarioService.update(id, registerUsuarioDTO);
        return ResponseEntity.ok().body(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}