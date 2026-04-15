package kawe.vk.me_audota.repository;

import kawe.vk.me_audota.model.Pet;
import kawe.vk.me_audota.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

     @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.petsAnunciados WHERE u.id = :id")
     Optional<Usuario> findById(@Param("id") Long id);

     @EntityGraph(attributePaths = {"petsAnunciados"})
     Page<Usuario> findAll(Pageable pageable);

     Optional<Usuario> findByEmail(String email);
}
