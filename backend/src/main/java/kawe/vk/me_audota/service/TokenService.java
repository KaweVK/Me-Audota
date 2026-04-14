package kawe.vk.me_audota.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import kawe.vk.me_audota.exceptions.InvalidTokenJWT;
import kawe.vk.me_audota.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(Usuario usuario) {
        try {
            var algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("UniVendas")
                    .withSubject(usuario.getEmail())
                    .withClaim("id", String.valueOf(usuario.getId()))
                    .withExpiresAt(dataExpiracao())
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar JWT", exception);
        }
    }

    public String getSubject(String token) throws InvalidTokenJWT {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("UniVendas")
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException exception){
            throw new InvalidTokenJWT("Invalid JWT");
        }
    }

    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

}
