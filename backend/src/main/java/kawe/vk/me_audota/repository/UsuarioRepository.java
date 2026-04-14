package kawe.vk.me_audota.repository;

import kawe.vk.me_audota.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

     Optional<Usuario> findByEmail(String email);
}
