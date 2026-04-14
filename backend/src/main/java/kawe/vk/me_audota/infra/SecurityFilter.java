package kawe.vk.me_audota.infra;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kawe.vk.me_audota.exceptions.InvalidTokenJWT;
import kawe.vk.me_audota.repository.UsuarioRepository;
import kawe.vk.me_audota.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Agora recupera o token do Cookie em vez do Header
        var token = recoverToken(request);

        if(token != null) {
            String subject = null;
            try {
                subject = tokenService.getSubject(token);
            } catch (InvalidTokenJWT e) {
                throw new RuntimeException(e);
            }
            var usuario = repository.findByEmail(subject);

            if (usuario.isPresent()) {
                var autenthication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.get().getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(autenthication);
            }
        }
        filterChain.doFilter(request, response);
    }

    // Método modificado para procurar o cookie "jwt"
    private String recoverToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null; // Retorna null se não encontrar o cookie
    }
}