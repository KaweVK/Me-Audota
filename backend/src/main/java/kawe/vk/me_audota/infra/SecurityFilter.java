package kawe.vk.me_audota.infra;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kawe.vk.me_audota.repository.UsuarioRepository;
import kawe.vk.me_audota.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String tokenJWT = recuperarToken(request);

            if (tokenJWT != null) {
                String subject = tokenService.getSubject(tokenJWT);
                var usuarioOptional = usuarioRepository.findByEmail(subject);

                if (usuarioOptional.isPresent()) {
                    var usuario = usuarioOptional.get();

                    var authentication = new UsernamePasswordAuthenticationToken(
                            usuario,
                            null,
                            Collections.emptyList()
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("Erro ao autenticar requisição: {}", e.getMessage(), e);
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }

    private String recuperarToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.substring(7);
    }
}