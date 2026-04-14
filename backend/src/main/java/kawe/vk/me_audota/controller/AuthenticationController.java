package kawe.vk.me_audota.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import kawe.vk.me_audota.dto.AuthenticationDataDto;
import kawe.vk.me_audota.model.Usuario;
import kawe.vk.me_audota.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<?> efetuarLogin(@RequestBody @Valid AuthenticationDataDto data, HttpServletResponse response) {
        var tokenAuth = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var autenthication = authenticationManager.authenticate(tokenAuth);

        var usuario = (Usuario) autenthication.getPrincipal();
        var tokenJwt = tokenService.generateToken(usuario);

        // Cria o Cookie HttpOnly com o token
        Cookie jwtCookie = new Cookie("jwt", tokenJwt);
        jwtCookie.setHttpOnly(true); // O JavaScript do frontend não consegue ler este cookie
        jwtCookie.setSecure(false); // ATENÇÃO: Em produção (com HTTPS), muda para true!
        jwtCookie.setPath("/"); // O cookie será enviado para todas as rotas da API
        jwtCookie.setMaxAge(2 * 60 * 60); // Expira em 2 horas (igual ao tempo do token)

        // Adiciona o cookie à resposta
        response.addCookie(jwtCookie);

        // Retorna sucesso, mas sem o token no corpo do JSON
        Map<String, Object> body = new HashMap<>();
        body.put("id", usuario.getId());
        body.put("email", usuario.getEmail());

        return ResponseEntity.ok(body);
    }

    // Novo endpoint para fazer logout e limpar o cookie
    @PostMapping("/logout")
    public ResponseEntity<?> efetuarLogout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Em produção, true
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Deleta o cookie imediatamente

        response.addCookie(jwtCookie);
        return ResponseEntity.ok().build();
    }
}