package kawe.vk.me_audota.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import kawe.vk.me_audota.dto.AuthenticationDataDto;
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

import java.util.Map;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class AuthenticationController {

    private static final String JWT_COOKIE_NAME = "jwt";
    private static final int TOKEN_DURATION_SECONDS = 2 * 60 * 60;

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> efetuarLogin(
            @RequestBody @Valid AuthenticationDataDto data,
            HttpServletResponse response
    ) {
        var tokenAuth = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var authentication = authenticationManager.authenticate(tokenAuth);

        var usuario = (Usuario) authentication.getPrincipal();
        var tokenJwt = tokenService.generateToken(usuario);

        response.addCookie(buildJwtCookie(tokenJwt, TOKEN_DURATION_SECONDS));

        return ResponseEntity.ok(Map.of(
                "id", usuario.getId(),
                "email", usuario.getEmail()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> efetuarLogout(HttpServletResponse response) {
        response.addCookie(buildJwtCookie(null, 0));
        return ResponseEntity.ok().build();
    }

    private Cookie buildJwtCookie(String value, int maxAge) {
        Cookie jwtCookie = new Cookie(JWT_COOKIE_NAME, value);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(maxAge);
        return jwtCookie;
    }
}
