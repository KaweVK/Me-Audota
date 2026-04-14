package kawe.vk.me_audota.controller;

import jakarta.validation.Valid;
import kawe.vk.me_audota.dto.AuthenticationDataDto;
import kawe.vk.me_audota.dto.TokenJwtDto;
import kawe.vk.me_audota.model.Usuario;
import kawe.vk.me_audota.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager manager;
    private final TokenService tokenService;

    @PostMapping
    public ResponseEntity<Object> login(@RequestBody @Valid AuthenticationDataDto dto) {
        var token = new UsernamePasswordAuthenticationToken(dto.email(), dto.senha());
        var auth = manager.authenticate(token);

        var tokenJwt = tokenService.generateToken((Usuario) auth.getPrincipal());

        return ResponseEntity.ok(new TokenJwtDto(tokenJwt));
    }

}
