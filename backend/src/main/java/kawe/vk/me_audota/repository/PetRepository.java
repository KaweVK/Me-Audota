package kawe.vk.me_audota.repository;

import kawe.vk.me_audota.model.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PetRepository extends JpaRepository<Pet, Long> {

    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.imagens WHERE p.id = :id")
    Optional<Pet> findById(@Param("id") Long id);

    @EntityGraph(attributePaths = {"imagens"})
    Page<Pet> findAll(Pageable pageable);
}
