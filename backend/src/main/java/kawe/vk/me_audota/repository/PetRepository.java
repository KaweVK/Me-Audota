package kawe.vk.me_audota.repository;

import kawe.vk.me_audota.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {
}
